export default {
  // Specify "require" for CommonJS
  // require: ["ts-node/register", "tsconfig-paths/register"],
  // Specify "loader" for native ESM
  loader: "ts-node/esm",
  extensions: ["ts"],
  spec: ["lib/__tests__/**/*.test.ts"],
  bail: true
};
