#!/usr/bin/env node

var repl = require('repl');
var ctx = repl.start('>> ').context;

var linthtml = require('./');

// export stuff to use in the repl
ctx.linthtml = linthtml;

ctx.lint = function () {
    var promise = ctx.linthtml.apply(ctx.linthtml, arguments);

    function handler(result) {
        ctx['_'] = result;

        console.log(result);
        console.log('You can access the results in the "_" obj');
    }

    promise.then(handler, handler);
};


var parser = ctx.linthtml.defaultLinter.parser;
ctx.parse = parser.parse.bind(parser);
