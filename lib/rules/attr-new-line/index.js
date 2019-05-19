var Issue = require("../../issue");

module.exports = {
  name: "attr-new-line",
  on: ["tag"],
  desc: [
    'A non-negative integer, or "+0". If set, no more than this number of',
    "attributes may be on the same row.",
    "A value of 0 applies only to the first row, restricting subsequent rows",
    'to one element, and a value of "+0" is the same but allows an attribute',
    "to be on the first row if there is only one attribute."
  ].join("\n"),
  validateConfig(option) {
    if (typeof option === "number" || option === "+0") {
      return option;
    }
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number or "+0" got ${typeof option}`);
  }
};
  /* TODO: Clean code, remove duplication */

function checkPlusZeroOption(element ) {

  const createIssue = (attribute) => new Issue("E037", attribute.nameLineCol, { limit: "+0" });

  let rows = new Map();
  let issues = [];
  Object.values(element.attribs).forEach(attribute => {
    const line = attribute.nameLineCol[0];
    if (rows.has(line)) {
      rows.set(line, rows.get(line).concat(attribute));
    } else {
      rows.set(line, [attribute]);
    }
  });
  const firstRow = element.openLineCol[0];
  if (rows.has(firstRow) === false) {
    let it = rows.values();
    let tmp = it.next();
    while(tmp.done === false) {
      let attributes = tmp.value;
      issues = issues.concat(attributes.map(createIssue));
      tmp = it.next();
    }
  } else {
    let attributes = rows.get(firstRow);
    if (attributes.length > 1) {
      issues = issues.concat(attributes.slice(1).map(createIssue));
    }
  }
  return issues;
}

module.exports.lint = function(element, opts) {
  var option = opts[this.name];

  var attributes = Object.keys(element.attribs);
  if (attributes.length === 0) {
    return [];
  }

  /* TEMP: Correct issue were "0+" accept values on other lines than first */
  if (option === "+0") {
    return checkPlusZeroOption(element);
  }
  
  var rowLimit = Math.floor(option);
  
  var rows = Object.values(element.attribs)
    .map(function(attr) {
      return attr.nameLineCol[0];
    })
    .sort();

  var firstRow = element.openLineCol[0],
    curRow = firstRow,
    n = 0,
    max = -1,
    first;

  rows.push(rows[rows.length - 1] + 1);

  rows.forEach(function(r) {
    if (r !== curRow) {
      if (curRow === firstRow) {
        first = n;
      }
      curRow = r;
      if (n > max) {
        max = n;
      }
      n = 0;
    }
    n++;
  });

  return first <= rowLimit && max <= Math.max(1, rowLimit)
    ? []
    : new Issue("E037", element.openLineCol, { limit: rowLimit });
};
