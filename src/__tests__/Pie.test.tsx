import React from 'react';
import renderer from 'react-test-renderer';
import PieChart from '../charts/PieChart';

const pieData = [
  { value: 50, label: 'Groc' },
  {
    value: 10,
    label: 'Meat',
  },
];

describe('PieChart', () => {
  test('should render correctly', () => {
    const tree = renderer
      .create(<PieChart data={pieData} value="value" label="label" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
