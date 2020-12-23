/* eslint-env node */

const gulp = require("gulp");
const mocha = require("gulp-mocha");

const paths = {
  src: "./lib/**/*.js",
  tests: ["./test/**/*.js", "./lib/rules/**/__tests__/*.js"]
};

function tests() {
  return gulp.src(paths.tests, { read: false })
    .pipe(mocha({ bail: true }));
}
tests.description = "Run unit tests using mocha+chai";
exports.tests = tests;

exports.default = tests;
