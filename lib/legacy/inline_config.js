const knife = require("../knife");
const presets = require("../presets");
const Issue = require("../issue");

// Private vars,
let index = 0; // index used for making sure configs are sent in order

/**
 * An inline configuration class is created to hold each inline configuration
 * and report back what the options should be at a certain index.
 * @constructor
 * @param {Object} config - an option parser
 * If not given here, it must be set with inlineConfig.reset(basis).
 */
const inlineConfig = function(config) {
  this.setOption = config.setOption.bind(config);
  this.isOption = function(name) {
    return name in config.options;
  };
  this.clear();
};
module.exports = inlineConfig;

/**
 * Reset the current opts to the basis. if newBasis is supplied, use that as our new basis.
 * @param {Object} newBasis - the new options to use.
 */
inlineConfig.prototype.reset = function(newBasis) {
  this.current = Object.assign({}, newBasis);
  index = 0;
};

/**
 * Clears the indexConfigs object, then calls reset with 'null' - to be called after linting finishes.
 * @param {Object} newBasis - the new options to use.
 */
inlineConfig.prototype.clear = function() {
  this.indexConfigs = [];
  this.previous = {};
  this.previousPreset = {};
};

/**
 * Apply the given cofiguration to this.current. Returns true if the operation resulted in any changes, false otherwise.
 * @param {Object} config - the new config to write onto the current options.
 */
function applyConfig(config) {
  const previous = {};

  config.rules.forEach(
    function(rule) {
      const isprev = rule.value === "$previous";
      const setOption = function(name, value) {
        previous[name] = this.current[name];
        try {
          this.current[name] = this.setOption(name, value, isprev);
        } catch (error) {
          let message = error.message;
          message = message.replace(/^Configuration/, "Inline configuration");
          throw new Error(message);
        }
      }.bind(this);
      if (rule.type === "rule") {
        setOption(rule.name, isprev ? this.previous[rule.name] : rule.value);
        /* istanbul ignore else */
      } else if (rule.type === "preset") {
        const preset = isprev ? this.previousPreset : presets.presets[rule.value];
        Object.keys(preset).forEach(function(name) {
          setOption(name, preset[name]);
        });
      }
    }.bind(this)
  );
  this.previousPreset = previous;
  this.previous = {
    ...this.previous,
    ...previous
  };
}

/**
 * Get the options object to use at this index. Indices must be given in order, or an error is thrown (much speedier).
 * If you must get them out of order, use 'reset' first. Sets the opts to this.current.
 * @param {number} newIndex - The index to get opts for.
 */
inlineConfig.prototype.getOptsAtIndex = function(newIndex) {
  if (newIndex !== 0 && newIndex <= index) {
    throw new Error(`Cannot get options for index "${newIndex}" when index "${index}" has already been checked"`);
  } else {
    this.indexConfigs
      .slice(index + 1, newIndex + 1)
      .filter(x => !!x)
      .forEach(applyConfig, this);
    index = newIndex;
  }
};

/**
 * Add the config when it was given to us from feedComment.
 * @param {Object} config - The config to add.
 */
inlineConfig.prototype.addConfig = function(config) {
  if (this.indexConfigs[config.end]) {
    throw new Error("config exists at index already!");
  }

  this.indexConfigs[config.end] = config;
};

/**
 * Take the comment element and check it for the proper structure.
 * Add it to our array indexConfigs.
 * Return a list of issues encountered.
 * @param {number} newIndex - The index to get opts for.
 */
inlineConfig.prototype.feedComment = function(element) {
  const line = element.data;
  const match = line.match(/[\s]*linthtml-configure[\s]+(.*)/);

  if (!match) {
    return [];
  }

  const keyvals = knife.parseHtmlAttrs(match[1]);

  const settings = [];
  const issues = [];
  keyvals.forEach(
    function(pair) {
      // TODO More precise line/column numbers
      const r = parsePair(
        pair.name,
        pair.valueRaw,
        element.lineCol,
        this.isOption
      );
      (r.code ? issues : settings).push(r);
    }.bind(this)
  );
  if (settings.length > 0) {
    this.addConfig({
      start: element.index,
      end: element.index + element.data.length + 6, // 7 for '<!--' and '-->' minus one for last index
      rules: settings
    });
  }
  return issues;
};

/**
 * Accept an attribute and return either a parsed config pair object
 * or an error string.
 * @param {string} name - The attribute name.
 * @param {string} value - The attribute raw value.
 */
function parsePair(name, value, pos, isOption) {
  if (!name || !value || !name.length || !value.length) {
    throw new Error("Cannot parse inline configuration.", { pos });
  }

  const nameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!nameRegex.test(name)) {
    return new Issue("E051", pos, "", {
      data: {
        name: name
      }
    });
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

  // check if our value is for a preset.
  if (name === "preset") {
    if (value !== "$previous" && !presets.presets[value]) {
      return new Issue("E052", pos, "", {
        data: {
          preset: value
        }
      });
    } else {
      return { type: "preset", value: value };
    }
  }

  // it's not a preset.
  let parsed = null;
  if (value === "$previous") {
    parsed = "$previous";
  } else if (value[0] === "$") {
    const vs = value.substr(1);
    if (!presets.presets[vs]) {
      return new Issue("E052", pos, "", {
        data: {
          preset: vs
        }
      });
    }
    parsed = presets.presets[vs][name];
  } else {
    if (!isOption(name)) {
      return new Issue("E054", pos, "", {
        data: {
          name: name
        }
      }); // TODO: Report error with warning level
    }
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      if (!nameRegex.test(value)) {
        throw new Error(`Inline configuration for rule "${name}" cannot be parsed.`, { pos });
      }
      parsed = value;
    }
  }

  return { type: "rule", name: name, value: parsed };
}
