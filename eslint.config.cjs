const globals = require("globals");
const neostandard = require("neostandard");
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = tseslint.config([
  {
    ignores: [
      "**/fixtures/",
      "packages/**/dist",
      "packages/**/coverage",
      "packages/linthtml/bin/linthtml.js",
      "packages/dom-utils/rollup.config.mjs"
    ]
  },
  ...neostandard({
    globals: {
      ...globals.node
    },
    ts: true
  }),
  eslint.configs.recommended,

  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        beforeEach: true,
        describe: true,
        it: true
      }
    },

    rules: {
      camelcase: "off",
      "@stylistic/quotes": "off",
      "@stylistic/semi": "off",
      "array-element-newline": ["error", "consistent"],
      "newline-per-chained-call": "error",
      "@stylistic/space-before-function-paren": "off",
      "linebreak-style": ["error", "unix"]
    }
  },
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: __dirname
      }
    },

    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ]
    }
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off"
    }
  }
]);
