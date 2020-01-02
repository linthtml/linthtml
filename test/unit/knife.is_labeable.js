const { expect } = require("chai");

describe("knife.is_labeable", function() {
  const knife = require("../../lib/knife");

  it("should return false for hidden input element", function() {
    const ele = {
      type: "tag",
      name: "input",
      attribs: {
        type: {
          value: "hidden"
        }
      }
    };

    const output = knife.isLabeable(ele);

    expect(output).to.be.eql(false);
  });
});
