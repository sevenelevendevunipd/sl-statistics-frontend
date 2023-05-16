export function groupBy<T, K extends string | number | symbol>(
  elements: T[],
  indexer: (element: T) => K
): Record<K, T[]> {
  return elements.reduce((elems, elem) => {
    const index = indexer(elem);
    elems[index] = [...(elems[index] || []), elem];
    return elems;
  }, {} as Record<K, T[]>);
}

export function chunk<T>(elements: T[], chunkSize: number): T[][] {
  return elements.reduce(
    (accumulator, _, idx) =>
      idx % chunkSize !== 0
        ? accumulator
        : [...accumulator, elements.slice(idx, idx + chunkSize)],
    [] as T[][]
  );
}

export function min<T>(a: T, b: T): T {
  return a <= b ? a : b;
}

export function max<T>(a: T, b: T): T {
  return a >= b ? a : b;
}

export function restrictRange<T>(
  allowedMin: T,
  allowedMax: T,
  currentMin: T,
  currentMax: T
): [T, T] {
  return [
    structuredClone(max(allowedMin, currentMin)),
    structuredClone(min(allowedMax, currentMax)),
  ];
}

export const MAX_DATE = new Date(8640000000000000);
export const MIN_DATE = new Date(-8640000000000000);

export function hashUnitSubUnit(unit: number, subunit: number) {
  return (unit << 4) | subunit;
}

export function splitUnitSubUnitHash(hash: number): [number, number] {
  return [hash >> 4, hash & 0xf];
}

export type ViewModelProps<T> = {
  viewModel: T;
};

export type MaybeViewModelProps<T> = {
  viewModel?: undefined
} | ViewModelProps<T>;