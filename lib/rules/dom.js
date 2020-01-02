const knife = require("../knife");
const { flatten } = require("../utils/arrays");

module.exports = {
  name: "dom"
};

module.exports.lint = function(dom, opts, inlineConfigs) {
  const subs = this.subscribers;
  /*
   * Reset our inline configuration object to be what opts is.
   * Does a deep copy so as to not change opts in the future.
   */
  inlineConfigs.reset(opts);

  const getIssues = function(element) {
    const matcher = knife.matchFilter.bind(knife, element.type);

    // fast-forwards inlineConfig.current to whatever it should be at this index.
    inlineConfigs.getOptsAtIndex(element.index);

    const s = subs.filter(matcher);
    let ret = knife.applyRules(s, element, inlineConfigs.current);

    if (element.children && element.children.length > 0) {
      element.children.forEach(function(child) {
        ret = ret.concat(getIssues(child));
      });
    }
    return ret;
  };

  const issues = dom.length ? dom.map(getIssues) : [];
  return flatten(issues);
};
