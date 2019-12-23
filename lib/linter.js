const Parser = require("./parser");
const knife = require("./knife");
const Config = require("./config");
// const InlineConfig = require("./inline_config");
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
    // this.inlineConfig = new InlineConfig(this.config);
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

    Object
      .keys(activatedRules)
      .forEach(name => {
        const rule = this.config.getRule(name);
        if (rule.lint) {
          const ruleIssues = this.executeRule(rule, { dom, lines });
          issues = issues.concat(ruleIssues);
        }
      });
    // issues = issues.concat(this.setupInlineConfigs(dom));

    issues = issues.concat(this.resetRules());

    //   this.inlineConfig.clear();
    if (this.config.config.maxerr) {
      issues = issues.slice(0, this.config.config.maxerr); // REMOVE: After v1.
    }

    return Promise.all(issues).then(function(resolved) {
      return flatten(resolved);
    });
  }

  executeRule(rule, raw) {
    switch (rule.need) {
      case "line":
        return this.lintByLine(rule, raw.lines);
      case "tag":
        return this.lintByTag(rule, raw.dom);
      case "dom":
      default:
        return this.lintDom(rule, raw.dom);
    }
  }

  // REMOVE: after v1, rules will only receive TreeNodes
  lintByLine(rule, lines) {
    return lines.map((line) => {
      // this.inlineConfig.getOptsAtIndex(line.index);
      return this.callRuleLint(rule, line);//, this.inlineConfigs.current);
    });
  }

  lintByTag(rule, dom) {
    function executeLint(node) {
      let issues = [];
      // style and script tags don't have a type of "tag" 🤷
      if (["tag", "style", "scripts"].indexOf(node.type) === -1) {
        return [];
      }
      if (rule.filter && rule.filter.indexOf(node.name) === -1) {
        // do nothing
      } else {
        issues = issues.concat(this.callRuleLint(rule, node));
      }
      const chilrenIssues = node.children.map(executeLint.bind(this));
      return issues.concat(flatten(chilrenIssues));
    }
    return flatten(dom.map(executeLint.bind(this)));
  }

  lintDom(rule, dom) {
  /*
    * Reset our inline configuration object to be what opts is.
    * Does a deep copy so as to not change opts in the future.
    */
    // this.inlineConfig.reset(this.options);

    const getIssues = (node) => {
      const matcher = knife.matchFilter.bind(knife, node.type);

      // fast-forwards inlineConfig.current to whatever it should be at this index.
      // this.inlineConfig.getOptsAtIndex(element.index);

      const shouldLint = matcher(rule);
      let ret = [];
      if (shouldLint) {
        return this.callRuleLint(rule, node);//, this.inlineConfigs.current);
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach(function(child) {
          ret = ret.concat(getIssues(child));
        });
      }
      return ret;
    };

    return dom.length ? dom.map(getIssues) : [];
  }

  // TODO: Remove after v1
  callRuleLint(rule, raw) {
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
    rule.need ? rule.lint(raw, this.config.legacy_config, { report, rules: this.config.activatedRules }) : rule.lint(raw, rule.config, { report });
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
