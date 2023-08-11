export default {
  displayName: "linthtml-core",
  preset: "../../jest.preset.js",

  testMatch: ["**/lib/__tests__/**/*.test.ts", "**/lib/rules/**/__tests__/*.ts"],

  // preset: '../../../jest.preset.js',
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  }
};
