import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ethers } from "ethers";
import { plugin } from "../src/plugin";
import { Context } from "../src/types";
import { db } from "./__mocks__/db";
import { server } from "./__mocks__/node";
import commentCreatedPayload from "./__mocks__/payloads/comment-created.json";
import dbSeed from "./__mocks__/db-seed.json";
import { Logs } from "@ubiquity-os/ubiquity-os-logger";
import { Octokit } from "@octokit/rest";

beforeAll(() => {
  server.listen();
  for (const dbTable of Object.keys(dbSeed)) {
    const tableName = dbTable as keyof typeof dbSeed;
    for (const dbRow of dbSeed[tableName]) {
      db[tableName].create(dbRow);
    }
  }
});
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
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
  beforeEach(() => {});

  it("Should handle /wallet comment", async () => {
    const spy = jest.spyOn(Logs.prototype, "ok");
    await plugin({
      eventName: "issue_comment.created",
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet ubiquibot.eth",
        },
      },
      command: null,
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
    } as unknown as Context);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(
      "Successfully registered wallet address",
      expect.objectContaining({
        address: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        sender: "ubiquibot",
      })
    );
  }, 10000);

  it("Should handle wallet command", async () => {
    const spy = jest.spyOn(Logs.prototype, "ok");
    await plugin({
      eventName: "issue_comment.created",
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "@UbiquityOS set my wallet to ubiquibot.eth",
        },
      },
      command: {
        name: "wallet",
        parameters: {
          walletAddress: "ubiquibot.eth",
        },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
    } as unknown as Context);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(
      "Successfully registered wallet address",
      expect.objectContaining({
        address: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        sender: "ubiquibot",
      })
    );
  }, 10000);
});
