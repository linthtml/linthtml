import { describe, it } from "mocha";
import { expect } from "chai";
import { parse, render } from "../index.js";

describe("HTML renderer", function () {
  it("should preserve simple HTML exactly", function () {
    const html = "<div>Hello World</div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve HTML with attributes", function () {
    const html = '<div class="container" id="main">Content</div>';
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve single quotes in attributes", function () {
    const html = "<div class='container'>Content</div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve no quotes in attributes", function () {
    const html = "<div class=container>Content</div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve boolean attributes", function () {
    const html = "<input disabled>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve self-closing tags", function () {
    const html = "<br>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve void elements with attributes", function () {
    const html = '<img src="image.png" alt="test">';
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve nested elements", function () {
    const html = "<div><p>Paragraph <strong>bold</strong> text</p></div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve comments", function () {
    const html = "<!-- This is a comment -->";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve doctype", function () {
    const html = "<!DOCTYPE html>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve whitespace in text", function () {
    const html = "<div>  Text with   spaces  </div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve newlines between elements", function () {
    const html = "<div>\n  <p>First</p>\n  <p>Second</p>\n</div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve multiline attributes", function () {
    const html = '<div class="multi\nline\nattribute">Content</div>';
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve complex HTML structure", function () {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
  <meta charset="utf-8">
</head>
<body>
  <div class="container" id="main">
    <h1>Hello World</h1>
    <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <!-- Comment -->
    <input type="text" disabled>
  </div>
</body>
</html>`;
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve complex HTML structure with complex node positioning", function () {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>
    Test Page</title>
  <meta charset="utf-8">
</head>
<body>
  <div class="container" id="main">
    <h1>Hello World
    </h1>
    <p>
      This is a paragraph with <strong>bold</strong> and <em>italic</em> text.
    </p>
    <!-- Comment -->
    <input type="text" disabled>
  </div>
</body>
</html>`;
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve script tags with content", function () {
    const html = "<script>var x = 1;\nconsole.log(x);</script>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve style tags with content", function () {
    const html = "<style>body {\n  color: red;\n}</style>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve special characters in text", function () {
    const html = "<div>Text with &lt;special&gt; &amp; characters</div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  it("should preserve multiple attributes with different quote styles", function () {
    const html = "<div id=\"test\" class=container disabled data-value='single'>Content</div>";
    const ast = parse(html);
    const result = render(ast);
    expect(result).to.equal(html);
  });

  describe("LintHTML inline instructions", function () {
    it("should preserve linthtml-configure instruction", function () {
      const html = '<!-- linthtml-configure attr-bans="false" -->';
      const ast = parse(html);
      const result = render(ast);
      expect(result).to.equal(html);
    });

    it("should preserve linthtml-disable instruction", function () {
      const html = "<!-- linthtml-disable attr-no-dup -->";
      const ast = parse(html);
      const result = render(ast);
      expect(result).to.equal(html);
    });

    it("should preserve linthtml-enable instruction", function () {
      const html = "<!-- linthtml-enable attr-no-dup -->";
      const ast = parse(html);
      const result = render(ast);
      expect(result).to.equal(html);
    });

    it("should preserve multiple inline instructions", function () {
      const html = `<!-- linthtml-disable attr-no-dup -->
<div class="test" class="duplicate">
<!-- linthtml-enable attr-no-dup -->
<p>Content</p>
<!-- linthtml-configure tag-bans="['p','style']" -->
<div>More content</div>`;
      const ast = parse(html);
      const result = render(ast);
      expect(result).to.equal(html);
    });

    it("should preserve linthtml-configure with complex JSON value", function () {
      const html = '<!-- linthtml-configure tag-bans=["p","style"] -->';
      const ast = parse(html);
      const result = render(ast);
      expect(result).to.equal(html);
    });

    it("should preserve linthtml instructions within HTML structure", function () {
      const html = `<!DOCTYPE html>
<html>
<body>
<!-- linthtml-disable attr-no-dup -->
<div class="test" class="duplicate">
<!-- linthtml-enable attr-no-dup -->
  <p>Content</p>
</div>
</body>
</html>`;
      const ast = parse(html);
      const result = render(ast);
      expect(result).to.equal(html);
    });
  });
});
