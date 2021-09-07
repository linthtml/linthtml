"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const lib_1 = __importDefault(require("../lib"));
(0, mocha_1.describe)("HTML Parser", function () {
    (0, mocha_1.it)("Tags positions are correct (nesting)", function () {
        const { children } = (0, lib_1.default)([
            "<body>",
            "  <div a=\"jofwei\">",
            "    TextTextText",
            "  </div>",
            "</body>"
        ].join("\n"));
        (0, chai_1.expect)(children[0].open.loc)
            .to
            .deep
            .equal({
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 7
            }
        });
        (0, chai_1.expect)(children[0].close.loc)
            .to
            .deep
            .equal({
            start: {
                line: 5,
                column: 1
            },
            end: {
                line: 5,
                column: 8
            }
        });
        (0, chai_1.expect)(children[0].children[1].open.loc)
            .to
            .deep
            .equal({
            start: {
                line: 2,
                column: 3
            },
            end: {
                line: 2,
                column: 19
            }
        });
        (0, chai_1.expect)(children[0].children[1].close.loc)
            .to
            .deep
            .equal({
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
    (0, mocha_1.it)("Tags positions are correct (siblings)", function () {
        const { children } = (0, lib_1.default)([
            "<div></div>",
            "<div></div>",
            "<div></div>"
        ].join("\n"));
        (0, chai_1.expect)(children)
            .to
            .have
            .lengthOf(5, "3 divs and 2 text node are extracted");
        (0, chai_1.expect)(children[0].loc)
            .to
            .deep
            .equal({
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 12
            }
        });
        (0, chai_1.expect)(children[2].loc)
            .to
            .deep
            .equal({
            start: {
                line: 2,
                column: 1
            },
            end: {
                line: 2,
                column: 12
            }
        });
        (0, chai_1.expect)(children[4].loc)
            .to
            .deep
            .equal({
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
    (0, mocha_1.it)("Correctly extract doctype position", function () {
        const { children } = (0, lib_1.default)("<!DOCTYPE html>");
        (0, chai_1.expect)(children)
            .to
            .have
            .lengthOf(1);
        (0, chai_1.expect)(children[0].loc)
            .to
            .deep
            .equal({
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
    (0, mocha_1.it)("Correctly extract doctype position when there's a comment before", function () {
        const { children } = (0, lib_1.default)([
            "<!-- foo -->",
            "<!DOCTYPE html>"
        ].join("\n"));
        (0, chai_1.expect)(children)
            .to
            .have
            .lengthOf(3, "1 comment, 1 text node and the doctype are extracted");
        (0, chai_1.expect)(children[0].loc)
            .to
            .deep
            .equal({
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 13
            }
        });
        (0, chai_1.expect)(children[2].loc)
            .to
            .deep
            .equal({
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
    (0, mocha_1.it)("should correctly extract all attributes", function () {
        const { children } = (0, lib_1.default)([
            "<body>",
            "  <div class=\"hello\" id=\"identityDiv\" class=\"goodbye\">",
            "  </div>",
            "</body>"
        ].join("\n"));
        const div = children[0].children[1];
        (0, chai_1.expect)(div.attributes).to.have.lengthOf(3);
        //@ts-ignore
        const [class_1, id, class_2] = div.attributes;
        (0, chai_1.expect)(class_1.type).to.equal("attribute");
        (0, chai_1.expect)(class_1.loc).to.deep.equal({
            start: {
                line: 2,
                column: 8
            },
            end: {
                line: 2,
                column: 21
            }
        });
        (0, chai_1.expect)(class_1.name.chars).to.equal("class");
        (0, chai_1.expect)(class_1.name.raw).to.be.undefined;
        (0, chai_1.expect)(class_1.name.loc).to.deep.equal({
            start: {
                line: 2,
                column: 8
            },
            end: {
                line: 2,
                column: 13
            }
        });
        (0, chai_1.expect)(class_1.equal.chars).to.equal("=");
        (0, chai_1.expect)(class_1.equal.raw).to.be.undefined; // should contains `=` + spaces?
        (0, chai_1.expect)(class_1.equal.loc).to.deep.equal({
            start: {
                line: 2,
                column: 13
            },
            end: {
                line: 2,
                column: 14
            }
        });
        (0, chai_1.expect)(class_1.value.chars).to.equal("hello");
        (0, chai_1.expect)(class_1.value.raw).to.be.equal("\"hello\"");
        (0, chai_1.expect)(class_1.value.loc).to.deep.equal({
            start: {
                line: 2,
                column: 14
            },
            end: {
                line: 2,
                column: 21
            }
        });
        (0, chai_1.expect)(id.type).to.equal("attribute");
        (0, chai_1.expect)(id.loc).to.deep.equal({
            start: {
                line: 2,
                column: 22
            },
            end: {
                line: 2,
                column: 38
            }
        });
        (0, chai_1.expect)(id.name.chars).to.equal("id");
        (0, chai_1.expect)(id.name.raw).to.be.undefined;
        (0, chai_1.expect)(id.name.loc).to.deep.equal({
            start: {
                line: 2,
                column: 22
            },
            end: {
                line: 2,
                column: 24
            }
        });
        (0, chai_1.expect)(id.equal.chars).to.equal("=");
        (0, chai_1.expect)(id.equal.raw).to.be.undefined; // should contains `=` + spaces?
        (0, chai_1.expect)(id.equal.loc).to.deep.equal({
            start: {
                line: 2,
                column: 24
            },
            end: {
                line: 2,
                column: 25
            }
        });
        (0, chai_1.expect)(id.value.chars).to.equal("identityDiv");
        (0, chai_1.expect)(id.value.raw).to.be.equal("\"identityDiv\"");
        (0, chai_1.expect)(id.value.loc).to.deep.equal({
            start: {
                line: 2,
                column: 25
            },
            end: {
                line: 2,
                column: 38
            }
        });
        (0, chai_1.expect)(class_2.type).to.equal("attribute");
        (0, chai_1.expect)(class_2.loc).to.deep.equal({
            start: {
                line: 2,
                column: 39
            },
            end: {
                line: 2,
                column: 54
            }
        });
        (0, chai_1.expect)(class_2.name.chars).to.equal("class");
        (0, chai_1.expect)(class_2.name.raw).to.be.undefined;
        (0, chai_1.expect)(class_2.name.loc).to.deep.equal({
            start: {
                line: 2,
                column: 39
            },
            end: {
                line: 2,
                column: 44
            }
        });
        (0, chai_1.expect)(class_2.equal.chars).to.equal("=");
        (0, chai_1.expect)(class_2.equal.raw).to.be.undefined; // should contains `=` + spaces?
        (0, chai_1.expect)(class_2.equal.loc).to.deep.equal({
            start: {
                line: 2,
                column: 44
            },
            end: {
                line: 2,
                column: 45
            }
        });
        (0, chai_1.expect)(class_2.value.chars).to.equal("goodbye");
        (0, chai_1.expect)(class_2.value.raw).to.be.equal("\"goodbye\"");
        (0, chai_1.expect)(class_2.value.loc).to.deep.equal({
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
    (0, mocha_1.it)("should correctly extract all attributes on multiple lines", function () {
        const { children } = (0, lib_1.default)([
            "<body>",
            "  <div",
            "    class=\"hello\"",
            "    id=\"identityDiv\"",
            "  >",
            "  </div>",
            "</body>"
        ].join("\n"));
        const div = children[0].children[1];
        (0, chai_1.expect)(div.attributes).to.have.lengthOf(2);
        const [_class, id] = div.attributes;
        (0, chai_1.expect)(_class.type).to.equal("attribute");
        (0, chai_1.expect)(_class.name.chars).to.equal("class");
        (0, chai_1.expect)(_class.name.raw).to.be.undefined;
        (0, chai_1.expect)(_class.name.loc).to.deep.equal({
            start: {
                line: 3,
                column: 5
            },
            end: {
                line: 3,
                column: 10
            }
        });
        (0, chai_1.expect)(_class.equal.chars).to.equal("=");
        (0, chai_1.expect)(_class.equal.raw).to.be.undefined; // should contains `=` + spaces?
        (0, chai_1.expect)(_class.equal.loc).to.deep.equal({
            start: {
                line: 3,
                column: 10
            },
            end: {
                line: 3,
                column: 11
            }
        });
        (0, chai_1.expect)(_class.value.chars).to.equal("hello");
        (0, chai_1.expect)(_class.value.raw).to.be.equal("\"hello\"");
        (0, chai_1.expect)(_class.value.loc).to.deep.equal({
            start: {
                line: 3,
                column: 11
            },
            end: {
                line: 3,
                column: 18
            }
        });
        (0, chai_1.expect)(id.type).to.equal("attribute");
        (0, chai_1.expect)(id.name.chars).to.equal("id");
        (0, chai_1.expect)(id.name.raw).to.be.undefined;
        (0, chai_1.expect)(id.name.loc).to.deep.equal({
            start: {
                line: 4,
                column: 5
            },
            end: {
                line: 4,
                column: 7
            }
        });
        (0, chai_1.expect)(id.equal.chars).to.equal("=");
        (0, chai_1.expect)(id.equal.raw).to.be.undefined; // should contains `=` + spaces?
        (0, chai_1.expect)(id.equal.loc).to.deep.equal({
            start: {
                line: 4,
                column: 7
            },
            end: {
                line: 4,
                column: 8
            }
        });
        (0, chai_1.expect)(id.value.chars).to.equal("identityDiv");
        (0, chai_1.expect)(id.value.raw).to.be.equal("\"identityDiv\"");
        (0, chai_1.expect)(id.value.loc).to.deep.equal({
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
    (0, mocha_1.it)("should correctly extract attribute with value on multiline", function () {
        const { children } = (0, lib_1.default)([
            "<body>",
            "  <div",
            "    class=\"hello",
            "      identityDiv\"",
            "  >",
            "  </div>",
            "</body>"
        ].join("\n"));
        const div = children[0].children[1];
        (0, chai_1.expect)(div.attributes).to.have.lengthOf(1);
        const [_class] = div.attributes;
        (0, chai_1.expect)(_class.type).to.equal("attribute");
        (0, chai_1.expect)(_class.loc).to.deep.equal({
            start: {
                line: 3,
                column: 5
            },
            end: {
                line: 4,
                column: 19
            }
        });
        (0, chai_1.expect)(_class.name.chars).to.equal("class");
        (0, chai_1.expect)(_class.name.raw).to.be.undefined;
        (0, chai_1.expect)(_class.name.loc).to.deep.equal({
            start: {
                line: 3,
                column: 5
            },
            end: {
                line: 3,
                column: 10
            }
        });
        (0, chai_1.expect)(_class.equal.chars).to.equal("=");
        (0, chai_1.expect)(_class.equal.raw).to.be.undefined; // should contains `=` + spaces?
        (0, chai_1.expect)(_class.equal.loc).to.deep.equal({
            start: {
                line: 3,
                column: 10
            },
            end: {
                line: 3,
                column: 11
            }
        });
        (0, chai_1.expect)(_class.value.chars).to.equal("hello\n      identityDiv");
        (0, chai_1.expect)(_class.value.raw).to.be.equal("\"hello\n      identityDiv\"");
        (0, chai_1.expect)(_class.value.loc).to.deep.equal({
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
