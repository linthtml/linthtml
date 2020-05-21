/* eslint-env node */

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const mocha = require("gulp-mocha");

const { parallel } = gulp;

const paths = {
  src: "./lib/**/*.js",
  tests: ["./test/**/*.js", "./lib/rules/**/__tests__/*.js"],
  site: "./site/**/*"
};

function lint() {
  return gulp.src([
    paths.src,
    ...paths.tests,
    "./gulpfile.js"
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}
lint.description = "Lints javascript files with eslint";
exports.lint = lint;

function tests() {
  return gulp.src(paths.tests, { read: false })
    .pipe(mocha({ bail: true }));
}
tests.description = "Run unit tests using mocha+chai";
exports.tests = tests;

exports.default = parallel(lint, tests);
