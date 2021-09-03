class CustomError extends Error {
  constructor(code, meta) {
    super("");
    this.code = code;
    this.meta = meta;
  }

  get [Symbol.toStringTag]() {
    return "CustomError";
  }
}

module.exports = CustomError;
