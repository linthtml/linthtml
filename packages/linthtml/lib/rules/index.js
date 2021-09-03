// Export an array of all rules.
const bulk = require("bulk-require");

// All modules in this directory excluding this file
const rulesExport = bulk(__dirname, "!(index.js)");
module.exports = Object.values(rulesExport);
