const baseConfig = require("../../mocharc.base");

module.exports = {
  ...baseConfig,
  // extends: "./../../mocharc.base.js", // does not work
  spec: ["__tests__/**/*.test.ts", "lib/rules/**/__tests__/*.ts"]
};
