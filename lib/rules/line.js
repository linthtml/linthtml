const knife = require("../knife");
const { flatten } = require("../utils/arrays");

module.exports = {
  name: "line"
};

module.exports.lint = function(lines, opts, inlineConfigs) {
  lines[0] = "";
  var subs = this.subscribers;
  // use the opts as our base, and build from them.
  inlineConfigs.reset(opts);
  return flatten(
    lines.map(function(line, index) {
      /*
       * Right now, if the config is on a line, that whole line is
       * given the new configuration. This is not great in theory,
       * but in practice line rules don't really need the split.
       */
      inlineConfigs.getOptsAtIndex(line.index);

      if (index === 0) {
        return [];
      }
      return knife.applyRules(subs, line, inlineConfigs.current);
    })
  );
};
