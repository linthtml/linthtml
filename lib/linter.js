const Config = require("./config");
const { extract_inline_config } = require("./inline_config");
const { flatten } = require("./utils/arrays");
const rules = require("./rules");
const Issue = require("./issue");
const { get_module_path } = require("./read-config");
const CustomError = require("./utils/custom-errors");
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

function merge_inline_config(base_config, new_config) {
  const merged_config = Object.keys(new_config)
    .reduce((merged_config, rule_name) => {
      if (base_config[rule_name]) {
        merged_config[rule_name] = {
          ...base_config[rule_name],
          ...new_config[rule_name]
        };
      } else {
        merged_config[rule_name] = new_config[rule_name];
      }
      return merged_config;
    }, {});
  return {
    ...base_config,
    ...merged_config
  };
}

function get_parser(config = {}) {
  if (config.parser) {
    try {
      const parser_module = get_module_path(process.cwd(), config.parser);
      return require(parser_module);
    } catch (error) {
      throw new CustomError("CORE-04", { module_name: error.meta.module_name });
    }
  }
  return require("./parser");
}

class Linter {
  constructor(config) {
    this.parse_fn = get_parser(config);
    this.config = new Config(rules, config);
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

    const dom = this.parse_fn(html);
    const activated_rules = Object.keys(this.config.activatedRules)
      .map(name => this.config.getRule(name));
    const domIssues = flatten(this.lintDom(activated_rules, dom));
    issues = issues.concat(domIssues, this.resetRules());

    if (this.config.config.maxerr) {
      issues = issues.slice(0, this.config.config.maxerr); // REMOVE: After v1.
    }

    return Promise.all(issues).then(function(resolved) {
      return flatten(resolved);
    });
  }

  lintDom(rules, dom) {
    const issues = [];
    // merge with report in callRuleLint ?
    function report_inline_config(data) {
      const meta = {
        ...data.meta,
        severity: "error",
        code: data.code
      };

      issues.push(new Issue(
        "inline_config",
        data.position,
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
          const extracted_inline_config = extract_inline_config(child, this.config, report_inline_config);
          inline_config = merge_inline_config(inline_config, extracted_inline_config);
          issues = issues.concat(getIssues(child, inline_config));
        });
      }
      return issues;
    };
    let inline_config = {};
    const rules_issues = dom.children.map(node => {
      const extracted_inline_config = extract_inline_config(node, this.config, report_inline_config);
      inline_config = merge_inline_config(inline_config, extracted_inline_config);
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
        severity: rule.severity,
        code: data.code,
        message: data.message
      };

      issues.push(new Issue(
        rule.name,
        data.position,
        meta
      ));
    }
    if (inline_config[rule.name] && inline_config[rule.name].disabled === true) { // inline_config[rule.name]?.disabled
      return issues;
    }

    const rule_config = inline_config[rule.name] && inline_config[rule.name].config // inline_config[rule.name]?.config // inline_config[rule.name].config ?? this.config.legacy_config[rule.name]
      ? inline_config[rule.name].config
      : this.config.legacy_config[rule.name];

    const global_config = inline_config[rule.name] && inline_config[rule.name].config
      ? { ...this.config.legacy_config, [rule.name]: inline_config[rule.name].config }
      : this.config.legacy_config;
    rule.lint(node, rule_config, { report, rules: this.config.activatedRules, global_config });
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
