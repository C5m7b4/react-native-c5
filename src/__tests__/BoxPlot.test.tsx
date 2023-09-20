import React from 'react';
import { BoxPlot } from '../charts';
import renderer from 'react-test-renderer';
import { boxData } from '../testData/data';

describe('BoxPlot', () => {
  test('should render correctly', () => {
    const tree = renderer
      .create(<BoxPlot data={boxData} x_key="datename" y_key="voids" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
