import { describe, it } from "mocha";
import { expect } from "chai";
// TODO find solution to remove dist/lib
import { Element } from "@linthtml/dom-utils/lib/dom_elements";
import parse from "../lib";

describe("HTML Parser", function () {
  it("Tags positions are correct (nesting)", function () {
    const { children } = parse(["<body>", '  <div a="jofwei">', "    TextTextText", "  </div>", "</body>"].join("\n"));
    expect(children[0].open.loc).to.deep.equal({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 7
      }
    });
    expect(children[0]?.close?.loc).to.deep.equal({
      start: {
        line: 5,
        column: 1
      },
      end: {
        line: 5,
        column: 8
      }
    });
    expect(children[0].children[1].open.loc).to.deep.equal({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 19
      }
    });
    expect(children[0]?.children[1]?.close?.loc).to.deep.equal({
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
  // TODO: check tag open end position different line

  it("Tags positions are correct (siblings)", function () {
    const { children } = parse(["<div></div>", "<div></div>", "<div></div>"].join("\n"));
    expect(children).to.have.lengthOf(5, "3 divs and 2 text node are extracted");
    expect(children[0].loc).to.deep.equal({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 12
      }
    });
    expect(children[2].loc).to.deep.equal({
      start: {
        line: 2,
        column: 1
      },
      end: {
        line: 2,
        column: 12
      }
    });
    expect(children[4].loc).to.deep.equal({
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

  it("Correctly extract doctype position", function () {
    const { children } = parse("<!DOCTYPE html>");
    expect(children).to.have.lengthOf(1);
    expect(children[0].loc).to.deep.equal({
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

  it("Correctly extract doctype position when there's a comment before", function () {
    const { children } = parse(["<!-- foo -->", "<!DOCTYPE html>"].join("\n"));
    expect(children).to.have.lengthOf(3, "1 comment, 1 text node and the doctype are extracted");
    expect(children[0].loc).to.deep.equal({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 13
      }
    });
    expect(children[2].loc).to.deep.equal({
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

  it("should correctly extract all attributes", function () {
    const { children } = parse(
      ["<body>", '  <div class="hello" id="identityDiv" class="goodbye">', "  </div>", "</body>"].join("\n")
    );
    const div = <Element>children[0].children[1];

    expect(div.attributes).to.have.lengthOf(3);
    const [class_1, id, class_2] = div.attributes;

    expect(class_1.type).to.equal("attribute");
    expect(class_1.loc).to.deep.equal({
      start: {
        line: 2,
        column: 8
      },
      end: {
        line: 2,
        column: 21
      }
    });
    expect(class_1.name.chars).to.equal("class");
    expect(class_1.name.raw).to.be.undefined;
    expect(class_1.name.loc).to.deep.equal({
      start: {
        line: 2,
        column: 8
      },
      end: {
        line: 2,
        column: 13
      }
    });
    expect(class_1?.equal?.chars).to.equal("=");
    expect(class_1?.equal?.raw).to.be.undefined; // should contains `=` + spaces?
    expect(class_1?.equal?.loc).to.deep.equal({
      start: {
        line: 2,
        column: 13
      },
      end: {
        line: 2,
        column: 14
      }
    });
    expect(class_1?.value?.chars).to.equal("hello");
    expect(class_1?.value?.raw).to.be.equal('"hello"');
    expect(class_1?.value?.loc).to.deep.equal({
      start: {
        line: 2,
        column: 14
      },
      end: {
        line: 2,
        column: 21
      }
    });

    expect(id.type).to.equal("attribute");
    expect(id.loc).to.deep.equal({
      start: {
        line: 2,
        column: 22
      },
      end: {
        line: 2,
        column: 38
      }
    });
    expect(id.name.chars).to.equal("id");
    expect(id.name.raw).to.be.undefined;
    expect(id.name.loc).to.deep.equal({
      start: {
        line: 2,
        column: 22
      },
      end: {
        line: 2,
        column: 24
      }
    });
    expect(id?.equal?.chars).to.equal("=");
    expect(id?.equal?.raw).to.be.undefined; // should contains `=` + spaces?
    expect(id?.equal?.loc).to.deep.equal({
      start: {
        line: 2,
        column: 24
      },
      end: {
        line: 2,
        column: 25
      }
    });
    expect(id?.value?.chars).to.equal("identityDiv");
    expect(id?.value?.raw).to.be.equal('"identityDiv"');
    expect(id?.value?.loc).to.deep.equal({
      start: {
        line: 2,
        column: 25
      },
      end: {
        line: 2,
        column: 38
      }
    });

    expect(class_2.type).to.equal("attribute");
    expect(class_2.loc).to.deep.equal({
      start: {
        line: 2,
        column: 39
      },
      end: {
        line: 2,
        column: 54
      }
    });
    expect(class_2.name.chars).to.equal("class");
    expect(class_2.name.raw).to.be.undefined;
    expect(class_2.name.loc).to.deep.equal({
      start: {
        line: 2,
        column: 39
      },
      end: {
        line: 2,
        column: 44
      }
    });
    expect(class_2?.equal?.chars).to.equal("=");
    expect(class_2?.equal?.raw).to.be.undefined; // should contains `=` + spaces?
    expect(class_2?.equal?.loc).to.deep.equal({
      start: {
        line: 2,
        column: 44
      },
      end: {
        line: 2,
        column: 45
      }
    });
    expect(class_2?.value?.chars).to.equal("goodbye");
    expect(class_2?.value?.raw).to.be.equal('"goodbye"');
    expect(class_2?.value?.loc).to.deep.equal({
      start: {
        line: 2,
        column: 45
      },
      end: {
        line: 2,
        column: 54
      }
    });
  });

  it("should correctly extract all attributes on multiple lines", function () {
    const { children } = parse(
      ["<body>", "  <div", '    class="hello"', '    id="identityDiv"', "  >", "  </div>", "</body>"].join("\n")
    );
    const div = <Element>children[0].children[1];

    expect(div.attributes).to.have.lengthOf(2);
    const [_class, id] = div.attributes;

    expect(_class.type).to.equal("attribute");
    expect(_class.name.chars).to.equal("class");
    expect(_class.name.raw).to.be.undefined;
    expect(_class.name.loc).to.deep.equal({
      start: {
        line: 3,
        column: 5
      },
      end: {
        line: 3,
        column: 10
      }
    });
    expect(_class?.equal?.chars).to.equal("=");
    expect(_class?.equal?.raw).to.be.undefined; // should contains `=` + spaces?
    expect(_class?.equal?.loc).to.deep.equal({
      start: {
        line: 3,
        column: 10
      },
      end: {
        line: 3,
        column: 11
      }
    });
    expect(_class?.value?.chars).to.equal("hello");
    expect(_class?.value?.raw).to.be.equal('"hello"');
    expect(_class?.value?.loc).to.deep.equal({
      start: {
        line: 3,
        column: 11
      },
      end: {
        line: 3,
        column: 18
      }
    });

    expect(id.type).to.equal("attribute");
    expect(id.name.chars).to.equal("id");
    expect(id.name.raw).to.be.undefined;
    expect(id.name.loc).to.deep.equal({
      start: {
        line: 4,
        column: 5
      },
      end: {
        line: 4,
        column: 7
      }
    });
    expect(id?.equal?.chars).to.equal("=");
    expect(id?.equal?.raw).to.be.undefined; // should contains `=` + spaces?
    expect(id?.equal?.loc).to.deep.equal({
      start: {
        line: 4,
        column: 7
      },
      end: {
        line: 4,
        column: 8
      }
    });
    expect(id?.value?.chars).to.equal("identityDiv");
    expect(id?.value?.raw).to.be.equal('"identityDiv"');
    expect(id?.value?.loc).to.deep.equal({
      start: {
        line: 4,
        column: 8
      },
      end: {
        line: 4,
        column: 21
      }
    });
  });

  it("should correctly extract attribute with value on multiline", function () {
    const { children } = parse(
      ["<body>", "  <div", '    class="hello', '      identityDiv"', "  >", "  </div>", "</body>"].join("\n")
    );
    const div = <Element>children[0].children[1];

    expect(div.attributes).to.have.lengthOf(1);
    const [_class] = div.attributes;

    expect(_class.type).to.equal("attribute");
    expect(_class.loc).to.deep.equal({
      start: {
        line: 3,
        column: 5
      },
      end: {
        line: 4,
        column: 19
      }
    });

    expect(_class.name.chars).to.equal("class");
    expect(_class.name.raw).to.be.undefined;
    expect(_class.name.loc).to.deep.equal({
      start: {
        line: 3,
        column: 5
      },
      end: {
        line: 3,
        column: 10
      }
    });
    expect(_class?.equal?.chars).to.equal("=");
    expect(_class?.equal?.raw).to.be.undefined; // should contains `=` + spaces?
    expect(_class?.equal?.loc).to.deep.equal({
      start: {
        line: 3,
        column: 10
      },
      end: {
        line: 3,
        column: 11
      }
    });
    expect(_class?.value?.chars).to.equal("hello\n      identityDiv");
    expect(_class?.value?.raw).to.be.equal('"hello\n      identityDiv"');
    expect(_class?.value?.loc).to.deep.equal({
      start: {
        line: 3,
        column: 11
      },
      end: {
        line: 4,
        column: 19
      }
    });
  });
});
