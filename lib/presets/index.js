const presetsDefault = require('./default');
const presetsA11y = require('./accessibility');
const presetsValidate = require('./validate');
const presets = {};

let none = (() => {
  // let keys = Object.keys(presets.default);
  let keys = Object.keys(presetsDefault);
  let obj = {};
  keys.forEach(key => obj[key] = false);
  return obj;
})();

presets.none = none;
presets.accessibility = presetsA11y;
presets.validate = presetsValidate;
presets.default = presetsDefault;
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
