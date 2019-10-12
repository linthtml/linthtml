const Issue = require("../../issue");

module.exports = {
  name: "input-req-label",
  on: ["tag"],
  need: "tag",
  filter: ["input", "label"],

  labels: {},
  inputsInfo: []
};

// REMOVE
module.exports.end = function() {
  var issues = [];
  this.inputsInfo.forEach(
    function(input) {
      if (!this.labels[input.id]) {
        issues.push(
          new Issue("E033", input.location, {
            idValue: input.id
          })
        );
      }
    }.bind(this)
  );

  // wipe previous table
  this.labels = {};
  this.inputsInfo = [];

  return issues;
};

module.exports.lint = function(element, opts, { report }) {
  var attrs = element.attribs;
  function getAttrVal(name) {
    return attrs[name] ? attrs[name].value : null;
  }

  // if it's a label with a 'for', store that value
  if (element.name === "label") {
    var f = getAttrVal("for");
    if (f) {
      this.labels[f] = element;
    }
    return [];
  }

  // if it's not a text-type input, ignore it
  var type = getAttrVal("type");
  if (type !== "text" && type !== "radio") {
    return [];
  }

  // check if the input has a label as a parent.
  for (var e = element; (e = e.parent); ) {
    if (e.name === "label") {
      return [];
    }
  }

  // check if the input has a named label, by storing the values to
  // check at the end.
  var id = getAttrVal("id");
  var name = type === "text" ? getAttrVal("name") : null;
  if (id || name) {
    this.inputsInfo.push({
      id: id,
      name: name,
      location: element.openLineCol
    });
  } else {
    report({
      code: "E033",
      position: element.openLineCol,
      meta: {
        data: {
          idValue: "null"
        }
      }
    });
  }

  return [];
};
