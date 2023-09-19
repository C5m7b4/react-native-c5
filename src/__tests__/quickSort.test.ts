import { quickSort } from '../utils';

describe('quicksort', () => {
  test('should order numbers ascending', () => {
    const arr = [20, 5, 1, 15, 21, 6, 4];
    expect(quickSort(arr)).toEqual([1, 4, 5, 6, 15, 20, 21]);
  });
});
