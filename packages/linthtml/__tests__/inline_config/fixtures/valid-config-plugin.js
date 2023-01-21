const path = require("path");

module.exports = {
  rules: {
    "my-plugin/rule": "error"
  },
  plugins: [path.join(__dirname, "plugin.js")]
};
