var Issue = require("../../issue");

module.exports = {
  name: "line-end-style",
  on: ["line"],
  need: "line",
  validateConfig(option) {
    if (typeof option !== "string") {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected a string got ${typeof option}.`);
    }
    if (/^(cr|lf|crlf)$/.test(option) === false) {
      throw new Error(`Configuration for rule "${this.name}" is invalid: Expected "cr", "lf" or "crlf" got "${option}".`);
    }
    return option;
  }
};

const formats = {
  cr: /(^|[^\n\r])\r$/,
  lf: /(^|[^\n\r])\n$/,
  crlf: /(^|[^\n\r])\r\n$/
};

module.exports.lint = function(line, opts) {
  const format = opts[this.name];

  const R = formats[format];
  if (R.test(line.text)) {
    return [];
  }
  if (Object.values(formats).findIndex(R => R.test(line.text)) ===-1) {
    return [];
  }

  var len = line.text.length,
    pos = [line.row, len];

  if (line.text[len - 2] === "\r") {
    pos[1] -= 1;
  }

  return new Issue("E015", pos, { format: format });
};
