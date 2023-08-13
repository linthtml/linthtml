import type { JestConfigWithTsJest } from "ts-jest";

export default {
  displayName: "dom-utils",
  preset: "../../jest.preset.js",

  coverageDirectory: "../../coverage/dom-utils",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  }
} satisfies JestConfigWithTsJest;
