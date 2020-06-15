const { expect } = require("chai");
const parse = require("../../lib/parser");

describe("linter", function() {
  it("should be a function", function() {
    expect(parse).to.be.an.instanceOf(Function);
  });

  describe("parse", function() {
    it("should return correct line and column numbers", function() {
      const output = parse(
        [
          "<body>\n",
          "  <div a=\"jofwei\">\n",
          "    TextTextText\n",
          "  </div>\n",
          "</body>\n"
        ].join("")
      );
      expect(output[0].openLineCol).to.be.eql([1, 1]);
      expect(output[0].closeLineCol).to.be.eql([5, 1]);
      expect(output[0].children[1].openLineCol).to.be.eql([2, 3]);
      expect(output[0].children[1].closeLineCol).to.be.eql([4, 3]);
    });
  });

  describe("onattribute", function() {
    it("should correctly extract all attributes", function() {
      const output = parse(
        [
          "<body>\n",
          "  <div class=\"hello\" id=\"identityDiv\" class=\"goodbye\">\n",
          "  </div>\n",
          "</body>\n"
        ].join("")
      );

      expect(output[0].children[1].attributes).to.have.lengthOf(3);
    });
  });
});
