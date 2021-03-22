const knife = require("../knife");
const { flatten } = require("../utils/arrays");

function lint(dom, opts, inlineConfigs) {
  const subs = this.subscribers;
  /*
   * Reset our inline configuration object to be what opts is.
   * Does a deep copy so as to not change opts in the future.
   */
  inlineConfigs.reset(opts);

  const getIssues = function(element) {
    // fast-forwards inlineConfig.current to whatever it should be at this index.
    inlineConfigs.getOptsAtIndex(element.startIndex);

    let ret = knife.applyRules(subs, element, inlineConfigs.current);

    if (element.children && element.children.length > 0) {
      element.children.forEach(function(child) {
        ret = ret.concat(getIssues(child));
      });
    }
    return ret;
  };

  const issues = dom.children.length ? dom.children.map(getIssues) : [];
  return flatten(issues);
}

module.exports = {
  name: "dom",
  lint
};
