class CustomError extends Error {
  constructor(code, meta) {
    super("");
    this.code = code;
    this.meta = meta;
  }
}

module.exports = CustomError;
