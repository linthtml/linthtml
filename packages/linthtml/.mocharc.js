const baseConfig = require("../../mocharc.base");

module.exports = {
  ...baseConfig,
  // extends: "./../../mocharc.base.js", // does not work
  spec: ["lib/__tests__/**/*.test.ts", "lib/rules/**/__tests__/*.ts"]
};
