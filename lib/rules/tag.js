const knife = require("../knife");

module.exports = {
  name: "tag",
  on: ["dom"],
  need: "dom",
  filter: ["tag", "style", "script"]
};

module.exports.lint = function(element, opts, { report }) {
  const matcher = knife.matchFilter.bind(knife, element.name);

  const s = this.subscribers.filter(matcher);
  report(knife.applyRules(s, element, opts));
};
