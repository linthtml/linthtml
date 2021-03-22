const { expect } = require("chai");
const parse = require("../../lib/parser");

describe("linter", function() {
  it("should be a function", function() {
    expect(parse).to.be.an.instanceOf(Function);
  });

  describe("parse", function() {
    it("should return correct line and column numbers", function() {
      const { children } = parse(
        [
          "<body>\n",
          "  <div a=\"jofwei\">\n",
          "    TextTextText\n",
          "  </div>\n",
          "</body>\n"
        ].join("")
      );
      expect(children[0].open.loc)
        .to
        .deep
        .equal({
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 7
          }
        });
      expect(children[0].close.loc)
        .to
        .deep
        .equal({
          start: {
            line: 5,
            column: 1
          },
          end: {
            line: 5,
            column: 8
          }
        });
      expect(children[0].children[1].open.loc)
        .to
        .deep
        .equal({
          start: {
            line: 2,
            column: 3
          },
          end: {
            line: 2,
            column: 19
          }
        });
      expect(children[0].children[1].close.loc)
        .to
        .deep
        .equal({
          start: {
            line: 4,
            column: 3
          },
          end: {
            line: 4,
            column: 9
          }
        });
    });

    it("multiple siblings", function() {
      const { children } = parse(
        [
          "<div></div>",
          "<div></div>",
          "<div></div>"
        ].join("\n")
      );
      expect(children)
        .to
        .have
        .lengthOf(5, "3 divs and 2 text node are extracted");
      expect(children[0].loc)
        .to
        .deep
        .equal({
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 12
          }
        });
      expect(children[2].loc)
        .to
        .deep
        .equal({
          start: {
            line: 2,
            column: 1
          },
          end: {
            line: 2,
            column: 12
          }
        });
      expect(children[4].loc)
        .to
        .deep
        .equal({
          start: {
            line: 3,
            column: 1
          },
          end: {
            line: 3,
            column: 12
          }
        });
    });

    it("Correctly extract doctype position", function() {
      const { children } = parse("<!DOCTYPE html>");
      expect(children)
        .to
        .have
        .lengthOf(1);
      expect(children[0].loc)
        .to
        .deep
        .equal({
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 16
          }
        });
    });

    it("Correctly extract doctype position when there's a comment before", function() {
      const { children } = parse(
        [
          "<!-- foo -->",
          "<!DOCTYPE html>"
        ].join("\n")
      );
      expect(children)
        .to
        .have
        .lengthOf(3, "1 comment, 1 text node and the doctype are extracted");
      expect(children[0].loc)
        .to
        .deep
        .equal({
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 13
          }
        });
      expect(children[2].loc)
        .to
        .deep
        .equal({
          start: {
            line: 2,
            column: 1
          },
          end: {
            line: 2,
            column: 16
          }
        });
    });
  });

  describe("onattribute", function() {
    it("should correctly extract all attributes", function() {
      const { children } = parse(
        [
          "<body>\n",
          "  <div class=\"hello\" id=\"identityDiv\" class=\"goodbye\">\n",
          "  </div>\n",
          "</body>\n"
        ].join("")
      );

      expect(children[0].children[1].attributes).to.have.lengthOf(3);
    });
  });
});
