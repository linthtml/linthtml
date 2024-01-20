import linthtml from "../../../index.js";
import { presets } from "../../../presets/index.js";
import { LegacyLinterConfig, RuleConfig } from "../../../read-config.js";

describe("legacy linter | label-no-enc-textarea-or-select", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it("Report an error when there's a <select> inside a <label>", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
    <label>
      <select>
        <option value="v1">V1</option>
        <option value="v2">V2</option>
        <option value="v3">V3</option>
      </select>
    </label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report an error when there's a <textarea> inside a <label>", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>
        <textarea></textarea>
      </label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report an error when there's a <select> inside a <label> (deep nesting)", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>
        <div>
          <div>
            <select>
              <option value="v1">V1</option>
              <option value="v2">V2</option>
              <option value="v3">V3</option>
            </select>
          </div>
        </div>
      </label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report an error when there's a <textarea> inside a <label> (deep nesting)", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>
        <div>
          <div>
            <textarea></textarea>
          </div>
        </div>
      </label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report nothing when the <select> or the <textarea> in not inside the <label>", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>foo</label>
      <select>
        <option value="bar">bar</option>
      </select>
      <label>Fiz</label>
      <textarea></textarea>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});

describe("label-no-enc-textarea-or-select", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it("Report an error when there's a <select> inside a <label>", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
    <label>
      <select>
        <option value="v1">V1</option>
        <option value="v2">V2</option>
        <option value="v3">V3</option>
      </select>
    </label>
    `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report an error when there's a <textarea> inside a <label>", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>
        <textarea></textarea>
      </label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report an error when there's a <select> inside a <label> (deep nesting)", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>
        <div>
          <div>
            <select>
              <option value="v1">V1</option>
              <option value="v2">V2</option>
              <option value="v3">V3</option>
            </select>
          </div>
        </div>
      </label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report an error when there's a <textarea> inside a <label> (deep nesting)", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>
        <div>
          <div>
            <textarea></textarea>
          </div>
        </div>
      </label>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Report nothing when the <select> or the <textarea> in not inside the <label>", async () => {
    const linter = createLinter({ "label-no-enc-textarea-or-select": true });
    const html = `
      <label>foo</label>
      <select>
        <option value="bar">bar</option>
      </select>
      <label>Fiz</label>
      <textarea></textarea>
      `;

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });
});
