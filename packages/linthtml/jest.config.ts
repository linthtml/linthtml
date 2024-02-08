import type { JestConfigWithTsJest } from "ts-jest";
/* eslint-disable */
export default {
  displayName: "linthtml",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: ["node_modules"],
  extensionsToTreatAsEsm: [".ts"],
  coverageDirectory: "../coverage/linthtml"
} satisfies JestConfigWithTsJest;
