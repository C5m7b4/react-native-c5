import React from 'react';
import renderer from 'react-test-renderer';
import MultiLine from '../charts/MultiLine';
import { promarData } from '../testData/data';
import { separateData } from '../utils/separateData';
import { render, screen, fireEvent } from '@testing-library/react-native';

const colors = [
  '#284B63',
  '#3C6E71',
  '#F25C54',
  '#511C29',
  '#2cf6b3',
  '#87255b',
  '#DACC3E',
];

describe('MultiLine', () => {
  test('should render correctly', () => {
    const separated = separateData(promarData, 'f01', colors);
    const tree = renderer
      .create(
        <MultiLine
          curve={false}
          animated={true}
          data={separated}
          lineGradient={false}
          x_key="datename"
          y_key="margin"
          legend={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render with gradients', () => {
    const separated = separateData(promarData, 'f01', colors);
    const tree = renderer
      .create(
        <MultiLine
          curve={false}
          animated={true}
          data={separated}
          lineGradient={true}
          x_key="datename"
          y_key="margin"
          legend={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render with a curve', () => {
    const separated = separateData(promarData, 'f01', colors);
    const xRenderer = (e: any) => {
      return e;
    };
    const yRenderer = (e: any) => {
      return e;
    };
    const tree = renderer
      .create(
        <MultiLine
          curve={true}
          animated={true}
          data={separated}
          lineGradient={true}
          x_key="datename"
          y_key="margin"
          legend={true}
          x_label_renderer={xRenderer}
          y_label_renderer={yRenderer}
          x_axis_config={{
            rotation: -45,
          }}
          y_axis_config={{
            rotation: -45,
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should render with minimum props', () => {
    const separated = separateData(promarData, 'f01', colors);
    const tree = renderer
      .create(<MultiLine data={separated} x_key="datename" y_key="margin" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should handle circle legend click', () => {
    const separated = separateData(promarData, 'f01', colors);
    render(
      <MultiLine
        lineGradient={true}
        data={separated}
        legend={true}
        x_key="datename"
        y_key="margin"
      />
    );

    fireEvent.press(screen.getByTestId('leg-circle-0'));
    expect(screen).toMatchSnapshot();
  });
  test('should handle text legend click', () => {
    const separated = separateData(promarData, 'f01', colors);
    render(
      <MultiLine
        lineGradient={true}
        data={separated}
        legend={true}
        x_key="datename"
        y_key="margin"
      />
    );

    fireEvent.press(screen.getByTestId('leg-text-0'));
    expect(screen).toMatchSnapshot();
  });
});
