import baseConfig from "../../mocharc.base.js";

export default {
  ...baseConfig,
  specs: ["lib/__tests__/**/*.test.ts", "lib/rules/**/__tests__/*.ts"]
};
