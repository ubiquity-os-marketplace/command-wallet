import { ethers, JsonRpcProvider } from "ethers";
import { Context } from "../types/index";

function extractEnsName(text: string) {
  const ensRegex = /^(?=.{3,40}$)([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/gm;
  const match = text.match(ensRegex);

  if (match) {
    const ensName = match[0];
    return ensName?.toLowerCase();
  }
}

export async function handleCommand(context: Context) {
  const { command } = context;
  if (!command) {
    throw new Error("Command is undefined");
  }
  const { walletAddress, unset: shouldUnset } = command.parameters;
  if (shouldUnset) {
    await unregisterWallet(context);
  } else {
    await registerWallet(context, walletAddress);
  }
}

export async function unregisterWallet(context: Context) {
  const { payload, adapters, logger } = context;
  const sender = payload.sender.id;
  logger.info(`Trying to unlink the wallet for user ${sender}`);
  await adapters.supabase.wallet.unlinkWalletFromUserId(sender);
  await context.commentHandler.postComment(context, logger.ok(`Successfully unset wallet`));
}

export async function registerWallet(context: Context, body: string) {
  const { payload, config, logger, adapters } = context;
  const sender = payload.sender.login;
  const regexForAddress = /(0x[a-fA-F0-9]{40})/g;
  const addressMatches = body.match(regexForAddress);
  let address = addressMatches ? addressMatches[0] : null;
  const ensName = extractEnsName(body.replace("/wallet", "").trim());

  if (!address && ensName) {
    logger.debug("Trying to resolve address from ENS name", { ensName });
    address = await resolveAddress(ensName);
    if (!address) {
      throw new Error(`Resolving address from ENS name failed: ${ensName}`);
    }
    logger.debug("Resolved address from ENS name", { ensName, address });
  }

  if (!address) {
    await context.commentHandler.postComment(
      context,
      logger.info(
        "Skipping to register a wallet address because both address/ens doesn't exist. Only Ethereum-compatible (EVM) addresses are supported for payouts"
      )
    );
    return;
  }

  if (config.registerWalletWithVerification) {
    registerWalletWithVerification(context, body, address);
  }

  if (address == ethers.ZeroAddress) {
    await context.commentHandler.postComment(
      context,
      logger.error("Skipping to register a wallet address because user is trying to set their address to null address")
    );
    return;
  }

  // Makes sure that the address is check-summed
  address = ethers.getAddress(address);
  if (payload.comment) {
    const { wallet } = adapters.supabase;
    const existingWalletData = await wallet.checkIfWalletExists(address);
    const userData = await wallet.getUserFromId(payload.sender.id);

    // If the wallet doesn't exist yet, create and link it
    if (!existingWalletData.data) {
      await wallet.upsertWalletAddress(context, address);
      await context.commentHandler.postComment(context, logger.ok("Successfully set wallet", { sender, address }));
      return;
    }

    // If the wallet exists and is already linked to this user, inform them
    const isOwnWallet = userData?.wallet_id && existingWalletData.data.id === userData.wallet_id;
    if (isOwnWallet) {
      await context.commentHandler.postComment(context, logger.warn("This wallet address is already registered to your account."));
    } else {
      // only actively linked wallets should return a user here
      const userFromWallet = await wallet.getUserFromWalletId(existingWalletData.data.id);
      if (!userFromWallet) {
        // If the wallet exists but is unlinked, link it to the user
        await wallet.upsertWalletAddress(context, address);
        await context.commentHandler.postComment(context, logger.ok("Successfully set wallet", { sender, address }));
      } else {
        await context.commentHandler.postComment(context, logger.warn("This wallet address is already registered to another user."));
      }
    }
  } else {
    throw new Error("Payload comment is undefined");
  }
}

function registerWalletWithVerification(context: Context, body: string, address: string) {
  const regexForSigHash = /(0x[a-fA-F0-9]{130})/g;
  const sigHashMatches = body.match(regexForSigHash);
  const sigHash = sigHashMatches ? sigHashMatches[0] : null;
  const messageToSign = "UbiquiBot";
  const failedSigLogMsg = `Skipping to register the wallet address because you have not provided a valid SIGNATURE_HASH.`;

  try {
    const isSigHashValid = sigHash && ethers.verifyMessage(messageToSign, sigHash) == ethers.getAddress(address);
    if (!isSigHashValid) {
      context.logger.fatal(failedSigLogMsg);
      throw new Error(failedSigLogMsg);
    }
  } catch (e) {
    context.logger.fatal("Exception thrown by verifyMessage for /wallet: ", { e, failedSigLogMsg });
    throw new Error(failedSigLogMsg);
  }
}

export async function resolveAddress(ensName: string) {
  // Gets the Ethereum address associated with an ENS (Ethereum Name Service) name
  // Explicitly set provider to Ethereum main-net
  const provider = new JsonRpcProvider(`https://rpc.ubq.fi/1`);
  return await provider.resolveName(ensName).catch((err) => {
    console.trace({ err });
    return null;
  });
}
