const { expect } = require("chai");

describe("parser.dom_builder", function() {
  const DomBuilder = require("../../lib/parser/dom_builder");
  const DomHandler = require("htmlparser2").DomHandler;

  it("should be a constructor", function() {
    expect(DomBuilder).to.be.an.instanceOf(Function);
  });

  it("should inherit from DomHandler", function() {
    expect(DomBuilder.prototype).to.be.an.instanceOf(DomHandler);
  });

  describe("onerror", function() {
    it("should throw the error", function() {
      const builder = new DomBuilder();

      expect(function() {
        builder.onerror("error");
      }).to.throw();
    });
  });
});
