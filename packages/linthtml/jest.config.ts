import type { JestConfigWithTsJest } from "ts-jest";

export default {
  displayName: "linthtml-core",
  preset: "../../jest.preset.js",

  testMatch: ["**/lib/__tests__/**/*.test.ts", "**/lib/rules/**/__tests__/*.ts"],

  coverageDirectory: "../../coverage/linthtml",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  }
} satisfies JestConfigWithTsJest;
