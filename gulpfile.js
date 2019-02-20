/* eslint-env node */
const gulp = require('gulp');
const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const publish = require('gulp-gh-pages');
const plato = require('plato');
const jsdoc = require('gulp-jsdoc');

const { series, parallel }= gulp;

let paths = {
    src: ['./lib/**/*.js'],
    testUnit: './test/unit/*.js',
    testFunc: './test/functional/*.js',
    site: ['./site/**/*']
};
paths.test = [].concat(paths.testUnit, paths.testFunc);

function lint() {
  return gulp.src([
      paths.src,
      paths.test,
      './gulpfile.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
}
lint.description = "Lints javascript files with eslint";
exports.lint = lint;

function istanbulAnalysis() {
  return gulp.src(paths.src)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
}
istanbulAnalysis.description = "Instruments js source code for coverage reporting";
exports.istanbul = istanbulAnalysis;

function unitTest() {
  global.chai = require('chai');
  global.chai.use(require('chai-as-promised'));
  global.expect = global.chai.expect;

  return gulp.src(paths.test, { read:false })
    .pipe(mocha({
        reporter: 'list'
    }))
    .pipe(istanbul.writeReports())
}
unitTest.description = "Run unit tests using mocha+chai";
exports["tests:unit"] = unitTest;

const tests = series(istanbulAnalysis, unitTest);
exports.tests = tests;

function platoAnalysis() {
  return gulp.src(paths.src)
    .pipe(plato('report', {}));
}
platoAnalysis.description = "Generate a plato report";
exports.plato = platoAnalysis;

// jsdoc generation
function genJSDoc() {
  return gulp.src([paths.src, 'README.md'])
    .pipe(jsdoc.parser({
      plugins: [
        'plugins/escapeHtml',
        'plugins/markdown'
      ],
      markdown: {
        parser: 'gfm',
        githubRepoOwner: 'linthtml',
        githubRepoName: 'linthtml'
      }
    }))
    .pipe(jsdoc.generator('./site/api', {
      // template
      path: 'ink-docstrap',
      theme: 'cerulean',
      systemName: 'linthtml',
      navType: 'vertical',
      linenums: true,
      inverseNav: true,
      outputSourceFiles: true
    }));
};

genJSDoc.description = "Generate code doc using jsdoc";
exports['docs:generate'] = genJSDoc;
exports['docs:publich'] = series(genJSDoc, function () {
  return gulp.src(paths.site)
    .pipe(publish({
        cacheDir: '.tmp'
    }));
});

// runs on travis ci (lints, tests, and uploads to coveralls)
exports.travis = series(parallel(lint, tests), function () {
  return gulp.src('coverage/**/lcov.info')
      .pipe(coveralls());
});

exports.default = parallel(lint, tests);
