module.exports = {
  // Specify "require" for CommonJS
  require: ["ts-node/register", "tsconfig-paths/register"],
  extensions: ["ts"],
  spec: ["lib/__tests__/**/*.test.ts"],
  bail: true
};
