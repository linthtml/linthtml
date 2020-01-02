const presetsDefault = require("./default");
const presetsA11y = require("./accessibility");
const presetsValidate = require("./validate");
const presets = {};

const none = (() => {
  // let keys = Object.keys(presets.default);
  const keys = Object.keys(presetsDefault);
  const obj = {};
  keys.forEach(key => {
    obj[key] = false;
  });
  return obj;
})();

presets.none = none;
presets.accessibility = presetsA11y;
presets.validate = presetsValidate;
presets.default = presetsDefault;
module.exports.presets = presets;

module.exports.flattenOpts = function(optList) {
  let options = {};
  optList.forEach(function(opt) {
    if (typeof opt === "string") {
      opt = presets[opt];
    }
    options = {
      ...options,
      ...opt
    };
  });

  return options;
};
