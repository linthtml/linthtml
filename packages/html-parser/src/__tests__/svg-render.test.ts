import { parse, render } from "../index.js";
import type { Element } from "@linthtml/dom-utils";
import { describe, it } from "mocha";
import { expect } from "chai";

describe("SVG elements rendering", function () {
  it("should preserve SVG path with closing tag", function () {
    const html = '<svg><path d="M10 10"></path></svg>';
    const ast = parse(html);
    console.log("Children count:", ast.children.length);
    if (ast.children[0]) {
      console.log("SVG children count:", ast.children[0].children.length);
      if (ast.children[0].children[0]) {
        const path = ast.children[0].children[0] as Element;
        console.log("Path node name:", path.name);
        console.log("Path has close tag:", !!path.close);
        console.log("Path open raw:", path.open?.raw);
        console.log("Path close raw:", path.close?.raw);
      }
    }
    const result = render(ast);
    console.log("Original:", html);
    console.log("Rendered:", result);
    expect(result).to.equal(html);
  });
});
