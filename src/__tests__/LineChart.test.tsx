import React from 'react';
import { LineChart } from '../charts';
import renderer from 'react-test-renderer';
import { testData } from '../testData/data';

describe('BasicChart', () => {
  test('should render correctly', () => {
    const tree = renderer
      .create(<LineChart data={testData} x_key="month" y_key="value" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render with height and width', () => {
    const tree = renderer
      .create(
        <LineChart
          height={300}
          width={200}
          data={testData}
          x_key="month"
          y_key="value"
          tooltip_config={{
            fontWeight: '400',
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should handle onPressItem', () => {
    const tree = renderer
      .create(
        <LineChart
          height={300}
          width={200}
          data={testData}
          x_key="month"
          y_key="value"
          showTooltips={true}
          curve={true}
          showHorizontalLines={true}
          showVerticalLines={true}
          tooltip_config={{
            tooltipHeight: 25,
            tooltipWidth: 30,
            tooltipFill: '#000',
            fontSize: 13,
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render without curve', () => {
    const tree = renderer
      .create(
        <LineChart
          height={300}
          width={200}
          data={testData}
          x_key="month"
          y_key="value"
          curve={false}
          showTooltips={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
