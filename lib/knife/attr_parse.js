// Parse the attributes in an opening tag's text.
// First five capture groups:
// 1: Leading spaces
// 2: Attribute name
// 3: Everything after the name
// 4: Text between matches 2 and 3
// 5: Attribute value, including any quotation marks
/* eslint-disable-next-line no-useless-escape */
const attrRegex = /(\s*)([^ "'>=\^\/]+)((\s*=\s*)((?:"[^"]*")|(?:'[^']*')|(?:\S+)))?/g;

function parse_HTML_attributes(attributes) {
  const ret = [];
  let match;

  while ((match = attrRegex.exec(attributes))) {
    ret.push({
      name: match[2],
      value: match[5]
    });
  }

  return ret;
}

module.exports = {
  parse_HTML_attributes
};
