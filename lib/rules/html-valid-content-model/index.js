module.exports = {
  name: "html-valid-content-model",
  on: ["tag"],
  need: "tag",
  filter: ["html"]
};

module.exports.lint = function(node, opts, { report }) {
  let has_head = false;
  let has_body = false;

  node.children.filter(child => child.type === "tag")
    .forEach(function(child) {
      // E044: Illegal element
      // E045: Duplicated tag
      // E046: Head and body tags out of order
      let err;
      if (child.name === "head") {
        err = has_body ? "E046" : has_head ? "E045" : false;
        has_head = true;
      } else if (child.name === "body") {
        err = has_body ? "E045" : false;
        has_body = true;
      } else {
        err = "E044";
      }
      if (err) {
        report({
          code: err,
          position: child.openLineCol
        });
      }
    });
};
