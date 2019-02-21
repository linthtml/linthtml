# lintHTML

[![npm version](http://img.shields.io/npm/v/lintHTML.svg?style=flat-square)](https://npmjs.org/package/lintHTML)
[![license](http://img.shields.io/npm/l/lintHTML.svg?style=flat-square)](https://npmjs.org/package/lintHTML)
[![build status](http://img.shields.io/travis/KamiKillertO/lintHTML/master.svg?style=flat-square)](https://travis-ci.org/KamiKillertO/lintHTML) [![coveralls](http://img.shields.io/coveralls/KamiKillertO/lintHTML.svg?style=flat-square)](https://coveralls.io/r/KamiKillertO/lintHTML)
[![dependencies](http://img.shields.io/david/KamiKillertO/lintHTML.svg?style=flat-square)](https://david-dm.org/KamiKillertO/lintHTML)
[![devDependencies](http://img.shields.io/david/dev/KamiKillertO/lintHTML.svg?style=flat-square)](https://david-dm.org/KamiKillertO/lintHTML)
[![npm](https://nodei.co/npm/lintHTML.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/lintHTML)

> An unofficial html5 linter and validator.

lintHTML uses a parser to get the DOM for your html. It then uses the provided rules (and default rules) to lint both the DOM and then individual lines. [Take a look at the supported options](https://github.com/KamiKillertO/lintHTML/wiki/Options).

## Using lintHTML

If you'd like to run lintHTML, we have a few options.

This module doesn't provide any interface on its own. It is highly recommended that
you use one of the following modules to run the linter:

* [`gulp-lintHTML`](https://github.com/yvanavermaet/gulp-lintHTML): a gulp interface for lintHTML
* [`grunt-lintHTML`](https://github.com/lintHTML/grunt-lintHTML): a grunt plugin for lintHTML
* [`lintHTML-cli`](https://github.com/KamiKillertO/lintHTML-cli): a cli interface for lintHTML (NOTE: not complete at the moment)

## Getting Started with Contributing

You can use lintHTML in Node.JS by using

```js
require('lintHTML')  
```

in your code, and doing an install with  

```shell
npm install lintHTML
```

(Remember `--save-dev` if this is just for your development).  

### Now What

To learn more about the options and usage of lintHTML, check out the
[user manual](https://github.com/KamiKillertO/lintHTML/wiki/lintHTML-manual).
