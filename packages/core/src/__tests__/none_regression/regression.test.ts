import { expect } from "chai";
import path from "path";
import fs from "fs";
import linthtml from "../../index.js";

import new_config from "./fixtures/config.js";
import legacy_config from "./fixtures/legacy_config.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.resolve(__dirname, "fixtures", "index.html")).toString("utf8");

describe("None regression", function () {
  it("LintHTML should report the same errors with the new config and the old config", async function () {
    const new_linter_issues = await linthtml(html, new_config);
    const legacy_linter_issues = await linthtml(html, legacy_config);

    expect(legacy_linter_issues.length).to.equal(new_linter_issues.length);
    // expect(legacy_linter).to.deep.equal(new_linter); // Different order ><
    const a = new_linter_issues.map((_) => parseInt(_.code.replace("E", ""), 10)).sort();
    const b = legacy_linter_issues.map((_) => parseInt(_.code.replace("E", ""), 10)).sort();
    expect(a).to.deep.equal(b);
  });
});
