import type { Fix } from "../issue";
import { apply_fixes } from "../fix_applicator.js";
import { expect } from "chai";

describe("apply_fixes", () => {
  describe("single fix", () => {
    it("removes text from HTML", () => {
      const html = '<div align="center">text</div>';
      const fix: Fix = {
        loc: {
          start: { line: 1, column: 6 },
          end: { line: 1, column: 20 }
        },
        text: ""
      };

      const result = apply_fixes(html, [fix]);
      expect(result).to.equal("<div >text</div>");
    });
    it("replaces text in HTML", () => {
      const html = '<div class="old">text</div>';
      const fix: Fix = {
        loc: {
          start: { line: 1, column: 13 },
          end: { line: 1, column: 16 }
        },
        text: "new"
      };

      const result = apply_fixes(html, [fix]);
      expect(result).to.equal('<div class="new">text</div>');
    });
    it("inserts text in HTML", () => {
      const html = "<div>text</div>";
      const fix: Fix = {
        loc: {
          start: { line: 1, column: 5 },
          end: { line: 1, column: 5 }
        },
        text: ' class="test"'
      };

      const result = apply_fixes(html, [fix]);
      expect(result).to.equal('<div class="test">text</div>');
    });
  });
  describe("multiple non-overlapping fixes", () => {
    it("applies multiple fixes in correct order", () => {
      const html = '<div align="center" valign="top">text</div>';
      const fixes: Fix[] = [
        {
          loc: {
            start: { line: 1, column: 21 },
            end: { line: 1, column: 33 }
          }, // valign="top"
          text: ""
        },
        {
          loc: {
            start: { line: 1, column: 6 },
            end: { line: 1, column: 20 }
          }, // align="center"
          text: ""
        }
      ];

      const result = apply_fixes(html, fixes);
      expect(result).to.equal("<div  >text</div>");
    });
    it("applies fixes on different lines", () => {
      const html = `<div align="center">
  <span valign="top">text</span>
</div>`;
      const fixes: Fix[] = [
        {
          loc: {
            start: { line: 2, column: 9 },
            end: { line: 2, column: 21 }
          }, // valign="top"
          text: ""
        },
        {
          loc: {
            start: { line: 1, column: 6 },
            end: { line: 1, column: 20 }
          }, // align="center"
          text: ""
        }
      ];

      const result = apply_fixes(html, fixes);
      expect(result).to.equal(`<div >
  <span >text</span>
</div>`);
    });
  });
  describe("overlapping fixes", () => {
    it("skips overlapping fixes (applies only first)", () => {
      const html = '<div align="center" class="test">text</div>';
      const fixes: Fix[] = [
        {
          loc: {
            start: { line: 1, column: 6 },
            end: { line: 1, column: 33 }
          }, // align="center" class="test">
          text: ""
        },
        {
          loc: {
            start: { line: 1, column: 21 },
            end: { line: 1, column: 33 }
          }, // class="test"> (overlaps)
          text: ""
        }
      ];

      const result = apply_fixes(html, fixes);
      // Fix 1 (highest end) is applied, Fix 2 is skipped (overlaps)
      expect(result).to.equal("<div >text</div>");
    });
    it("applies non-overlapping and skips overlapping", () => {
      // Three attributes where middle two overlap
      const html = '<div align="center" valign="top" id="main">text</div>';
      const fixes: Fix[] = [
        {
          loc: {
            start: { line: 1, column: 6 },
            end: { line: 1, column: 20 }
          }, // align="center" (cols 6-20)
          text: ""
        },
        {
          loc: {
            start: { line: 1, column: 21 },
            end: { line: 1, column: 33 }
          }, // valign="top" (cols 21-33)
          text: ""
        },
        {
          loc: {
            start: { line: 1, column: 34 },
            end: { line: 1, column: 43 }
          }, // id="main" (cols 34-43)
          text: ""
        }
      ];

      const result = apply_fixes(html, fixes);
      // All three fixes are non-overlapping, all should be applied
      // Note: They leave spaces between attributes
      expect(result).to.equal("<div   >text</div>");
    });
  });
  describe("edge cases", () => {
    it("handles empty fixes array", () => {
      const html = "<div>text</div>";
      const result = apply_fixes(html, []);
      expect(result).to.equal(html);
    });
    it("handles fix at start of file", () => {
      const html = "<!DOCTYPE html><div>text</div>";
      const fix: Fix = {
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 16 }
        },
        text: ""
      };

      const result = apply_fixes(html, [fix]);
      expect(result).to.equal("<div >text</div>");
    });
    it("handles fix at end of file", () => {
      const html = "<div>text</div>";
      const fix: Fix = {
        loc: {
          start: { line: 1, column: 10 },
          end: { line: 1, column: 16 }
        },
        text: ""
      };

      const result = apply_fixes(html, [fix]);
      expect(result).to.equal("<div>text");
    });
  });
});
