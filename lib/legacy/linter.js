const parse = require("../parser");
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
  constructor() {
    this.config = getOptions(arguments);
    this.rules = new Config(rules);
    this.inlineConfig = null;
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
    this.inlineConfig = new InlineConfig(this.rules);
    let issues = this.rules.initOptions(this.config);
    html = rawIgnoreRegex(html, this.config);

    const dom = parse(html);
    issues = issues.concat(this.setupInlineConfigs(dom));

    try {
      issues = issues.concat(this.lintDom(dom, this.config));
    } finally {
      issues = issues.concat(this.resetRules(this.config));
    }

    if (this.config.maxerr) {
      issues = issues.slice(0, this.config.maxerr);
    }

    return Promise.all(issues).then(function(resolved) {
      return flatten(resolved);
    });
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
