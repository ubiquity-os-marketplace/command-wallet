// cSpell:disable
import { factory, primaryKey } from "@mswjs/data";

/**
 * Creates an object that can be used as a db to persist data within tests
 */
export const db = factory({
  wallets: {
    id: primaryKey(Number),
    address: String,
  },
  users: {
    id: primaryKey(Number),
    login: String,
    wallet_id: Number,
  },
});
