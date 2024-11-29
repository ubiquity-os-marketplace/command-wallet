import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "../../../types";
import { Database } from "../../../types/database";
import { Super } from "./supabase";

type WalletRow = Database["public"]["Tables"]["wallets"]["Row"];
type WalletInsert = Database["public"]["Tables"]["wallets"]["Insert"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserWithWallet = (UserRow & { wallets: WalletRow | null })[];

export class Wallet extends Super {
  constructor(supabase: SupabaseClient<Database>, context: Context) {
    super(supabase, context);
  }

  public async getAddress(id: number) {
    const userWithWallet = await this._getUserWithWallet(id);
    return this._validateAndGetWalletAddress(userWithWallet);
  }

  public async upsertWalletAddress(context: Context, address: string) {
    const payload = context.payload;

    const userData = await this._getUserData(payload);
    const registeredWalletData = await this._getRegisteredWalletData(userData);

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
  }

  private async _getUserWithWallet(id: number) {
    const { data, error } = await this.supabase.from("users").select("*, wallets(*)").filter("id", "eq", id);
    if (error) throw error;
    return data;
  }

  private _validateAndGetWalletAddress(userWithWallet: UserWithWallet): string {
    if (userWithWallet[0]?.wallets?.address === undefined) throw new Error("Wallet address is undefined");
    if (userWithWallet[0]?.wallets?.address === null) throw new Error("Wallet address is null");
    return userWithWallet[0]?.wallets?.address;
  }

  private async _checkIfUserExists(userId: number) {
    const { data, error } = await this.supabase.from("users").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data as UserRow;
  }

  private async _getUserData(payload: Context["payload"]) {
    let userData = await this._checkIfUserExists(payload.sender.id);
    if (!userData) {
      const user = payload.sender;
      userData = await this._registerNewUser(user, this._getLocationMetaData(payload));
    }
    return userData;
  }

  private async _registerNewUser(user: Context["payload"]["sender"], locationMetaData: LocationMetaData) {
    // Insert the location metadata into the locations table
    const { data: locationData, error: locationError } = await this.supabase.from("locations").insert(locationMetaData).select().single();

    if (locationError) {
      throw new Error(locationError.message);
    }

    // Get the ID of the inserted location
    const locationId = locationData.id;

    // Register the new user with the location ID
    const { data: userData, error: userError } = await this.supabase
      .from("users")
      .insert([{ id: user.id, location_id: locationId }])
      .select()
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    return userData as UserRow;
  }

  private async _checkIfWalletExists(userData: UserRow) {
    if (userData.wallet_id === null) {
      return { data: null, error: null };
    }
    const { data, error } = await this.supabase.from("wallets").select("*").eq("id", userData.wallet_id).maybeSingle();

    return { data, error };
  }

  private async _updateWalletId(walletId: number, userId: number) {
    const { error } = await this.supabase.from("users").update({ wallet_id: walletId }).eq("id", userId);

    if (error) {
      throw error;
    }
  }

  private async _getRegisteredWalletData(userData: UserRow) {
    const walletResponse = await this._checkIfWalletExists(userData);
    const walletData = walletResponse.data;
    const walletError = walletResponse.error;

    if (walletError) throw walletError;
    return walletData;
  }

  private _getLocationMetaData(payload: Context["payload"]): LocationMetaData {
    return {
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

  private async _updateExistingWallet(context: Context, { address, locationMetaData, walletData }: UpdateExistingWallet) {
    await this._updateWalletAddress(walletData.id, address);
    if (walletData.location_id) {
      await this._enrichLocationMetaData(context, walletData, locationMetaData);
    }
  }

  private async _insertNewWallet(address: string): Promise<WalletRow> {
    const newWallet: WalletInsert = {
      address: address,
    };

    const { data: walletInsertData, error: walletInsertError } = await this.supabase.from("wallets").insert(newWallet).select().single();

    if (walletInsertError) throw walletInsertError;
    return walletInsertData as WalletRow;
  }

  private async _updateWalletAddress(walletId: number, address: string) {
    const basicLocationInfo = {
      address: address,
    } as WalletRow;

    await this.supabase.from("wallets").update(basicLocationInfo).eq("id", walletId).maybeSingle();
  }

  private async _enrichLocationMetaData(context: Context, walletData: WalletRow, locationMetaData: LocationMetaData) {
    const logger = context.logger;
    if (walletData.location_id === null) {
      throw new Error("Location ID is null");
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

interface LocationMetaData {
  user_id: number;
  comment_id: number;
  issue_id: number;
  repository_id: number;
  organization_id: number;
}
