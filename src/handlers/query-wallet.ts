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

export async function registerWallet(context: Context, body: string) {
  const { payload, config, logger, adapters } = context;
  const sender = payload.sender.login;
  const regexForAddress = /(0x[a-fA-F0-9]{40})/g;
  const addressMatches = body.match(regexForAddress);
  let address = addressMatches ? addressMatches[0] : null;
  const ensName = extractEnsName(body.replace("/wallet", "").trim());

  if (!address && ensName) {
    context.logger.debug("Trying to resolve address from ENS name", { ensName });
    address = await resolveAddress(ensName);
    if (!address) {
      throw new Error(`Resolving address from ENS name failed: ${ensName}`);
    }
    context.logger.debug("Resolved address from ENS name", { ensName, address });
  }

  if (!address) {
    return context.logger.info("Skipping to register a wallet address because both address/ens doesn't exist");
  }

  if (config.registerWalletWithVerification) {
    registerWalletWithVerification(context, body, address);
  }

  if (address == ethers.ZeroAddress) {
    return logger.error("Skipping to register a wallet address because user is trying to set their address to null address");
  }

  // Makes sure that the address is check-summed
  address = ethers.getAddress(address);

  if (payload.comment) {
    const { wallet } = adapters.supabase;
    await wallet.upsertWalletAddress(context, address);
    return context.logger.ok("Successfully registered wallet address", { sender, address });
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
    context.logger.fatal("Exception thrown by verifyMessage for /wallet: ", e, failedSigLogMsg);
    throw new Error(failedSigLogMsg);
  }
}

export async function resolveAddress(ensName: string) {
  // Gets the Ethereum address associated with an ENS (Ethereum Name Service) name
  // Explicitly set provider to Ethereum main-net
  console.log("1. resolveAddress");
  const rpc = new RPCHandler({
    networkId: "100",
    networkName: null,
    networkRpcs: null,
    autoStorage: null,
    cacheRefreshCycles: null,
    runtimeRpcs: null,
    rpcTimeout: null,
    proxySettings: { retryCount: 5, retryDelay: 1000, logTier: "verbose", logger: null, strictLogs: true },
  });
  console.log("2. resolveAddress");
  const provider = await rpc.getFastestRpcProvider();
  console.log("3. resolveAddress");
  return await provider.resolveName(ensName).catch((err) => {
    console.trace({ err });
    return null;
  });
}
