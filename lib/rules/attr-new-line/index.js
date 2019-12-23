module.exports = {
  name: "attr-new-line",
  on: ["tag"],
  need: "tag",
  validateConfig(option) {
    if (typeof option === "number" || option === "+0") {
      return option;
    }
    throw new Error(`Configuration for rule "${this.name}" is invalid: Expected number or "+0" got ${typeof option}`);
  }
};
/* TODO: Clean code, remove duplication */

function checkPlusZeroOption(element, report) {
  const createIssue = (attribute) => report({
    code: "E037",
    position: attribute.nameLineCol,
    meta: {
      data: {
        limit: "+0"
      }
    }
  });

  const rows = new Map();
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
    const it = rows.values();
    let tmp = it.next();
    while (tmp.done === false) {
      const attributes = tmp.value;
      issues = issues.concat(attributes.map(createIssue));
      tmp = it.next();
    }
  } else {
    const attributes = rows.get(firstRow);
    if (attributes.length > 1) {
      issues = issues.concat(attributes.slice(1).map(createIssue));
    }
  }
  return issues;
}

module.exports.lint = function(element, opts, { report }) {
  const option = opts[this.name];

  const attributes = Object.keys(element.attribs);
  if (attributes.length === 0) {
    return [];
  }

  /* TEMP: Correct issue were "0+" accept values on other lines than first */
  if (option === "+0") {
    return checkPlusZeroOption(element, report);
  }

  const rowLimit = Math.floor(option);

  const rows = Object.values(element.attribs)
    .map(function(attr) {
      return attr.nameLineCol[0];
    })
    .sort();

  const firstRow = element.openLineCol[0];
  let curRow = firstRow;
  let n = 0;
  let max = -1;
  let first;

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

  if (!(first <= rowLimit && max <= Math.max(1, rowLimit))) {
    report({
      code: "E037",
      position: element.openLineCol,
      meta: {
        data: {
          limit: rowLimit
        }
      }
    });
  }
};
