import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { PieProps } from '../../interfaces';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PieChart = <T,>(props: PieProps<T>) => {
  const {
    data = [],
    label,
    value,
    height: containerHeight = 300,
    width: containerWidth = SCREEN_WIDTH - 50,
    fontSize = 12,
    textColor = '#000',
    pieBackgroundColor = 'transparent',
    chartBackgroundColor = 'transparent',
    useDonut = true,
    donutRadius = containerHeight / 6,
    donutColor = '#fff',
    tickColor = '#000',
    tickTextColor = '#000',
    colors = [
      '#fcba03',
      '#27a34c',
      '#36b3c9',
      '#3f27b8',
      '#a937cc',
      '#c71e61',
      '#478713',
      '#6b83bf',
    ],
  } = props;
  const padding = 25;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  let radius = centerY - padding - 10;
  const smallerRadius = radius / 2;
  const circumference = 2 * Math.PI * smallerRadius;

  const getPiePercent = (percent: number) => {
    const result = (percent * circumference) / 100;
    // const radians = (percent * (2 * Math.PI)) / 360;
    // const degrees = (radians * 360) / (2 * Math.PI);
    // const lineAngle = 360 / (100 / percent);

    return result;
  };

  const calculateLineAngle = (i: number) => {
    if (i === 0) {
      return -90;
    }

    const copy = [...data];
    copy.splice(copy.length - i);

    const result = copy.reduce(
      (acc, cur) => acc + parseInt(cur[value] as string, 10),
      0
    );
    return -90 + 360 / (100 / result);
  };

  const renderCircle = (c: T, i: number) => {
    let lineAngle = calculateLineAngle(i);
    const percent = getPiePercent(c[value] as number);
    return (
      <G key={`circles-container-${i}`}>
        <Circle
          key={`c-${i}`}
          cx={centerX}
          cy={centerY}
          r={smallerRadius}
          fill={'transparent'}
          stroke={colors[i]}
          strokeWidth={radius}
          transform={`rotate(${lineAngle} ${centerX} ${centerY})`}
          strokeDasharray={`${percent} ${circumference}`}
        />
      </G>
    );
  };

  const render_circles = () => {
    return (
      <G>
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          strokeWidth={1}
          stroke={'#000'}
          fill={pieBackgroundColor}
        />
        {data.map((c, i) => renderCircle(c, i))}
      </G>
    );
  };

  const render_text = () => {
    return data.map((c, i) => {
      let lineAngle = calculateLineAngle(i);
      const percent = getPiePercent(c[value] as number);
      const fs = fontSize / 4;
      const textRotation = lineAngle + percent / 2 - fs;

      return (
        <G key={`text-${i}`}>
          <SvgText
            x={centerX + smallerRadius}
            y={centerY + fontSize / 2}
            fontSize={fontSize}
            fill={textColor}
            transform={`rotate(${textRotation} ${centerX} ${centerY})`}
          >
            {c[label] as React.ReactNode}
          </SvgText>
        </G>
      );
    });
  };

  const render_ticks = () => {
    return data.map((c, i) => {
      const lineAngle = calculateLineAngle(i);
      const percent = getPiePercent(c[value] as number);
      const lineRotation = lineAngle + percent / 2;
      const fs = fontSize / 8;
      const textRotation = lineAngle + percent / 2 - fs;
      return (
        <G key={`ticks-${i}`}>
          <Line
            key={`tick-${i}`}
            x1={centerX + radius}
            y1={centerY}
            x2={centerX + radius + 5}
            y2={centerY}
            stroke={tickColor}
            strokeWidth={1}
            transform={`rotate(${lineRotation} ${centerX} ${centerY})`}
          />

          <SvgText
            x={centerX + radius + 7}
            y={centerY + fontSize / 2}
            fill={tickTextColor}
            fontSize={fontSize}
            transform={`rotate(${textRotation} ${centerX} ${centerY})`}
          >
            {c[value] as React.ReactNode}%
          </SvgText>
        </G>
      );
    });
  };

  const render_donut = () => {
    return (
      <G key="donut">
        <Circle
          cx={centerX}
          cy={centerY}
          r={donutRadius}
          fill={donutColor}
          strokeWidth={1}
          stroke={'#000'}
        />
      </G>
    );
  };

  const chartContainer = {
    height: containerHeight,
    width: containerWidth,
    backgroundColor: chartBackgroundColor,
  };

  const svgContainer = {
    backgroundColor: 'transparent',
  };

  return (
    <View style={chartContainer}>
      <Svg height="100%" width="100%" style={svgContainer}>
        {render_circles()}
        {render_text()}
        {render_ticks()}
        {useDonut && render_donut()}
      </Svg>
    </View>
  );
};

export default PieChart;
