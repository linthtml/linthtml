const Parser = require("./parser");
const knife = require("./knife");
const Config = require("./config");
const { extract_inline_config } = require("./inline_config");
const { flatten } = require("./utils/arrays");
const rules = require("./rules");
const Issue = require("./issue");
/**
 * Apply the raw-ignore-regex option.
 * Return the modified html, and a function that recovers line/column
 * numbers of issues.
 */
function rawIgnoreRegex(html, options) {
  const ignore = options["raw-ignore-regex"];
  if (!ignore) {
    return html;
  }
  return html.replace((new RegExp(ignore, "gm")), function(match) {
    return match.replace(/[^\n\t\n\r]/g, "¤");
  });
}

class Linter {
  constructor(config) {
    this.config = new Config(rules, config);
    this.parser = new Parser();
  }

  // use(plugin) {
  //   if (plugin.rules) {
  //     plugin.rules.forEach(
  //       function(rule) {
  //         this.rules.addRule(rule);
  //       }.bind(this)
  //     );
  //   }
  // }

  /**
   * Lints the HTML with the options supplied in the environments setup.
   * @param {String} html - the html as a string to lint.
   */

  lint(html) {
    let issues = [];
    html = rawIgnoreRegex(html, this.config.config);

    const lines = knife.shred(html);
    const dom = this.parser.parse(html);

    const activatedRules = this.config.activatedRules;
    const rulesForDom = [];
    const rulesForLines = [];

    Object.keys(activatedRules)
      .forEach(name => {
        const rule = this.config.getRule(name);
        if (rule.need === "line") {
          rulesForLines.push(rule);
        } else {
          rulesForDom.push(rule);
        }
      });
    const lineIssues = flatten(this.lintByLine(rulesForLines, lines));
    const domIssues = flatten(this.lintDom(rulesForDom, dom));
    issues = issues.concat(lineIssues, domIssues, this.resetRules());

    if (this.config.config.maxerr) {
      issues = issues.slice(0, this.config.config.maxerr); // REMOVE: After v1.
    }

    return Promise.all(issues).then(function(resolved) {
      return flatten(resolved);
    });
  }

  // REMOVE: after v1, rules will only receive TreeNodes
  lintByLine(rules, lines) {
    return lines.map((line) => {
      return rules.map(rule => this.callRuleLint(rule, line));
    });
  }

  lintDom(rules, dom) {
    const issues = [];
    // merge with report in callRuleLint ?
    function report(data) {
      const meta = {
        ...data.meta,
        severity: "error"
      };

      issues.push(new Issue(
        data.code,
        data.position,
        "inline_config",
        meta
      ));
    }
    const getIssues = (node, parent_inline_config = {}) => {
      let issues = rules.map(rule => this.callRuleLint(rule, node, parent_inline_config));
      if (node.children && node.children.length > 0) {
        let inline_config = {
          ...parent_inline_config
        };
        node.children.forEach((child) => {
          inline_config = {
            ...inline_config,
            ...extract_inline_config(child, this.config, report)
          };
          issues = issues.concat(getIssues(child, inline_config));
        });
      }
      return issues;
    };
    let inline_config = {};
    const rules_issues = dom.map(node => {
      inline_config = {
        ...inline_config,
        ...extract_inline_config(node, this.config, report)
      };
      return getIssues(node, inline_config);
    });
    return issues.concat(rules_issues);
  }

  // TODO: Remove after v1
  callRuleLint(rule, node, inline_config = {}) {
    const issues = [];
    function report(data) {
      const meta = {
        ...data.meta,
        severity: rule.severity
      };

      issues.push(new Issue(
        data.code,
        data.position,
        rule.name,
        meta
      ));
    }
    if (inline_config[rule.name] && inline_config[rule.name].disabled === true) {
      return issues;
    }
    const config = inline_config[rule.name] && inline_config[rule.name].config
      ? { ...this.config.legacy_config, [rule.name]: inline_config[rule.name].config }
      : this.config.legacy_config;
    rule.lint(node, config, { report, rules: this.config.activatedRules });

    // No rules without `.need` for the moment
    // rule.need ? rule.lint(node, config, { report, rules: this.config.activatedRules }) : rule.lint(node, rule.config, { report });
    return issues;
  }

  resetRules() {
    const activatedRules = Object.keys(this.config.activatedRules);
    return flatten(activatedRules.map((name) => {
      const rule = this.config.getRule(name);
      const r = rule.end && rule.end();
      return r || [];
    })
    );
  }
}

module.exports = Linter;
