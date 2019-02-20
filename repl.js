#!/usr/bin/env node

var repl = require('repl');
var ctx = repl.start('>> ').context;

var lintHTML = require('./');

// export stuff to use in the repl
ctx.lintHTML = lintHTML;

ctx.lint = function () {
    var promise = ctx.lintHTML.apply(ctx.lintHTML, arguments);

    function handler(result) {
        ctx['_'] = result;

        console.log(result);
        console.log('You can access the results in the "_" obj');
    }

    promise.then(handler, handler);
};


var parser = ctx.lintHTML.defaultLinter.parser;
ctx.parse = parser.parse.bind(parser);
