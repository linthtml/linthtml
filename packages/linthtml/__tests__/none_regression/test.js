const { expect } = require("chai");
const path = require("path");
const fs = require("fs");
// TODO: Remove .default after typescript migration
const new_config = require("./config").default;
const legacy_config = require("./legacy_config");
// TODO: Remove .default after typescript migration
const linthtml = require("../../lib").default;

const html = fs.readFileSync(path.resolve(__dirname, "index.html")).toString("utf8");

describe("None regression", function() {
  it("LintHTML should report the same errors with the new config and the old config", async function() {
    const new_linter = await linthtml(html, new_config);
    const legacy_linter = await linthtml(html, legacy_config);
    expect(legacy_linter.length).to.equal(new_linter.length);
    // expect(legacy_linter).to.deep.equal(new_linter); // Different order ><
    const a = new_linter.map(_ => parseInt(_.code.replace("E", ""), 10)).sort();
    const b = legacy_linter.map(_ => parseInt(_.code.replace("E", ""), 10)).sort();
    expect(a).to.deep.equal(b);
  });
});
