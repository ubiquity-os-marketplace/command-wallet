import { StaticDecode, Type as T } from "@sinclair/typebox";

export const commandSchema = T.Object({
  name: T.Literal("wallet", { description: "Register your wallet address for payments. Use '/wallet unset' to unlink your wallet.", examples: ['/wallet ubq.eth'] }),
  parameters: T.Object({
    walletAddress: T.String(),
    unset: T.Boolean({ default: false }),
  }),
});

export type Command = StaticDecode<typeof commandSchema>;
