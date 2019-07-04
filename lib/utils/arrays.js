function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

module.exports = {
  flatten
};
