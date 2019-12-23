/**
 * 'Shreds' the html by line for linting by line.
 * @param {String} html - your html.
 * @returns {String[]} the array of line objects.
 */
module.exports = function(html) {
  let match;
  let line = 1;
  const shredded = [];
  const regex = /.*(\r\n|\r|\n)/gm;
  let regexIndex = 0;
  while ((match = regex.exec(html)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    regexIndex = regex.lastIndex;
    shredded.push({
      line: line++,
      index: match.index,
      text: html.substring(regex.lastIndex, match.index)
    });
  }
  if (regexIndex < html.length) {
    shredded.push({
      line,
      index: regexIndex,
      text: html.substring(regexIndex)
    });
  }
  // Take the HTML string
  // Return an array of {line, line number, index}
  return shredded;
};
