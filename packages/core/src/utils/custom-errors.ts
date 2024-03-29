export default class CustomError extends Error {
  // TODO: Convert to keyof error messages
  constructor(
    public code: string,
    public meta: unknown
  ) {
    super("");
    this.code = code;
    this.meta = meta;
  }

  get [Symbol.toStringTag]() {
    return "CustomError";
  }
}
