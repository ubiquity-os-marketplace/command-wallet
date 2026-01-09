import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { drop } from "@mswjs/data";
import { Octokit } from "@octokit/rest";
import { CommentHandler } from "@ubiquity-os/plugin-sdk";
import { Logs } from "@ubiquity-os/ubiquity-os-logger";
import { ethers } from "ethers";
import { plugin } from "../src/plugin";
import { Context } from "../src/types/index";
import { db } from "./__mocks__/db";
import dbSeed from "./__mocks__/db-seed.json";
import { server } from "./__mocks__/node";
import commentCreatedPayload from "./__mocks__/payloads/comment-created.json";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => server.close());

const eventName = "issue_comment.created";

jest.unstable_mockModule("ethers", () => ({
  ethers: {
    JsonRpcProvider: jest.fn(() => ({
      resolveName: jest.fn(async () => "0x0000000000000000000000000000000000000001"),
    })),
    getAddress: (jest.requireActual("ethers") as typeof ethers).getAddress,
  },
}));

jest.unstable_mockModule("@ubiquity-os/plugin-sdk", () => ({
  postComment: jest.fn(),
}));

describe("Wallet command tests", () => {
  beforeEach(() => {
    drop(db);
    for (const dbTable of Object.keys(dbSeed)) {
      const tableName = dbTable as keyof typeof dbSeed;
      for (const dbRow of dbSeed[tableName]) {
        db[tableName].create(dbRow);
      }
    }
  });

  it("Should handle /wallet comment", async () => {
    const spy = jest.spyOn(Logs.prototype, "ok");

    // Ensure the wallet is not set in the DB before running this test
    db.users.update({ where: { id: { equals: 1 } }, data: { wallet_id: null } });
    db.wallets.delete({ where: { id: { equals: 1 } } });

    const context = {
      eventName: eventName,
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
      logger: new Logs("debug"),
      commentHandler: new CommentHandler(),
    } as unknown as Context;

    await plugin(context);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(spy).toHaveBeenLastCalledWith(
      "Successfully set wallet",
      expect.objectContaining({
        address: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        sender: "ubiquibot",
      })
    );
  }, 20000);

  it("Should handle wallet command", async () => {
    const spy = jest.spyOn(Logs.prototype, "ok");
    // Ensure the wallet is not set in the DB before running this test
    db.users.update({ where: { id: { equals: 1 } }, data: { wallet_id: null } });
    db.wallets.delete({ where: { id: { equals: 1 } } });

    const context = {
      eventName: eventName,
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
      logger: new Logs("debug"),
      commentHandler: new CommentHandler(),
    } as unknown as Context;

    await plugin(context);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(spy).toHaveBeenLastCalledWith(
      "Successfully set wallet",
      expect.objectContaining({
        address: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        sender: "ubiquibot",
      })
    );
  }, 20000);

  it("should unset a registered wallet", async () => {
    const okSpy = jest.spyOn(Logs.prototype, "ok");
    expect(db.users.findFirst({ where: { id: { equals: 1 } } })?.wallet_id).not.toBeNull();

    await plugin({
      eventName: eventName,
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet unset",
        },
      },
      command: {
        name: "wallet",
        parameters: { unset: true, walletAddress: "" },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("debug"),
      commentHandler: new CommentHandler(),
    } as unknown as Context);

    expect(okSpy).toHaveBeenCalledWith("Successfully unset wallet");
    expect(db.users.findFirst({ where: { id: { equals: 1 } } })?.wallet_id).toBeNull();
  }, 20000);

  it("should warn if the wallet is already registered to the user", async () => {
    const spy = jest.spyOn(Logs.prototype, "warn");
    await plugin({
      eventName: eventName,
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet 0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        },
      },
      command: {
        name: "wallet",
        parameters: {
          walletAddress: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
      commentHandler: new CommentHandler(),
    } as unknown as Context);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith("This wallet address is already registered to your account.");
  }, 20000);

  it("should warn if the wallet is already registered to another user", async () => {
    const spy = jest.spyOn(Logs.prototype, "warn");
    await plugin({
      eventName: eventName,
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet 0x0000000000000000000000000000000000000002",
        },
      },
      command: {
        name: "wallet",
        parameters: {
          walletAddress: "0x0000000000000000000000000000000000000002",
        },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
      commentHandler: new CommentHandler(),
    } as unknown as Context);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith("This wallet address is already registered to another user.");
  }, 20000);

  it("should allow re-registering a previously unlinked wallet to the same user", async () => {
    const okSpy = jest.spyOn(Logs.prototype, "ok");
    const warnSpy = jest.spyOn(Logs.prototype, "warn");

    await plugin({
      eventName: eventName,
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet 0x0000000000000000000000000000000000000003",
        },
      },
      command: {
        name: "wallet",
        parameters: {
          walletAddress: "0x0000000000000000000000000000000000000003",
        },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
      commentHandler: new CommentHandler(),
    } as unknown as Context);

    expect(okSpy).toHaveBeenCalledWith(
      "Successfully set wallet",
      expect.objectContaining({
        address: "0x0000000000000000000000000000000000000003",
        sender: "ubiquibot",
      })
    );
    expect(db.users.findFirst({ where: { id: { equals: 1 } } })?.wallet_id).toBe(3);

    okSpy.mockClear();
    warnSpy.mockClear();

    await plugin({
      eventName: eventName,
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet 0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        },
      },
      command: {
        name: "wallet",
        parameters: {
          walletAddress: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
      commentHandler: new CommentHandler(),
    } as unknown as Context);

    expect(okSpy).toHaveBeenCalledWith(
      "Successfully set wallet",
      expect.objectContaining({
        address: "0xefC0e701A824943b469a694aC564Aa1efF7Ab7dd",
        sender: "ubiquibot",
      })
    );
    expect(warnSpy).not.toHaveBeenCalledWith("This wallet address is already registered to another user.");
    expect(db.users.findFirst({ where: { id: { equals: 1 } } })?.wallet_id).toBe(1);
  }, 20000);

  it("should not allow registering a wallet owned by another user", async () => {
    const okSpy = jest.spyOn(Logs.prototype, "ok");
    const warnSpy = jest.spyOn(Logs.prototype, "warn");

    expect(db.users.findFirst({ where: { id: { equals: 2 } } })?.wallet_id).toBe(2);

    await plugin({
      eventName: eventName,
      config: { registerWalletWithVerification: false },
      payload: {
        ...commentCreatedPayload,
        comment: {
          ...commentCreatedPayload.comment,
          body: "/wallet 0x0000000000000000000000000000000000000002",
        },
      },
      command: {
        name: "wallet",
        parameters: {
          walletAddress: "0x0000000000000000000000000000000000000002",
        },
      },
      octokit: new Octokit(),
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
      },
      logger: new Logs("info"),
      commentHandler: new CommentHandler(),
    } as unknown as Context);

    expect(okSpy).not.toHaveBeenCalledWith(
      "Successfully set wallet",
      expect.objectContaining({
        address: "0x0000000000000000000000000000000000000002",
        sender: "ubiquibot",
      })
    );
    expect(warnSpy).toHaveBeenCalledWith("This wallet address is already registered to another user.");
    expect(db.users.findFirst({ where: { id: { equals: 1 } } })?.wallet_id).not.toBe(2);
  }, 20000);

  it("should be idempotent when repeatedly setting the same wallet address", async () => {
    const okSpy = jest.spyOn(Logs.prototype, "ok");
    const warnSpy = jest.spyOn(Logs.prototype, "warn");

    db.users.update({ where: { id: { equals: 1 } }, data: { wallet_id: null } });

    const existing = db.wallets.findFirst({ where: { address: { equals: "0x00000000000000000000000000000000000000AA" } } });
    if (existing) {
      db.wallets.delete({ where: { id: { equals: existing.id } } });
    }

    const contextFactory = () =>
      ({
        eventName: eventName,
        config: { registerWalletWithVerification: false },
        payload: {
          ...commentCreatedPayload,
          comment: {
            ...commentCreatedPayload.comment,
            body: `/wallet 0x00000000000000000000000000000000000000AA`,
          },
        },
        command: {
          name: "wallet",
          parameters: { walletAddress: "0x00000000000000000000000000000000000000AA" },
        },
        octokit: new Octokit(),
        env: {
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_KEY: process.env.SUPABASE_KEY,
        },
        logger: new Logs("info"),
        commentHandler: new CommentHandler(),
      }) as unknown as Context;

    const attempts = 5;
    for (let i = 0; i < attempts; i++) {
      await plugin(contextFactory());
    }

    expect(okSpy).toHaveBeenCalledWith(
      "Successfully set wallet",
      expect.objectContaining({
        address: "0x00000000000000000000000000000000000000AA",
        sender: "ubiquibot",
      })
    );

    expect(warnSpy).toHaveBeenCalledWith("This wallet address is already registered to your account.");

    const walletsWithAddress = db.wallets.getAll().filter((w) => w.address === "0x00000000000000000000000000000000000000AA");
    expect(walletsWithAddress.length).toBe(1);

    const userWalletId = db.users.findFirst({ where: { id: { equals: 1 } } })?.wallet_id;
    expect(userWalletId).toBe(walletsWithAddress[0].id);
  }, 20000);
});
