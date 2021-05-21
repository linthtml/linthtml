const { parse_HTML_attributes } = require("../knife");
const Issue = require("../issue");

// Private vars,
let index = 0; // index used for making sure configs are sent in order

/**
 * An inline configuration class is created to hold each inline configuration
 * and report back what the options should be at a certain index.
 *
 * @class InlineConfig
 */
class InlineConfig {
  /**
   * Creates an instance of InlineConfig.
   * @constructor
   * @param {import('./config')} config - an option parser.
   * If not given here, it must be set with inlineConfig.reset(basis).
   * @memberof InlineConfig
   */
  constructor(config) {
    this.config = config;
    this.indexConfigs = [];
    this.previous = {};
  }

  /**
   * Reset the current opts to the basis. if newBasis is supplied, use that as our new basis.
   *
   * @param {Object} newBasis - the new options to use.
   * @memberof InlineConfig
   */
  reset(newBasis) {
    this.current = Object.assign({}, newBasis);
    index = 0;
  }

  setOption(name, value, isPrev, previous) {
    previous[name] = this.current[name];
    try {
      this.current[name] = this.config.setOption(name, value, isPrev);
    } catch (error) {
      let message = error.message;
      message = message.replace(/^Configuration/, "Inline configuration");
      throw new Error(message);
    }
  }

  /**
   * Apply the given configuration to this.current. Returns true if the operation resulted in any changes, false otherwise.
   *
   * @param {Object} config - the new config to write onto the current options.
   * @memberof InlineConfig
   */
  applyConfig(config) {
    const previous = {};
    config.rules.forEach(rule => {
      const isprev = rule.value === "$previous";
      if (rule.type === "rule") {
        const rules = rule.name === "ALL"
          ? Object.keys(this.current)
          : [rule.name];
        rules.forEach(name => this.setOption(name, isprev ? this.previous[name] : rule.value, isprev, previous));
        /* istanbul ignore else */
      }
    });
    this.previous = {
      ...this.previous,
      ...previous
    };
  }

  /**
   * Get the options object to use at this index. Indices must be given in order, or an error is thrown (much speedier).
   * If you must get them out of order, use 'reset' first. Sets the opts to this.current.
   *
   * @param {number} newIndex - The index to get opts for.
   * @memberof InlineConfig
   */
  getOptsAtIndex(newIndex) {
    if (newIndex !== 0 && newIndex <= index) {
      throw new Error(`Cannot get options for index "${newIndex}" when index "${index}" has already been checked"`);
    } else {
      this.indexConfigs
        .slice(index + 1, newIndex + 1)
        .filter(x => !!x)
        .forEach(this.applyConfig, this);
      index = newIndex;
    }
  }

  /**
   * Add the config when it was given to us from feedComment.
   *
   * @param {Object} config - The config to add.
   * @memberof InlineConfig
   */
  addConfig(config) {
    if (this.indexConfigs[config.end]) {
      throw new Error("config exists at index already!");
    }

    this.indexConfigs[config.end] = config;
  }

  /**
   * Take the comment node and check it for the proper structure.
   * Add it to our array indexConfigs.
   * Return a list of issues encountered.
   *
   * @param {import('../parser/index').Node} node - Comment node
   * @memberof InlineConfig
   */
  feedComment(node) {
    const issues = [];
    const settings = [];
    const line = node.data;
    const match = line.match(/[\s]*linthtml-(configure|disable|enable)[\s]+(.*)/);

    if (!match) {
      return [];
    }

    const instruction_type = match[1];

    if (instruction_type === "configure") {
      const key_values = parse_HTML_attributes(match[2]);

      key_values.forEach((pair) => {
        // TODO More precise line/column numbers
        const r = this.parsePair(
          pair.name,
          pair.value,
          node.loc
        );
        (r.code ? issues : settings).push(r);
      });
    } else {
      const rules_name = (match[2].trim() || "ALL").split(/\s*,\s*/);

      rules_name.forEach((rule_name) => {
        if (rule_name !== "ALL" && !this.config.hasOption(rule_name)) {
          issues.push(
            new Issue(
              "inline_config",
              node.loc,
              {
                code: "INLINE_02",
                data: {
                  rule_name: rule_name
                }
              }
            )
          );
        }
        settings.push({
          type: "rule",
          name: rule_name,
          value: instruction_type === "enable"
            ? "$previous"
            : false
        });
      });
    }

    if (settings.length > 0) {
      this.addConfig({
        start: node.startIndex,
        end: node.endIndex,
        rules: settings
      });
    }
    return issues;
  }

  /**
   * Accept an attribute and return either a parsed config pair object
   * or an error string.
   *
   * @param {string} name - The attribute name.
   * @param {string} value - The attribute raw value.
   * @param {Range} pos
   * @returns
   * @memberof InlineConfig
   */
  parsePair(name, value, pos) {
    if (!name || !value || !name.length || !value.length) {
      throw new Error("Cannot parse inline configuration.", { pos });
    }

    const nameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!nameRegex.test(name)) {
      return new Issue(
        "inline_config",
        pos,
        {
          code: "E051",
          data: {
            name: name
          }
        }
      );
    }

    // Strip quotes and replace single quotes with double quotes
    const squote = "'";
    const dquote = "\""; // Single and double quote, for sanity
    if (value[0] === squote || value[0] === dquote) {
      value = value.substr(1, value.length - 2);
    }
    value = value.replace(/'/g, dquote);

    // Treat _ and - interchangeably
    name = name.replace(/_/g, "-");

    let parsed = null;
    if (value === "$previous") {
      parsed = "$previous";
    } else {
      if (!this.config.hasOption(name)) {
        return new Issue(
          "inline_config",
          pos,
          {
            code: "INLINE_02",
            data: {
              rule_name: name
            }
          }
        );
      }
      try {
        parsed = JSON.parse(value);
      } catch (e) {
        if (!nameRegex.test(value)) {
          return new Issue(
            "inline_config",
            pos,
            {
              code: "INLINE_03",
              data: {
                rule_configuration: value
              }
            }
          );
        }
        parsed = value;
      }
    }

    return { type: "rule", name: name, value: parsed };
  }
}

module.exports = InlineConfig;
