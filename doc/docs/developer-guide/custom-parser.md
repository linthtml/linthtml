---
title:  Writing custom parsers
sidebar_label:  Writing custom parsers
---

If you want to use your own parser and provide additional capabilities for your rules, you can specify your own custom parser.
The parser should expose, as default, a single function that take the source code as the first argument. <!-- , and an optional configuration object as the second argument (provided as parserOptions in a config file). -->
The function should simply return an AST.

⚠️The first node of the tree should have the property `type` with the value `root`.

You can find an LintHTML parser project [here](https://github.com/linthtml/linthtml-pug).

```json
{
    "parser": "./path/to/awesome-custom-parser.js"
}
```

```js
const myParser = require("customParser");
// awesome-custom-parser.js
module.exports = function(code) {
    return myParser(code)
};
```

## The AST specification

```ts
interface Node {
 type: 'tag'|'text'|'directive'|'comment'|'root';
 
 name: string;
 data?: string // only 'text', 'directive' and 'comment' nodes
 attributes?: NodeAttribute[]; // only 'tag' nodes

 parent?: Node;
 previousSibling: Node;
 nextSibling?: Node;

 startIndex: number; 
 endIndex: number; 
 openIndex: number;
 closeIndex: number;
 
 children: Node[];
 
 loc: Position;
 open: CharValue;
 close: CharValue; 
}

interface CharValue {
 chars: string; // tag name, attribute name or attribute value without `<, >, ', ", \s, \t` chars
 raw?: string; // Same as `chars` but with `<, >, ', ",` chars
 loc: Position;
}

interface NodeAttribute {
 type: string;
 name: CharValue;
 value: CharValue;
 equal: CharValue;
 loc: Position;
}

interface Position {
 start: Range;
 end: Range;
}

interface Range {
 line: number;
 column: number;
}
```
