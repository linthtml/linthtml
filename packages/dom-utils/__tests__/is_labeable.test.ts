import { describe, it } from "mocha";
import { expect } from "chai";
// To remove/fix after index.ts cleaning
// @ts-ignore
import { is_labelable } from "../lib";
import { Element, NodeAttribute, Position, CharValue, Range } from "../lib/dom_elements";
import { ElementType } from "domelementtype";

function generate_node_attribute(name: string, value?: string) {
  const name_loc = new Range(new Position(0, 0), new Position(0, name.length));
  const name_char = new CharValue(name, name_loc);

  if (value) {
    const equal_loc = new Range(name_loc.end, new Position(0, name.length + 1));
    const equal_char = new CharValue("=", equal_loc);

    const value_loc = new Range(equal_loc.end, new Position(0, name.length + 1 + value.length));
    const value_char = new CharValue(value, value_loc);
    return new NodeAttribute(name_char, new Range(name_loc.start, value_loc.end), 0, equal_char, value_char);
  }

  return new NodeAttribute(name_char, name_loc, 0);
}

describe("is_labeable", function () {
  [
    "button",
    "input", // if not in the hidden state
    "meter",
    "output",
    "progress",
    "select",
    "textarea"
  ].forEach((tag) => {
    it(`should return true for "${tag}" element`, function () {
      const node = new Element(tag, [], [], ElementType.Tag);

      const output = is_labelable(node);
      expect(output).to.be.true;
    });
  });
  it("should return false for hidden input element", function () {
    const node = new Element("input", [generate_node_attribute("type", "hidden")], [], ElementType.Tag);

    const output = is_labelable(node);
    expect(output).to.be.false;
  });
});
