import { Element } from "@linthtml/dom-utils/lib/dom_elements";
import parse from "..";

describe("HTML Parser", () => {
  it("Tags positions are correct (nesting)", () => {
    const { children } = parse(["<body>", '  <div a="jofwei">', "    TextTextText", "  </div>", "</body>"].join("\n"));
    expect(children[0].open.loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 7
      }
    });
    expect(children[0]?.close?.loc).toEqual({
      start: {
        line: 5,
        column: 1
      },
      end: {
        line: 5,
        column: 8
      }
    });
    expect(children[0].children[1].open.loc).toEqual({
      start: {
        line: 2,
        column: 3
      },
      end: {
        line: 2,
        column: 19
      }
    });
    expect(children[0]?.children[1]?.close?.loc).toEqual({
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

  it("Tags positions are correct (siblings)", () => {
    const { children } = parse(["<div></div>", "<div></div>", "<div></div>"].join("\n"));
    expect(children).toHaveLength(5);
    expect(children[0].loc).toEqual({
      start: {
        line: 1,
        column: 1
      },
      end: {
        line: 1,
        column: 12
      }
    });
    expect(children[2].loc).toEqual({
      start: {
        line: 2,
        column: 1
      },
      end: {
        line: 2,
        column: 12
      }
    });
    expect(children[4].loc).toEqual({
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

  it("Correctly extract doctype position", () => {
    const { children } = parse("<!DOCTYPE html>");
    expect(children).toHaveLength(1);
    expect(children[0].loc).toEqual({
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

  it(
    "Correctly extract doctype position when there's a comment before",
    () => {
      const { children } = parse(["<!-- foo -->", "<!DOCTYPE html>"].join("\n"));
      expect(children).toHaveLength(3);
      expect(children[0].loc).toEqual({
        start: {
          line: 1,
          column: 1
        },
        end: {
          line: 1,
          column: 13
        }
      });
      expect(children[2].loc).toEqual({
        start: {
          line: 2,
          column: 1
        },
        end: {
          line: 2,
          column: 16
        }
      });
    }
  );

  it("should correctly extract all attributes", () => {
    const { children } = parse(
      ["<body>", '  <div class="hello" id="identityDiv" class="goodbye">', "  </div>", "</body>"].join("\n")
    );
    const div = <Element>children[0].children[1];

    expect(div.attributes).toHaveLength(3);
    const [class_1, id, class_2] = div.attributes;

    expect(class_1.type).toBe("attribute");
    expect(class_1.loc).toEqual({
      start: {
        line: 2,
        column: 8
      },
      end: {
        line: 2,
        column: 21
      }
    });
    expect(class_1.name.chars).toBe("class");
    expect(class_1.name.raw).toBeUndefined();
    expect(class_1.name.loc).toEqual({
      start: {
        line: 2,
        column: 8
      },
      end: {
        line: 2,
        column: 13
      }
    });
    expect(class_1?.equal?.chars).toBe("=");
    expect(class_1?.equal?.raw).toBeUndefined(); // should contains `=` + spaces?
    expect(class_1?.equal?.loc).toEqual({
      start: {
        line: 2,
        column: 13
      },
      end: {
        line: 2,
        column: 14
      }
    });
    expect(class_1?.value?.chars).toBe("hello");
    expect(class_1?.value?.raw).toBe('"hello"');
    expect(class_1?.value?.loc).toEqual({
      start: {
        line: 2,
        column: 14
      },
      end: {
        line: 2,
        column: 21
      }
    });

    expect(id.type).toBe("attribute");
    expect(id.loc).toEqual({
      start: {
        line: 2,
        column: 22
      },
      end: {
        line: 2,
        column: 38
      }
    });
    expect(id.name.chars).toBe("id");
    expect(id.name.raw).toBeUndefined();
    expect(id.name.loc).toEqual({
      start: {
        line: 2,
        column: 22
      },
      end: {
        line: 2,
        column: 24
      }
    });
    expect(id?.equal?.chars).toBe("=");
    expect(id?.equal?.raw).toBeUndefined(); // should contains `=` + spaces?
    expect(id?.equal?.loc).toEqual({
      start: {
        line: 2,
        column: 24
      },
      end: {
        line: 2,
        column: 25
      }
    });
    expect(id?.value?.chars).toBe("identityDiv");
    expect(id?.value?.raw).toBe('"identityDiv"');
    expect(id?.value?.loc).toEqual({
      start: {
        line: 2,
        column: 25
      },
      end: {
        line: 2,
        column: 38
      }
    });

    expect(class_2.type).toBe("attribute");
    expect(class_2.loc).toEqual({
      start: {
        line: 2,
        column: 39
      },
      end: {
        line: 2,
        column: 54
      }
    });
    expect(class_2.name.chars).toBe("class");
    expect(class_2.name.raw).toBeUndefined();
    expect(class_2.name.loc).toEqual({
      start: {
        line: 2,
        column: 39
      },
      end: {
        line: 2,
        column: 44
      }
    });
    expect(class_2?.equal?.chars).toBe("=");
    expect(class_2?.equal?.raw).toBeUndefined(); // should contains `=` + spaces?
    expect(class_2?.equal?.loc).toEqual({
      start: {
        line: 2,
        column: 44
      },
      end: {
        line: 2,
        column: 45
      }
    });
    expect(class_2?.value?.chars).toBe("goodbye");
    expect(class_2?.value?.raw).toBe('"goodbye"');
    expect(class_2?.value?.loc).toEqual({
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

  it("should correctly extract all attributes on multiple lines", () => {
    const { children } = parse(
      ["<body>", "  <div", '    class="hello"', '    id="identityDiv"', "  >", "  </div>", "</body>"].join("\n")
    );
    const div = <Element>children[0].children[1];

    expect(div.attributes).toHaveLength(2);
    const [_class, id] = div.attributes;

    expect(_class.type).toBe("attribute");
    expect(_class.name.chars).toBe("class");
    expect(_class.name.raw).toBeUndefined();
    expect(_class.name.loc).toEqual({
      start: {
        line: 3,
        column: 5
      },
      end: {
        line: 3,
        column: 10
      }
    });
    expect(_class?.equal?.chars).toBe("=");
    expect(_class?.equal?.raw).toBeUndefined(); // should contains `=` + spaces?
    expect(_class?.equal?.loc).toEqual({
      start: {
        line: 3,
        column: 10
      },
      end: {
        line: 3,
        column: 11
      }
    });
    expect(_class?.value?.chars).toBe("hello");
    expect(_class?.value?.raw).toBe('"hello"');
    expect(_class?.value?.loc).toEqual({
      start: {
        line: 3,
        column: 11
      },
      end: {
        line: 3,
        column: 18
      }
    });

    expect(id.type).toBe("attribute");
    expect(id.name.chars).toBe("id");
    expect(id.name.raw).toBeUndefined();
    expect(id.name.loc).toEqual({
      start: {
        line: 4,
        column: 5
      },
      end: {
        line: 4,
        column: 7
      }
    });
    expect(id?.equal?.chars).toBe("=");
    expect(id?.equal?.raw).toBeUndefined(); // should contains `=` + spaces?
    expect(id?.equal?.loc).toEqual({
      start: {
        line: 4,
        column: 7
      },
      end: {
        line: 4,
        column: 8
      }
    });
    expect(id?.value?.chars).toBe("identityDiv");
    expect(id?.value?.raw).toBe('"identityDiv"');
    expect(id?.value?.loc).toEqual({
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

  it(
    "should correctly extract attribute with value on multiline",
    () => {
      const { children } = parse(
        ["<body>", "  <div", '    class="hello', '      identityDiv"', "  >", "  </div>", "</body>"].join("\n")
      );
      const div = <Element>children[0].children[1];

      expect(div.attributes).toHaveLength(1);
      const [_class] = div.attributes;

      expect(_class.type).toBe("attribute");
      expect(_class.loc).toEqual({
        start: {
          line: 3,
          column: 5
        },
        end: {
          line: 4,
          column: 19
        }
      });

      expect(_class.name.chars).toBe("class");
      expect(_class.name.raw).toBeUndefined();
      expect(_class.name.loc).toEqual({
        start: {
          line: 3,
          column: 5
        },
        end: {
          line: 3,
          column: 10
        }
      });
      expect(_class?.equal?.chars).toBe("=");
      expect(_class?.equal?.raw).toBeUndefined(); // should contains `=` + spaces?
      expect(_class?.equal?.loc).toEqual({
        start: {
          line: 3,
          column: 10
        },
        end: {
          line: 3,
          column: 11
        }
      });
      expect(_class?.value?.chars).toBe("hello\n      identityDiv");
      expect(_class?.value?.raw).toBe('"hello\n      identityDiv"');
      expect(_class?.value?.loc).toEqual({
        start: {
          line: 3,
          column: 11
        },
        end: {
          line: 4,
          column: 19
        }
      });
    }
  );
});
