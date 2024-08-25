import type { Config } from "jest";
import { config } from "dotenv";

config({ path: ".dev.vars" });

const configuration: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./tests"],
  coveragePathIgnorePatterns: ["node_modules", "mocks"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover", "json-summary"],
  reporters: ["default", "jest-junit", "jest-md-dashboard"],
  coverageDirectory: "coverage",
  setupFiles: ["dotenv/config"],
};

export default configuration;
