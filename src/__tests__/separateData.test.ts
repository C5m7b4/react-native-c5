import { separateTestData } from '../testData/data';
import { separateData } from '../utils/separateData';

const colors = ['#89168f'];

describe('separateData', () => {
  test('should separate the data', () => {
    const expectedOutput: any = [
      {
        color: '#89168f',
        data: [
          {
            amount: 1,
            date: 'mon',
            f01: 'groc',
          },
          {
            amount: 1,
            date: 'tue',
            f01: 'groc',
          },
        ],
        gradient: {
          stop1: {
            offset: 0,
            stopColor: '#89168f',
            stopOpacity: 0.3,
          },
          stop2: {
            offset: 1,
            stopColor: '#bb48ff',
            stopOpacity: 0.8,
          },
        },
        label: 'groc',
        useGradient: true,
      },
      {
        color: '#89168f',
        data: [
          {
            amount: 1,
            date: 'mon',
            f01: 'meat',
          },
        ],
        gradient: {
          stop1: {
            offset: 0,
            stopColor: '#89168f',
            stopOpacity: 0.3,
          },
          stop2: {
            offset: 1,
            stopColor: '#bb48ff',
            stopOpacity: 0.8,
          },
        },
        label: 'meat',
        useGradient: true,
      },
    ];

    const separated = separateData(separateTestData, 'f01', colors);
    expect(separated).toEqual(expectedOutput);
  });
});
