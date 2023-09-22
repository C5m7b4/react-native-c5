import React from 'react';
import { BarChart } from '../charts';
import renderer from 'react-test-renderer';
import { testData } from '../testData/data';

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  const spy = jest.spyOn(rn.Animated, 'createAnimatedComponent');
  spy.mockImplementation(() => jest.fn(() => null));
  return rn;
});

describe('BarChart', () => {
  test('should render properly', () => {
    // @ts-ignore
    global.withAnimatedTimeTravelEnabled(() => {
      const testFn = jest.fn();
      const tree = renderer
        .create(
          <BarChart
            animated={false}
            data={testData}
            x_key="month"
            y_key="value"
            onPressItem={testFn}
          />
        )
        .toJSON();
      // @ts-ignore
      global.timeTravel(2000);
      expect(tree).toMatchSnapshot();
    });
  });
});
