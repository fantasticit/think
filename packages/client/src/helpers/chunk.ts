export function chunk<T>(arr: Array<T>, size = 1) {
  const res: Array<T[]> = [];

  for (let i = 0; i < arr.length; i += size) {
    const slice = arr.slice(i, i + size);
    res.push(slice);
  }

  return res;
}
