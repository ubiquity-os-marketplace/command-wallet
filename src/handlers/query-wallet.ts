import { postComment } from "@ubiquity-os/plugin-sdk";
import { ethers } from "ethers";
import { Context } from "../types";
import { RPCHandler } from "@ubiquity-dao/rpc-handler";

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
  await postComment(context, logger.ok(`Successfully unset wallet`));
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
    await postComment(context, logger.info("Skipping to register a wallet address because both address/ens doesn't exist"));
    return;
  }

  if (config.registerWalletWithVerification) {
    registerWalletWithVerification(context, body, address);
  }

  if (address == ethers.ZeroAddress) {
    await postComment(context, logger.error("Skipping to register a wallet address because user is trying to set their address to null address"));
    return;
  }

  // Makes sure that the address is check-summed
  address = ethers.getAddress(address);
  if (payload.comment) {
    const { wallet } = adapters.supabase;
    await wallet.upsertWalletAddress(context, address);

    await postComment(context, logger.ok("Successfully set wallet", { sender, address }));
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
  const rpc = new RPCHandler({
    networkId: "1",
    networkName: "ethereum-mainnet",
    networkRpcs: null,
    autoStorage: false,
    cacheRefreshCycles: 3,
    runtimeRpcs: null,
    rpcTimeout: 1000,
    proxySettings: { retryCount: 0, retryDelay: 1000, logTier: "verbose", logger: null, strictLogs: true },
  });
  const provider = await rpc.getFirstAvailableRpcProvider();
  if (!provider) {
    throw new Error("Failed to get a provider.");
  }
  return await provider.resolveName(ensName).catch((err) => {
    console.trace({ err });
    return null;
  });
}
