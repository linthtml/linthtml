// TODO: Remove after node 10 drop
export function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat.apply([], arr);
}
