import React from 'react';
import { BoxPlot } from '../charts';
import renderer from 'react-test-renderer';
import { boxData } from '../testData/data';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { quartile, IQR } from '../helpers';

describe('BoxPlot', () => {
  test('should render correctly', () => {
    const tree = renderer
      .create(<BoxPlot data={boxData} x_key="datename" y_key="voids" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle a click', () => {
    const testFn = jest.fn();
    render(
      <BoxPlot onPress={testFn} data={boxData} x_key="datename" y_key="voids" />
    );

    fireEvent.press(screen.getByTestId('box-0'));
    expect(screen).toMatchSnapshot();
  });
  test('should handle click with no handler', () => {
    const xRenderer = (e: any) => {
      return e;
    };
    const yRenderer = (e: any) => {
      return e;
    };
    render(
      <BoxPlot
        data={boxData}
        x_key="datename"
        y_key="voids"
        x_axis_config={{
          rotation: -45,
        }}
        y_axis_config={{
          rotation: -45,
        }}
        x_label_renderer={xRenderer}
        y_label_renderer={yRenderer}
      />
    );

    fireEvent.press(screen.getByTestId('box-0'));
    expect(screen).toMatchSnapshot();
  });
  test('should handle a predicate function', () => {
    const unique = (d: any[]) => {
      const x_key = 'cashier';
      const newArray: number[] = [];
      d.forEach((r) => {
        if (!newArray.includes(r[x_key])) {
          if (typeof r[x_key] !== 'undefined' && r[x_key] != null) {
            newArray.push(r[x_key]);
          }
        }
      });
      return newArray;
    };

    const count = (data: any[], key: number) =>
      data.filter((c) => c.cashier === key);

    const transactions = (data: any) => {
      const newArray: number[] = [];
      const uniques = unique(data);
      uniques.map((c) => {
        newArray.push(count(data, c).length);
      });
      return newArray;
    };

    const predicate = (data: any) => {
      const uniques = unique(data);
      const transCounts = transactions(data);
      const results: any[] = [];
      const q3 = quartile(transCounts, 0.75);
      const iqr = IQR(transCounts);
      uniques.map((c) => {
        const cnt = count(data, c);
        if (cnt.length > q3 + 1.5 * iqr) {
          results.push({ cashier: c, cnt: cnt.length });
        }
      });
      return results;
    };

    const tree = renderer
      .create(
        <BoxPlot
          predicate={predicate}
          data={boxData}
          x_key="datename"
          y_key="voids"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle no gradient box', () => {
    const tree = renderer
      .create(
        <BoxPlot
          useBarGradient={false}
          data={boxData}
          x_key="datename"
          y_key="voids"
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle custom gradient', () => {
    const tree = renderer
      .create(
        <BoxPlot
          data={boxData}
          x_key="datename"
          y_key="voids"
          bar_gradient_config={{
            x2: 10,
            stop1: {
              stopOpacity: 0.2,
            },
            stop2: {
              stopOpacity: 0.7,
            },
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle another custom gradient', () => {
    const tree = renderer
      .create(
        <BoxPlot
          data={boxData}
          x_key="datename"
          y_key="voids"
          bar_gradient_config={{
            x1: 10,
            stop1: {
              stopColor: 'red',
            },
            stop2: {
              stopColor: 'blue',
            },
          }}
          x_axis_config={{
            fontSize: 13,
          }}
          y_axis_config={{
            fontSize: 13,
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle predicate gradient config', () => {
    const unique = (d: any[]) => {
      const x_key = 'cashier';
      const newArray: number[] = [];
      d.forEach((r) => {
        if (!newArray.includes(r[x_key])) {
          if (typeof r[x_key] !== 'undefined' && r[x_key] != null) {
            newArray.push(r[x_key]);
          }
        }
      });
      return newArray;
    };

    const count = (data: any[], key: number) =>
      data.filter((c) => c.cashier === key);

    const transactions = (data: any) => {
      const newArray: number[] = [];
      const uniques = unique(data);
      uniques.map((c) => {
        newArray.push(count(data, c).length);
      });
      return newArray;
    };

    const predicate = (data: any) => {
      const uniques = unique(data);
      const transCounts = transactions(data);
      const results: any[] = [];
      const q3 = quartile(transCounts, 0.75);
      const iqr = IQR(transCounts);
      uniques.map((c) => {
        const cnt = count(data, c);
        if (cnt.length > q3 + 1.5 * iqr) {
          results.push({ cashier: c, cnt: cnt.length });
        }
      });
      return results;
    };

    const tree = renderer
      .create(
        <BoxPlot
          predicate={predicate}
          data={boxData}
          x_key="datename"
          y_key="voids"
          predicate_gradient_config={{
            x1: 10,
            stop1: {
              stopOpacity: 0.4,
            },
            stop2: {
              stopOpacity: 0.6,
            },
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle another predicate gradient config', () => {
    const unique = (d: any[]) => {
      const x_key = 'cashier';
      const newArray: number[] = [];
      d.forEach((r) => {
        if (!newArray.includes(r[x_key])) {
          if (typeof r[x_key] !== 'undefined' && r[x_key] != null) {
            newArray.push(r[x_key]);
          }
        }
      });
      return newArray;
    };

    const count = (data: any[], key: number) =>
      data.filter((c) => c.cashier === key);

    const transactions = (data: any) => {
      const newArray: number[] = [];
      const uniques = unique(data);
      uniques.map((c) => {
        newArray.push(count(data, c).length);
      });
      return newArray;
    };

    const predicate = (data: any) => {
      const uniques = unique(data);
      const transCounts = transactions(data);
      const results: any[] = [];
      const q3 = quartile(transCounts, 0.75);
      const iqr = IQR(transCounts);
      uniques.map((c) => {
        const cnt = count(data, c);
        if (cnt.length > q3 + 1.5 * iqr) {
          results.push({ cashier: c, cnt: cnt.length });
        }
      });
      return results;
    };

    const tree = renderer
      .create(
        <BoxPlot
          predicate={predicate}
          data={boxData}
          x_key="datename"
          y_key="voids"
          predicate_gradient_config={{
            x2: 10,
            stop1: {
              stopColor: 'red',
            },
            stop2: {
              stopColor: 'blue',
            },
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle outlier_config', () => {
    const tree = renderer
      .create(
        <BoxPlot
          data={boxData}
          x_key="datename"
          y_key="voids"
          outlier_config={{
            radius: 6,
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle another outlier_config', () => {
    const tree = renderer
      .create(
        <BoxPlot
          data={boxData}
          x_key="datename"
          y_key="voids"
          outlier_config={{
            opacity: 0.5,
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render vertical lines', () => {
    const tree = renderer
      .create(
        <BoxPlot
          data={boxData}
          x_key="datename"
          y_key="voids"
          showVerticalLines={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
