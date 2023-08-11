export default {
  displayName: "html-parser",
  preset: "../../jest.preset.js",

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
