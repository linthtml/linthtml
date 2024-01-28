import type { JestConfigWithTsJest } from "ts-jest";

export default {
  displayName: "dom-utils",
  preset: "../../jest.preset.js",

  coverageDirectory: "../../coverage/dom-utils",
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
  extensionsToTreatAsEsm: [".ts"]
} satisfies JestConfigWithTsJest;
