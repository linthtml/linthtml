var lodash = require("lodash");
const { isRegExp } = require("util");

var formats = {
  lowercase: /^[a-z\d]+$/,
  underscore: /^[a-z\d]+(_[a-z\d]+)*$/,
  dash: /^[a-z\d]+(-[a-z\d]+)*$/,
  camel: /^[a-zA-Z\d]*$/,
  bem: /^[a-z][a-z\d]*(-[a-z\d]+)*(__[a-z\d]+(-[a-z\d]+)*)?(--[a-z\d]+(-[a-z\d]+)*)?$/
};

function getRegExp(val) {
  if (isRegExp(val)) {
    return val;
  } else if (typeof val === "string") {
    return formats[val] || new RegExp(`^${val}$`, 'gm');
  } else {
    return undefined;
  }
}

module.exports = {
  bool: function(option) {
    return option ? true : false;
  },
  boolPlus: function(option) {
    return function(o) {
      return o === option ? option : o ? true : false;
    };
  },
  arrayOfStr: function(o) {
    return lodash.isArray(o) && lodash.every(o, lodash.isString)
      ? o
      : undefined;
  },
  options: function(opts) {
    return function(o) {
      return opts.indexOf(o) > -1 ? o : undefined;
    };
  },
  regex: function(regex) {
    return getRegExp(regex, function(s) {
      return new RegExp(s);
    });
  },
  regexGlobal: function(r) {
    r = module.exports.regex(r);
    return r && new RegExp(r.source, r.ignoreCase ? "gi" : "g");
  },
  arrayOfAttrs: function(strs) {
    if (!lodash.isArray(strs)) {
      return undefined;
    }
    for (var i = 0; i < strs.length; i++) {
      strs[i] = getRegExp(strs[i], function(a) {
        return a.toLowerCase();
      });
      if (!strs[i]) {
        return undefined;
      }
    }
    return strs;
  },
  posInt: function(i) {
    return lodash.isInteger(i) && i >= 0 ? i : undefined;
  },
  format: function(name) {
    var regex = getRegExp(name, function(s) {
      return formats[s];
    });

    return regex && { desc: name, test: regex.test.bind(regex) };
  },
  object: function(o) {
    return Object.keys(o).length > 0 ? o : {};
  },
  getRegExp: getRegExp
};
