const asc = (data: number[]): number[] => data.sort((a, b) => a - b);

const desc = (data: number[]): number[] =>
  data.sort((a, b) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
    return 0;
  });

const sum = (data: number[]): number => data.reduce((a, c) => a + c, 0);

const max = (data: number[]): number =>
  data.reduce((a, c) => (a > c ? a : c), 0);

const min = (data: number[]): number =>
  data.reduce((a, c) => (a < c ? a : c), 99999999);

const range = (data: number[]): number => max(data) - min(data);

const mean = (data: number[]): number => {
  return sum(data) / data.length;
};

const median = (data: number[]): number => {
  const sorted = asc([...data]);
  const half = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[half]!
    : (sorted[half - 1]! + sorted[half]!) / 2;
};

const quartile = (data: number[], percent: number): number => {
  const sorted = asc([...data]);
  let pos = (sorted.length - 1) * percent;
  if (pos % 1 === 0) {
    return sorted[pos]!;
  }

  pos = percent > 0.5 ? Math.ceil(pos) : Math.floor(pos);
  if (percent <= 0.5) {
    if (sorted[pos + 1] !== undefined && sorted.length % 2 === 0) {
      return (sorted[pos]! + sorted[pos + 1]!) / 2;
    }
  } else {
    if (sorted[pos + 1] !== undefined && sorted.length % 2 === 0) {
      return (sorted[pos - 1]! + sorted[pos]!) / 2;
    }
  }

  return sorted[pos]!;
};

const IQR = (data: number[]): number => {
  return quartile(data, 0.75) - quartile(data, 0.25);
};

const Outliers = (data: number[]): number[] => {
  const iqr = IQR(data);
  const maxValueToQualify = quartile(data, 0.75) + 1.5 * iqr;
  const minValueToQualify = quartile(data, 0.25) - 1.5 * iqr;
  const newArray: number[] = [];
  data.map((v) =>
    v > maxValueToQualify || v < minValueToQualify ? newArray.push(v) : null
  );
  return newArray;
};

const maxWithoutOutliers = (data: number[]): number => {
  const outliers = Outliers(data);
  return data.reduce((a, c) => {
    return outliers.includes(c) ? a : a > c ? a : c;
  }, 0);
};

const minWithoutOutliers = (data: number[]): number => {
  const outliers = Outliers(data);
  return data.reduce((a, c) => {
    return outliers.includes(c) ? a : a < c ? a : c;
  }, 999999);
};

const unique = (data: number[] | string[]): string[] => {
  const newArray: string[] = [];
  data.forEach((v) => {
    if (!newArray.includes(v as string) && v !== undefined && v !== null) {
      v = v.toString();
      newArray.push(v);
    }
  });
  return newArray;
};

export {
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
};
