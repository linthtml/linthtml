const { expect } = require("chai");
const { is_labelable } = require("../lib");

describe("is_labeable", function() {
  it("should return false for hidden input element", function() {
    const node = {
      type: "tag",
      name: "input",
      attributes: [{
        type: "attribute",
        name: {
          chars: "type"
        },
        value: {
          chars: "hidden"
        }
      }]
    };

    const output = is_labelable(node);

    expect(output).to.be.false;
  });
});
