const globals = require("globals");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");
const neostandard = require("neostandard");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = [
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
    noStyle: true,
    ts: true
  }),
  ...compat.extends("eslint:recommended"),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        beforeEach: true,
        describe: true,
        it: true
      },

      ecmaVersion: 2020,
      sourceType: "commonjs"
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
    }
  },
  ...compat
    .extends("plugin:@typescript-eslint/recommended-type-checked", "plugin:prettier/recommended")
    .map((config) => ({
      ...config,
      files: ["**/*.ts"]
    })),
  {
    files: ["**/*.ts"],

    plugins: {
      "@typescript-eslint": typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.node
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "commonjs",

      parserOptions: {
        project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: "/home/benjaminj/Workspace/linthtml/linthtml"
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
];
