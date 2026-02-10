import { StaticDecode, Type as T } from "@sinclair/typebox";

export const commandSchema = T.Object({
  name: T.Literal("wallet", { description: "Register your wallet address for payments. Use '/wallet unset' to unlink your wallet.", examples: ['/wallet ubq.eth'] }),
  parameters: T.Object({
    walletAddress: T.String({ description: "Wallet address or ENS name to register for payouts.", examples: ["ubq.eth"] }),
    unset: T.Boolean({ default: false, description: "Set to true to unlink the currently registered wallet.", examples: [true] }),
  }),
});

export type Command = StaticDecode<typeof commandSchema>;
