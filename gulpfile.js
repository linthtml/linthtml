/* eslint-env node */

const gulp = require('gulp');
// const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const publish = require('gulp-gh-pages');
const jsdoc = require('gulp-jsdoc3');
// const cp = require('child_process');

const { series, parallel }= gulp;

let paths = {
    src: './lib/**/*.js',
    tests: ['./test/**/*.js', './lib/rules/**/__tests__/*.js'],
    site: './site/**/*'
};

function lint() {
  return gulp.src([
      paths.src,
      paths.tests,
      './gulpfile.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}
lint.description = "Lints javascript files with eslint";
exports.lint = lint;

function tests() {
  return gulp.src(paths.tests, { read:false })
    .pipe(mocha());
}
tests.description = "Run unit tests using mocha+chai";
exports.tests = tests;

// jsdoc generation
function genJSDoc(cb) {
  const config = require('./jsdoc.json');
  return gulp.src([paths.src, 'README.md'], { read: false })
    .pipe(jsdoc(config, cb));
}

genJSDoc.description = "Generate code doc using jsdoc";
exports['docs:generate'] = genJSDoc;
exports['docs:publich'] = series(genJSDoc, function () {
  return gulp.src(paths.site)
    .pipe(publish({
        cacheDir: '.tmp'
    }));
});

// function coverage() {
//   return cp.execFile('npm run coverage');
// }

// // runs on travis ci (lints, tests, and uploads to coveralls)
// exports.travis = series(parallel(lint, coverage), function () {
//   return gulp.src('coverage/lcov.info')
//       .pipe(coveralls());
// });

exports.default = parallel(lint, tests);
