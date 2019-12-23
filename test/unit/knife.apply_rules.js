const { expect } = require("chai");

describe("knife.apply_rules", function() {
  const knife = require("../../lib/knife");

  it("should return [] for no rules", function() {
    const output = knife.applyRules(null);

    expect(output).to.be.eql([]);
  });
});
