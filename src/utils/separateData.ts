import { newShade } from './newShade';
import { MultiLineData } from '../interfaces';

export function getRandomValueFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const unique = <T>(arr: T[], field: keyof T) => {
  const newArray: string[] = [];
  arr.forEach((r: T) => {
    if (!newArray.includes(r[field] as string)) {
      newArray.push(r[field] as string);
    }
  });
  return newArray;
};

export const separateData = <T>(arr: T[], field: keyof T, targetArray: any) => {
  const newArray: MultiLineData<T>[] = [];
  const uniqueValues = unique(arr, 'f01' as keyof T);
  uniqueValues.forEach((r: string, i: number) => {
    const tmpArr = arr.filter((v) => v[field] === r);
    let color =
      targetArray.length > i - 1 ? targetArray[i - 1] : targetArray[0];
    if (!color) {
      color = targetArray[0];
    }
    newArray.push({
      label: r,
      color: color as string,
      useGradient: true,
      gradient: {
        stop1: {
          offset: 0,
          stopColor: color as string,
          stopOpacity: 0.3,
        },
        stop2: {
          offset: 1,
          stopColor: newShade(color as string, 50) as string,
          stopOpacity: 0.8,
        },
      },
      data: tmpArr,
    });
  });
  return newArray;
};
