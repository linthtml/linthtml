import type { JestConfigWithTsJest } from "ts-jest";

export default {
  displayName: "html-parser",
  preset: "../../jest.preset.js",

  coverageDirectory: "../../coverage/html-parser",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  }
} satisfies JestConfigWithTsJest;
