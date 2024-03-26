/* 
 This file is not used directly in tests but it's mandatory to order to mock import with jest
 */
module.exports = function (html) {
  throw new Error(`Custom parser used for "${html}"`);
};
