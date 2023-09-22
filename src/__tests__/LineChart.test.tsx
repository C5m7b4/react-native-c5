import React from 'react';
import { LineChart } from '../charts';
import renderer from 'react-test-renderer';
import { testData } from '../testData/data';
import { render, screen, fireEvent } from '@testing-library/react-native';

const xRenderer = (e: any) => {
  return 1;
};
const yRenderer = (e: any) => {
  return 1;
};

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
  test('should handle click', () => {
    const testFn = jest.fn();
    render(
      <LineChart
        height={300}
        width={200}
        data={testData}
        onPressItem={testFn}
        x_key="month"
        y_key="value"
        tooltip_config={{
          fontWeight: '400',
        }}
      />
    );

    fireEvent.press(screen.getByTestId('circle-0'));

    expect(screen).toMatchSnapshot();
  });
  test('should handle rect click', () => {
    const testFn = jest.fn();
    render(
      <LineChart
        height={300}
        width={200}
        data={testData}
        onPressItem={testFn}
        x_key="month"
        y_key="value"
        tooltip_config={{
          fontWeight: '400',
        }}
      />
    );

    fireEvent.press(screen.getByTestId('rect-0'));

    expect(screen).toMatchSnapshot();
  });
  test('should handle renderers', () => {
    render(
      <LineChart
        height={300}
        width={200}
        data={testData}
        x_key="month"
        y_key="value"
        tooltip_config={{
          fontWeight: '400',
        }}
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
    expect(screen).toMatchSnapshot();
  });
  test('should handle axis configs', () => {
    render(
      <LineChart
        height={300}
        width={200}
        margin={50}
        data={testData}
        x_key="month"
        y_key="value"
        x_axis_config={{
          fontSize: 10,
        }}
        y_axis_config={{
          fontSize: 10,
        }}
        x_label_renderer={xRenderer}
        y_label_renderer={yRenderer}
      />
    );
    expect(screen).toMatchSnapshot();
  });
  test('should handle custom props', () => {
    render(
      <LineChart
        height={300}
        width={200}
        margin={50}
        data={testData}
        x_key="month"
        y_key="value"
        axisColor="red"
      />
    );
    expect(screen).toMatchSnapshot();
  });
});
