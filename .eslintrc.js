/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "standard"],
  env: {
    es2020: true,
    node: true
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2020
  },
  globals: {
    beforeEach: true,
    describe: true,
    it: true
  },
  rules: {
    camelcase: "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "array-element-newline": ["error", "consistent"],
    "no-var": "error",
    "newline-per-chained-call": "error",
    "space-before-function-paren": ["error", "never"],
    "linebreak-style": ["error", "unix"]
  },
  overrides: [
    {
      files: ["**/*.ts"],
      env: {
        es2020: true,
        node: true
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: __dirname
      },
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked", "plugin:prettier/recommended"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/consistent-type-imports": "error"
      }
    }
  ]
};
