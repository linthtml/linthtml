import { expect } from "chai";
import { createLegacyLinter, createLinter } from "../../__tests__/utils.js";
import { get_config_type } from "../../validate_option.js";

const valid_html = [
  "<div></div>",
  '<div role="none"></div>',
  '<div role="presentation"></div>',
  '<img alt="" role="none">',
  '<img role="none">',
  '<img alt="" role="presentation">',
  '<img role="presentation">',
  '<span role="none"></span>',
  '<span role="presentation"></span>',
  '<svg role="none"></svg>',
  '<svg role="presentation"></svg>',
  '<li role="none"></li>',
  '<li role="presentation"></li>',
  '<custom-component role="none"></custom-component>',
  '<table role="textbox"></table>'
];

const invalid_tests = [
  {
    html: '<ul role="presentation"></ul>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 30 }
        }
      }
    ]
  },
  {
    html: '<ol role="presentation"></ol>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 30 }
        }
      }
    ]
  },
  {
    html: '<table role="presentation"></table>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 36 }
        }
      }
    ]
  },
  {
    html: '<table role="none"></table>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 28 }
        }
      }
    ]
  },
  {
    html: '<button role="presentation"></button>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 38 }
        }
      }
    ]
  },
  {
    html: '<button role="none"></button>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 30 }
        }
      }
    ]
  },
  {
    html: '<label role="presentation"></label>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 36 }
        }
      }
    ]
  },
  {
    html: '<label role="none"></label>',
    checks: [
      {
        code: "E066",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 28 }
        }
      }
    ]
  },
  {
    html: '<div role="command interface"></div>',
    checks: [
      {
        code: "E067",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 37 }
        }
      }
    ]
  },
  {
    html: '<div role="COMMAND INTERFACE"></div>',
    checks: [
      {
        code: "E067",
        position: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 37 }
        }
      }
    ]
  }
];

describe("legacy linter | no-invalid-role", function () {
  ["foo", 1, [], /foo/].forEach((config) => {
    it("Should report an error when config is not an object", function () {
      const linter = createLegacyLinter({ "no-invalid-role": config });

      expect(() => linter.lint("")).to.throw(
        `Configuration for rule "no-invalid-role" is invalid: Expected object got ${get_config_type(config)}`
      );
    });
  });

  valid_html.forEach((html) => {
    it(`Should not report an error for valid html`, async function () {
      const linter = createLegacyLinter({ "no-invalid-role": true });

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });

  invalid_tests.forEach((ctx) => {
    it(`Should report an error for "${ctx.html}"`, async function () {
      const linter = createLegacyLinter({ "no-invalid-role": { reportNoneExisting: true } });

      const issues = await linter.lint(ctx.html);
      expect(issues).to.have.lengthOf(ctx.checks.length);
      ctx.checks.forEach((check, i) => {
        expect(issues[i].code).to.equal(check.code);
        expect(issues[i].position).to.deep.equal(check.position);
      });
    });
  });

  it("Should report error for none existing role by default", async function () {
    const linter = createLegacyLinter({ "no-invalid-role": true });

    const issues = await linter.lint('<div role="command interface"></div>');
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E067");
    expect(issues[0].position).to.deep.equal({
      start: { line: 1, column: 1 },
      end: { line: 1, column: 37 }
    });
  });

  it('Should not report error for none existing role by when config setting "reportNoneExisting" is set to false', async function () {
    const linter = createLegacyLinter({ "no-invalid-role": { reportNoneExisting: false } });

    const issues = await linter.lint('<div role="command interface"></div>');
    expect(issues).to.have.lengthOf(0);
  });
});

describe("no-invalid-role", function () {
  [true, "foo", 1, [], /foo/].forEach((config) => {
    it("Should report an error when config is not an object", function () {
      expect(() => createLinter({ "no-invalid-role": [true, config] })).to.throw(
        `Configuration for rule "no-invalid-role" is invalid: Expected object got ${get_config_type(config)}`
      );
    });
  });
  valid_html.forEach((html) => {
    it(`Should not report an error for valid html`, async function () {
      const linter = createLinter({ "no-invalid-role": true });

      const issues = await linter.lint(html);
      expect(issues).to.have.lengthOf(0);
    });
  });

  invalid_tests.forEach((ctx) => {
    it(`Should report an error for "${ctx.html}"`, async function () {
      const linter = createLinter({ "no-invalid-role": ["error", { reportNoneExisting: true }] });

      const issues = await linter.lint(ctx.html);
      expect(issues).to.have.lengthOf(ctx.checks.length);
      ctx.checks.forEach((check, i) => {
        expect(issues[i].code).to.equal(check.code);
        expect(issues[i].position).to.deep.equal(check.position);
      });
    });
  });

  it("Should report error for none existing role by default", async function () {
    const linter = createLinter({ "no-invalid-role": "error" });

    const issues = await linter.lint('<div role="command interface"></div>');
    expect(issues).to.have.lengthOf(1);
    expect(issues[0].code).to.equal("E067");
    expect(issues[0].position).to.deep.equal({
      start: { line: 1, column: 1 },
      end: { line: 1, column: 37 }
    });
  });

  it('Should not report error for none existing role by when config setting "reportNoneExisting" is set to false', async function () {
    const linter = createLinter({ "no-invalid-role": ["error", { reportNoneExisting: false }] });

    const issues = await linter.lint('<div role="command interface"></div>');
    expect(issues).to.have.lengthOf(0);
  });
});
