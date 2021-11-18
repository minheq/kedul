import { sortBy } from 'lodash';

export const filterAsync = async <TArrayItem = any>(
  arr: TArrayItem[],
  predicate: (value: TArrayItem) => Promise<boolean>,
): Promise<TArrayItem[]> => {
  const fail = Symbol();

  const items = await Promise.all(
    arr.map(async item => ((await predicate(item)) ? item : fail)),
  );

  return items.filter(i => i !== fail) as TArrayItem[];
};

export const sortByArray = <TArrayItem extends object | string | number = any>(
  arr: TArrayItem[],
  sortedArr: string[] | number[],
  predicate?: (value: TArrayItem) => string,
): TArrayItem[] => {
  // @ts-ignore
  return sortBy(arr, item => {
    // @ts-ignore
    if (typeof item === 'string') return sortedArr.indexOf(item);
    // @ts-ignore
    if (typeof item === 'number') return sortedArr.indexOf(item);

    if (!predicate) throw new Error('Predicate required');

    // @ts-ignore
    return sortedArr.indexOf(predicate(item));
  });
};
