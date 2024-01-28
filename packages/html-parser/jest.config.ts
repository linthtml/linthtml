import type { JestConfigWithTsJest } from "ts-jest";

export default {
  displayName: "html-parser",
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
  coverageDirectory: "../../coverage/html-parser"
} satisfies JestConfigWithTsJest;
