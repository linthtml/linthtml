const bulk = require("bulk-require");
const presets = bulk(__dirname, "!(index).js");

let none = (() => {
  let keys = Object.keys(presets.default);
  let obj = {};
  keys.forEach(key => obj[key] = false);
  return obj;
})();
presets.none = none;
module.exports.presets = presets;

module.exports.flattenOpts = function(optList) {
  var options = {};
  optList.forEach(function(opt) {
    if (typeof opt === 'string') {
      opt = presets[opt];
    }
    options = {
      ...options,
      ...opt
    };
  });

  return options;
};
