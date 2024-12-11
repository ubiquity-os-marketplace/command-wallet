import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "../../../types";
import { Database } from "../../../types/database";
import { Super } from "./supabase";

type WalletRow = Database["public"]["Tables"]["wallets"]["Row"];
type WalletInsert = Database["public"]["Tables"]["wallets"]["Insert"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserWithWallet = UserRow & { wallets: WalletRow | null };

export class Wallet extends Super {
  constructor(supabase: SupabaseClient<Database>, context: Context) {
    super(supabase, context);
  }

  public async getAddress(id: number) {
    const userWithWallet = await this._getUserFromWalletId(id);
    if (!userWithWallet) return null;
    return this._validateAndGetWalletAddress(userWithWallet);
  }

  public async upsertWalletAddress(context: Context, address: string) {
    const payload = context.payload;

    let userData = await this._checkIfUserExists(payload.sender.id);
    if (!userData) {
      userData = await this._registerNewUser(payload.sender, this._getLocationMetaData(payload));
    }

    const registeredWalletData = await this._getRegisteredWalletData(address);

    const locationMetaData = this._getLocationMetaData(payload);

    if (!registeredWalletData) {
      await this._registerNewWallet(context, {
        address,
        locationMetaData,
        payload,
      });
    } else {
      await this._updateExistingWallet(context, {
        address,
        locationMetaData,
        payload,
        walletData: registeredWalletData,
      });
    }
    return userData;
  }

  public async unlinkWalletFromUserId(userId: number) {
    const userData = await this._getUserFromId(userId);

    if (!userData?.wallet_id) {
      throw this.context.logger.error("The user does not have an associated wallet to unlink");
    }

    const { error } = await this.supabase.from("users").update({ wallet_id: null }).eq("id", userData.id);

    if (error) {
      throw this.context.logger.error(`Could not unlink the wallet.`, error);
    }
  }

  private async _getUserFromWalletId(id: number) {
    const { data, error } = await this.supabase.from("users").select("*, wallets(*)").filter("wallet_id", "eq", id).maybeSingle();
    if (error) throw this.context.logger.error(`Could not get the user from its wallet id.`, error);
    return data;
  }

  private async _getUserFromId(id: number) {
    const { data, error } = await this.supabase.from("users").select("*, wallets(*)").filter("id", "eq", id).maybeSingle();
    if (error) throw this.context.logger.error(`Could not get the user from its id.`, error);
    return data;
  }

  private _validateAndGetWalletAddress(userWithWallet: UserWithWallet): string {
    if (userWithWallet?.wallets?.address === undefined) throw this.context.logger.error("The wallet address is undefined");
    if (userWithWallet?.wallets?.address === null) throw this.context.logger.error("The wallet address is null");
    return userWithWallet?.wallets?.address;
  }

  private async _checkIfUserExists(userId: number) {
    const { data, error } = await this.supabase.from("users").select("*").eq("id", userId).maybeSingle();
    if (error) throw this.context.logger.error(`Could not check if the user exists.`, error);
    return data as UserRow;
  }

  private async _registerNewUser(user: Context["payload"]["sender"], locationMetaData: LocationMetaData) {
    const { data: locationData, error: locationError } = await this.supabase.from("locations").insert(locationMetaData).select().single();

    if (locationError) {
      throw this.context.logger.error(`Could not retrieve the location: ${locationError.details}`, locationError);
    }

    const locationId = locationData.id;

    const { data: userData, error: userError } = await this.supabase
      .from("users")
      .insert([{ id: user.id, location_id: locationId }])
      .select()
      .single();

    if (userError) {
      throw this.context.logger.error(`A new user could not be registered.`, userError);
    }

    return userData as UserRow;
  }

  private async _checkIfWalletExists(wallet: string | number | null) {
    if (wallet === null) {
      return { data: null, error: null };
    }
    if (typeof wallet === "number") {
      return this.supabase.from("wallets").select("*").eq("id", wallet).maybeSingle();
    } else {
      return this.supabase.from("wallets").select("*").eq("address", wallet).maybeSingle();
    }
  }

  private async _updateWalletId(walletId: number, userId: number) {
    const { error } = await this.supabase.from("users").update({ wallet_id: walletId }).eq("id", userId);

    if (error) {
      throw this.context.logger.error(`Could not update the wallet.`, error);
    }
  }

  private async _getRegisteredWalletData(address: string) {
    const walletResponse = await this._checkIfWalletExists(address);
    const walletData = walletResponse.data;
    const walletError = walletResponse.error;

    if (walletError) throw this.context.logger.error(`Could not get the registered wallet.`, walletError);
    return walletData;
  }

  private _getLocationMetaData(payload: Context["payload"]): LocationMetaData {
    return {
      node_url: `${payload.issue.html_url}#issuecomment-${payload.comment.id}`,
      node_id: payload.issue.node_id,
      user_id: payload.sender.id,
      comment_id: payload.comment.id,
      issue_id: payload.issue.id,
      repository_id: payload.repository.id,
      organization_id: payload.organization?.id ?? payload.repository.owner.id,
    };
  }

  private async _registerNewWallet(context: Context, { address, locationMetaData, payload }: RegisterNewWallet) {
    const walletData = await this._insertNewWallet(address);
    await this._updateWalletId(walletData.id, payload.sender.id);
    if (walletData.location_id) {
      await this._enrichLocationMetaData(context, walletData, locationMetaData);
    }
  }

  private async _updateExistingWallet(context: Context, { locationMetaData, walletData, payload }: UpdateExistingWallet) {
    context.logger.debug(`Updating a new wallet for the user ${payload.sender.id}: ${walletData.address}`);
    const existingLinkToUserWallet = await this._getUserFromWalletId(walletData.id);
    if (existingLinkToUserWallet && existingLinkToUserWallet.id !== context.payload.sender.id) {
      throw this.context.logger.error(`Failed to register wallet because it is already associated with another user.`, existingLinkToUserWallet);
    }
    await this._updateWalletId(walletData.id, payload.sender.id);
    if (walletData.location_id) {
      await this._enrichLocationMetaData(context, walletData, locationMetaData);
    }
  }

  private async _insertNewWallet(address: string): Promise<WalletRow> {
    const newWallet: WalletInsert = {
      address: address,
    };

    const { data: walletInsertData, error: walletInsertError } = await this.supabase.from("wallets").insert(newWallet).select().single();

    if (walletInsertError) throw this.context.logger.error(`Could not insert the new wallet.`, walletInsertError);
    return walletInsertData as WalletRow;
  }

  private async _enrichLocationMetaData(context: Context, walletData: WalletRow, locationMetaData: LocationMetaData) {
    const logger = context.logger;
    if (walletData.location_id === null) {
      throw this.context.logger.error("The location ID is null.");
    }
    logger.debug("Enriching wallet location metadata", { locationMetaData });
    return this.supabase.from("locations").update(locationMetaData).eq("id", walletData.location_id);
  }
}

interface RegisterNewWallet {
  address: string;
  payload: Context["payload"];
  locationMetaData: LocationMetaData;
}

interface UpdateExistingWallet extends RegisterNewWallet {
  walletData: WalletRow;
}

type LocationMetaData = Database["public"]["Tables"]["locations"]["Insert"];
