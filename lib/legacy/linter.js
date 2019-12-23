const Parser = require("../parser");
const knife = require("../knife");
const presets = require("../presets");
const Config = require("./config");
const InlineConfig = require("./inline_config");
const { flatten } = require("../utils/arrays");
const rules = require("../rules");
/**
 * Apply the raw-ignore-regex option.
 * Return the modified html, and a function that recovers line/column
 * numbers of issues.
 */
function rawIgnoreRegex(html, opts) {
  const ignore = opts["raw-ignore-regex"];
  if (!ignore) {
    return html;
  }
  return html.replace((new RegExp(ignore, "gm")), function(match) {
    return match.replace(/[^\n\t\n\r]/g, "¤");
  });
}

function getOptions(args) {
  let optList = Array.prototype.slice.call(args, 1);
  optList = flatten(optList);

  if (optList[optList.length - 1] !== "nodefault") {
    optList.unshift("default");
  }

  return presets.flattenOpts(optList);
}

class Linter {
  constructor(_, options) {
    this.rules = new Config(rules, options);
    this.parser = new Parser();
    this.inlineConfig = new InlineConfig(this.rules);
  }

  use(plugin) {
    if (plugin.rules) {
      plugin.rules.forEach(
        function(rule) {
          this.rules.addRule(rule);
        }.bind(this)
      );
    }
  }

  /**
   * Lints the HTML with the options supplied in the environments setup.
   * @param {String} html - the html as a string to lint.
   */
  lint(html) {
    const opts = getOptions(arguments);
    let issues = this.rules.initOptions(opts);
    html = rawIgnoreRegex(html, opts);

    const lines = knife.shred(html);
    const dom = this.parser.parse(html);
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
  }

  lintByLine(lines, opts) {
    return this.rules.getRule("line").lint(lines, opts, this.inlineConfig);
  }

  lintDom(dom, opts) {
    return this.rules.getRule("dom").lint(dom, opts, this.inlineConfig);
  }

  resetRules(opts) {
    return flatten(
      this.rules.getAllRules().map(function(rule) {
        const r = rule.end && rule.end(opts);
        return r || [];
      })
    );
  }

  setupInlineConfigs(dom) {
    let issues = [];
    const feedComments = function(element) {
      if (element.type === "comment") {
        issues = issues.concat(this.inlineConfig.feedComment(element));
      }
      if (element.children) {
        element.children.map(feedComments);
      }
    }.bind(this);
    dom.forEach(feedComments);
    return issues;
  }
}

module.exports = Linter;
