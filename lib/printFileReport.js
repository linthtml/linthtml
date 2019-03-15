/* eslint-disable no-console */
const chalk = require('chalk');
const linthtml = require('./index');

module.exports = function printFileReport(report) {
  // const availableWidth = process.stdout.columns < 80 ? 80 : process.stdout.columns; // find away to divide term in a grid to avoid line breaks

  console.log(chalk`{underline ${report.fileName}}`);
  const maxLine = report.issues.reduce((max, cv) => Math.max(max, cv.line), -1).toString().length;
  const maxColumn = report.issues.reduce((max, cv) => Math.max(max, cv.column), -1).toString().length;

  // debugger
  report.issues.forEach(function (issue) {
    const line = issue.line.toString();
    const column = issue.column.toString();
    const space = "  ";
    const msg = linthtml.messages.renderIssue(issue);
    console.log(chalk `  {gray ${line.padStart(maxLine, " ")}:${column.padEnd(maxColumn, " ")}}${space}{red error}${space}{white ${msg}}${space}{gray ${issue.rule}}`);
  });
  console.log();
};
/* eslint-enaable no-console */
