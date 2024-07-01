import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ethers } from "ethers";
import { plugin } from "../src/plugin";
import { PluginInputs } from "../src/types";
import { db } from "./__mocks__/db";
import { server } from "./__mocks__/node";
import commentCreatedPayload from "./__mocks__/payloads/comment-created.json";
import dbSeed from "./__mocks__/db-seed.json";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock("ethers", () => ({
  ethers: {
    JsonRpcProvider: jest.fn(() => ({
      resolveName: jest.fn(async () => "0x0000000000000000000000000000000000000001"),
    })),
    getAddress: (jest.requireActual("ethers") as typeof ethers).getAddress,
  },
}));

describe("Wallet command tests", () => {
  beforeEach(() => {
    for (const dbTable of Object.keys(dbSeed)) {
      const tableName = dbTable as keyof typeof dbSeed;
      for (const dbRow of dbSeed[tableName]) {
        db[tableName].create(dbRow);
      }
    }
  });

  it("Should link a wallet", async () => {
    const spy = jest.spyOn(console, "log");
    await plugin(
      {
        eventName: "issue_comment.created",
        ref: "",
        authToken: "",
        stateId: "",
        settings: { registerWalletWithVerification: false },
        eventPayload: {
          ...commentCreatedPayload,
          comment: {
            ...commentCreatedPayload.comment,
            body: "/wallet ubiquibot.eth",
          },
        },
      } as PluginInputs,
      { SUPABASE_URL: process.env.SUPABASE_URL, SUPABASE_KEY: process.env.SUPABASE_KEY }
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith("+ Successfully registered wallet address", {
      address: "0x0000000000000000000000000000000000000001",
      sender: "ubiquibot",
    });
  });
});
