import {
  asc,
  desc,
  sum,
  max,
  min,
  range,
  mean,
  median,
  quartile,
  IQR,
  Outliers,
  maxWithoutOutliers,
  minWithoutOutliers,
  unique,
} from '../helpers';

const arr = [15, 9, 5, 2, 25, 10, 4, 0];

describe('asc', () => {
  test('should sort ascending', () => {
    expect(asc(arr)).toEqual([0, 2, 4, 5, 9, 10, 15, 25]);
  });
});

describe('desc', () => {
  test('should sort descending', () => {
    expect(desc(arr)).toEqual([25, 15, 10, 9, 5, 4, 2, 0]);
    const arr2 = [0, 2, 2, 9, 6];
    expect(desc(arr2)).toEqual([9, 6, 2, 2, 0]);
  });
});

describe('sum', () => {
  test('should sum all number', () => {
    expect(sum(arr)).toEqual(70);
  });
});

describe('max', () => {
  test('should return the highest number', () => {
    expect(max(arr)).toEqual(25);
  });
});

describe('min', () => {
  test('should return the smallest number', () => {
    expect(min(arr)).toEqual(0);
    const arr1 = [1, 3, 5];
    expect(min(arr1)).toEqual(1);
  });
});

describe('range', () => {
  test('should return the difference between the max - min', () => {
    expect(range(arr)).toEqual(25);
  });
});

describe('mean', () => {
  test('should return the average of the array', () => {
    expect(mean(arr)).toEqual(8.75);
  });
});

describe('median', () => {
  test('should return the median', () => {
    expect(median(arr)).toEqual(7);
    const arr2 = [4, 8, 9, 10, 14];
    expect(median(arr2)).toEqual(9);
  });
});

describe('quartile', () => {
  test('should return the proper quartile', () => {
    expect(quartile(arr, 0.25)).toEqual(3);
    expect(quartile(arr, 0.75)).toEqual(12.5);
    const arr2 = [2, 4, 7, 9, 10, 15, 20];
    expect(quartile(arr2, 0.25)).toEqual(4);
    expect(quartile(arr2, 0.75)).toEqual(15);
    const arr3 = [1];
    expect(quartile(arr3, 0.25)).toEqual(1);
  });
});

describe('IQR', () => {
  test('should return the proper iqr', () => {
    expect(IQR(arr)).toEqual(9.5);
    const arr2 = [2, 4, 7, 9, 10, 15, 20];
    expect(IQR(arr2)).toEqual(11);
  });
});

describe('Outliers', () => {
  test('should return the outliers', () => {
    const arr3 = [1, 49, 50, 55, 56, 57, 58, 99];
    expect(Outliers(arr3)).toEqual([1, 99]);
  });
});

describe('maxWithoutOutliers', () => {
  test('should return the highest value that is not an outlier', () => {
    const arr3 = [1, 49, 50, 55, 56, 57, 58, 101, 99, 0];
    expect(maxWithoutOutliers(arr3)).toEqual(58);
    const arr4 = [100, 0, 5, 8];
    expect(maxWithoutOutliers(arr4)).toEqual(100);
  });
});

describe('minWithoutOutliers', () => {
  test('should return the lowest value that is not an outlier', () => {
    const arr3 = [1, 49, 50, 55, 56, 57, 58, 101, 99];
    expect(minWithoutOutliers(arr3)).toEqual(49);
  });
});

describe('unique', () => {
  test('should only return unique values', () => {
    const arr4 = [1, 1, 2, 4, 4, 5, 4, 7, 8];
    const uniques = unique(arr4);
    expect(unique(uniques)).toEqual(['1', '2', '4', '5', '7', '8']);
  });
});
