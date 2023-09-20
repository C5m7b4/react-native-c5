import React from 'react';
import { BarChart } from '../charts';
import renderer from 'react-test-renderer';
import { testData } from '../testData/data';

describe('BarChart', () => {
  test('should render properly', () => {
    const tree = renderer
      .create(<BarChart data={testData} x_key="month" y_key="value" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
