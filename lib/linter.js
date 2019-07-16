const Parser = require("./parser");
const knife = require("./knife");
const presets = require("./presets");
const Config = require("./config");
const InlineConfig = require("./inline_config");
const { flatten } = require("./utils/arrays");
/**
 * A linter is configured with a set of rules that are fed the raw
 * html and ast nodes.
 * @constructor
 */
var Linter = function(rules, options) {
  this.rules = new Config(rules, options);
  this.parser = new Parser();
  this.inlineConfig = new InlineConfig(this.rules);
};
module.exports = Linter;

/**
 * Adds a plugin to the linter.
 * @param {Object} plugin - the plugin to add to the linter.
 */
Linter.prototype.use = function(plugin) {
  if (plugin.rules) {
    plugin.rules.forEach(
      function(rule) {
        this.rules.addRule(rule);
      }.bind(this)
    );
  }
};

/**
 * Apply the raw-ignore-regex option.
 * Return the modified html, and a function that recovers line/column
 * numbers of issues.
 */
function rawIgnoreRegex(html, opts) {
  var ignore = opts["raw-ignore-regex"];
  if (!ignore) {
    return html;
  }
  return html.replace((new RegExp(ignore, 'gm')), function(match) {
    return match.replace(/[^\n\t\n\r]/g, "¤");
  });
}

/**
 * Lints the HTML with the options supplied in the environments setup.
 * @param {String} html - the html as a string to lint.
 */
Linter.prototype.lint = function(html) {
  var opts = Linter.getOptions(arguments),
    issues = this.rules.initOptions(opts);
  html = rawIgnoreRegex(html, opts);

  var lines = knife.shred(html),
    dom = this.parser.parse(html);
  issues = issues.concat(this.setupInlineConfigs(dom));

  try {
    issues = issues.concat(this.lintByLine(lines, opts));
    // console.log(dom)
    issues = issues.concat(this.lintDom(dom, opts));
  } finally {
    issues = issues.concat(this.resetRules(opts));
    this.inlineConfig.clear();
  }

  if (opts.maxerr) {
    issues = issues.slice(0, opts.maxerr);
  }

  return Promise.all(issues).then(function(resolved) {
    return flatten(resolved);
  });
};

Linter.getOptions = function(args) {
  var optList = Array.prototype.slice.call(args, 1);
  optList = flatten(optList);

  if (optList[optList.length - 1] !== "nodefault") {
    optList.unshift("default");
  }

  return presets.flattenOpts(optList);
};

Linter.prototype.lintByLine = function(lines, opts) {
  return this.rules.getRule("line").lint(lines, opts, this.inlineConfig);
};

Linter.prototype.lintDom = function(dom, opts) {
  return this.rules.getRule("dom").lint(dom, opts, this.inlineConfig);
};

Linter.prototype.resetRules = function(opts) {
  return flatten(
    this.rules.getAllRules().map(function(rule) {
      var r = rule.end && rule.end(opts);
      return r ? r : [];
    })
  );
};

Linter.prototype.setupInlineConfigs = function(dom) {
  var issues = [];
  var feedComments = function(element) {
    if (element.type === "comment") {
      issues = issues.concat(this.inlineConfig.feedComment(element));
    }
    if (element.children) {
      element.children.map(feedComments);
    }
  }.bind(this);
  dom.forEach(feedComments);
  return issues;
};
