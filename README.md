# linthtml [![npm version](http://img.shields.io/npm/v/linthtml.svg?style=flat-square)](https://npmjs.org/package/linthtml) [![license](http://img.shields.io/npm/l/linthtml.svg?style=flat-square)](https://npmjs.org/package/linthtml) [![build status](http://img.shields.io/travis/KamiKillertO/linthtml/master.svg?style=flat-square)](https://travis-ci.org/KamiKillertO/linthtml) [![coveralls](http://img.shields.io/coveralls/KamiKillertO/linthtml.svg?style=flat-square)](https://coveralls.io/r/KamiKillertO/linthtml)

[![stories in ready](https://badge.waffle.io/KamiKillertO/linthtml.svg?label=ready&title=Ready)](http://waffle.io/KamiKillertO/linthtml)
[![dependencies](http://img.shields.io/david/KamiKillertO/linthtml.svg?style=flat-square)](https://david-dm.org/KamiKillertO/linthtml)
[![devDependencies](http://img.shields.io/david/dev/KamiKillertO/linthtml.svg?style=flat-square)](https://david-dm.org/KamiKillertO/linthtml)

> An unofficial html5 linter and validator.

linthtml uses a parser to get the DOM for your html. It then uses the provided rules (and default rules) to lint both the DOM and then individual lines. [Take a look at the supported options](https://github.com/KamiKillertO/linthtml/wiki/Options).

Using linthtml
--------------
If you'd like to run linthtml, we have a few options.

This module doesn't provide any interface on its own. It is highly recommended that
you use one of the following modules to run the linter:
* [`gulp-linthtml`](https://github.com/yvanavermaet/gulp-linthtml): a gulp interface for linthtml
* [`grunt-linthtml`](https://github.com/linthtml/grunt-linthtml): a grunt plugin for linthtml
* [`linthtml-cli`](https://github.com/KamiKillertO/linthtml-cli): a cli interface for linthtml (NOTE: not complete at the moment)

Getting Started with Contributing
---------------

You can use linthtml in Node.JS by using   
```
require('linthtml')  
```
in your code, and doing an install with  
```
npm install linthtml
```
(Remember `--save-dev` if this is just for your development).  

### Now What?

To learn more about the options and usage of linthtml, check out the
[user manual](https://github.com/KamiKillertO/linthtml/wiki/linthtml-manual).
  


[![npm](https://nodei.co/npm/linthtml.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/linthtml)
