import type { JestConfigWithTsJest } from "ts-jest";
/* eslint-disable */
export default {
  displayName: "linthtml",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  rootDir: "/home/benjaminj/Workspace/linthtml/linthtml/packages/linthtml",
  roots: ["/home/benjaminj/Workspace/linthtml/linthtml/packages/linthtml"],

  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: ["node_modules"],
  extensionsToTreatAsEsm: [".ts"],
  coverageDirectory: "../coverage/linthtml"
} satisfies JestConfigWithTsJest;
