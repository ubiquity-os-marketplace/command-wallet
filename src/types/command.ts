import { StaticDecode, Type as T } from "@sinclair/typebox";

export const commandSchema = T.Object({
  name: T.Literal("wallet"),
  parameters: T.Object({
    walletAddress: T.String(),
  }),
});

export type Command = StaticDecode<typeof commandSchema>;
