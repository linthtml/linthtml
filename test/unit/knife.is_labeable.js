const { expect } = require("chai");
const { is_labelable } = require("../../lib/knife");

describe("knife.is_labeable", function() {
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

    const output = is_labelable(ele);

    expect(output).to.be.eql(false);
  });
});
