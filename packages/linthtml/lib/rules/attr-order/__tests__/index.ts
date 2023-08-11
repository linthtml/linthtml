import { LegacyLinterConfig, RuleConfig } from "../../../read-config";
import linthtml from "../../../index";
import { presets } from "../../../presets";

describe("legacy linter | attr-order", () => {
  function createLinter(config: LegacyLinterConfig) {
    return new linthtml.LegacyLinter(linthtml.rules, presets.none, config);
  }
  it(
    "Should not report errors when attributes are in the correct order",
    async () => {
      const linter = createLinter({
        "attr-order": ["class", "src", "height", "width"]
      });
      const html = "<img class='test' src='test.gif' height='200' width='300'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should fail when attribute order is reversed", async () => {
    const linter = createLinter({ "attr-order": ["class", "src"] });
    const html = "<img src='test.gif' class='test' />";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report one error per misplaced attribute", async () => {
    const linter = createLinter({
      "attr-order": ["class", "src", "height", "width"]
    });
    const html = "<img height='200' src='test.gif' class='test' width='300'/>";

    // should report error for src and class but not width
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it(
    "Should not report error for attributes that are not present",
    async () => {
      const linter = createLinter({
        "attr-order": ["class", "src", "height", "width"]
      });
      const html = "<img src='test.gif' height='200'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    "Should not report additional errors for attributes which are not present",
    async () => {
      const linter = createLinter({
        "attr-order": ["class", "src", "height", "width"]
      });
      const html = "<img src='test.gif' class='test'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should be case insensitive (OK)", async () => {
    const linter = createLinter({
      "attr-order": ["class", "src", "HEIGHT", "width"]
    });
    const html = "<img CLASS='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should be case insensitive (KO)", async () => {
    const linter = createLinter({
      "attr-order": ["class", "src", "HEIGHT", "width"]
    });
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should workds for attributes without value", async () => {
    const linter = createLinter({
      "attr-order": ["type", "aria-label", "disabled"]
    });
    const html = "<input disabled type='checkbox' aria-label='A checkbox'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should accept Regexp as config (OK)", async () => {
    const linter = createLinter({ "attr-order": ["class", /^.*$/] });
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should accept Regexp as config (KO)", async () => {
    const linter = createLinter({ "attr-order": ["class", /^.*$/] });
    const html = "<img src='test.gif' class='test' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should accept multiple Regexp as config (OK)", async () => {
    const linter = createLinter({
      "attr-order": ["class", /^data-.*$/, /^.*$/]
    });
    const html = "<img class='test' data-x src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should accept multiple Regexp as config (KO)", async () => {
    const linter = createLinter({
      "attr-order": ["class", /^data-.*$/, /^.*$/]
    });
    const html = "<img data-x class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should throw an error when an invalid config is provided", () => {
    const linter = createLinter({ "attr-order": ["class", 3] });
    const html = "";
    expect(() => linter.lint(html)).toThrow(
      'Configuration for rule "attr-order" is invalid: Expected (string|RegExp)[] got number[]'
    );
  });

  it(
    "Should throw an error when an invalid config is provided (string only)",
    () => {
      const linter = createLinter({ "attr-order": "class" });
      const html = "";
      expect(() => linter.lint(html)).toThrow(
        'Configuration for rule "attr-order" is invalid: Expected (string|RegExp)[] got string'
      );
    }
  );
});

describe("attr-order", () => {
  function createLinter(rules: { [rule_name: string]: RuleConfig }) {
    return linthtml.fromConfig({ rules });
  }
  it(
    "Should not report errors when attributes are in the correct order",
    async () => {
      const linter = createLinter({
        "attr-order": [true, ["class", "src", "height", "width"]]
      });
      const html = "<img class='test' src='test.gif' height='200' width='300'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it("Should fail when attribute order is reversed", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", "src"]]
    });
    const html = "<img src='test.gif' class='test' />";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should report one error per misplaced attribute", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", "src", "height", "width"]]
    });
    const html = "<img height='200' src='test.gif' class='test' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(2);
  });

  it(
    "Should not report error for attributes that are not present",
    async () => {
      const linter = createLinter({
        "attr-order": [true, ["class", "src", "height", "width"]]
      });
      const html = "<img src='test.gif' height='200'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(0);
    }
  );

  it(
    "Should not report additional errors for attributes which are not present",
    async () => {
      const linter = createLinter({
        "attr-order": [true, ["class", "src", "height", "width"]]
      });
      const html = "<img src='test.gif' class='test'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should be case insensitive (OK)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", "src", "HEIGHT", "width"]]
    });
    const html = "<img CLASS='test' src='test.gif' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should be case insensitive (HTML attributes) (KO)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", "src", "height", "width"]]
    });
    const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it(
    "Should be case insensitive (HTML attributes and config) (KO)",
    async () => {
      const linter = createLinter({
        "attr-order": [true, ["CLASS", "src", "HEIGHT", "width"]]
      });
      const html = "<img src='test.gif' CLASS='test' height='200' width='300'/>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Report errors for angular like attributes (*ngIf)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["*ngIf", "class"]]
    });
    const html = "<div class='item' *ngIf='bar'></div>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it(
    "Report errors for angular like attributes ([ngClass])",
    async () => {
      const linter = createLinter({
        "attr-order": [true, ["[ngClass]", "class"]]
      });
      const html = "<div class='table' [ngClass]='foo'></div>";

      const issues = await linter.lint(html);
      expect(issues).toHaveLength(1);
    }
  );

  it("Should workds for attributes without value", async () => {
    const linter = createLinter({
      "attr-order": ["error", ["type", "aria-label", "disabled"]]
    });
    const html = "<input disabled type='checkbox' aria-label='A checkbox'/>";

    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should accept Regexp as config (OK)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", /^.*$/]]
    });
    const html = "<img class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should accept Regexp as config (KO)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", /^.*$/]]
    });
    const html = "<img src='test.gif' class='test' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should accept multiple Regexp as config (OK)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", /^data-.*$/, /^.*$/]]
    });
    const html = "<img class='test' data-x src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(0);
  });

  it("Should accept multiple Regexp as config (KO)", async () => {
    const linter = createLinter({
      "attr-order": [true, ["class", /^data-.*$/, /^.*$/]]
    });
    const html = "<img data-x class='test' src='test.gif' height='200' width='300'/>";

    // class then everything else
    const issues = await linter.lint(html);
    expect(issues).toHaveLength(1);
  });

  it("Should throw an error when an invalid config is provided", () => {
    const config = {
      "attr-order": [true, ["class", 3]] as [boolean, unknown]
    };
    expect(() => createLinter(config)).toThrow(
      'Configuration for rule "attr-order" is invalid: Expected (string|RegExp)[] got number[]'
    );
  });

  it(
    "Should throw an error when an invalid config is provided (string only)",
    () => {
      const config = {
        "attr-order": [true, "class"] as [boolean, unknown]
      };
      expect(() => createLinter(config)).toThrow(
        'Configuration for rule "attr-order" is invalid: Expected (string|RegExp)[] got string'
      );
    }
  );
});
