import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { MultiLineProps, MultiLineData } from '../../interfaces';
import { quickSort } from '../../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MultiLine = <T,>(props: MultiLineProps<T>): JSX.Element => {
  const [exclusions, setExclusions] = useState<string[]>([]);

  const {
    data = [],
    x_key,
    y_key,
    curve = false,
    animated = false,
    legend = true,
    onPressItem,
    margin = 50,
    height: containerHeight = 300,
    width: containerWidth = SCREEN_WIDTH - margin,
    backgroundColor = 'transparent',
    svgBackgroundColor = 'transparent',
    useGradientBackground = true,
    backgroundBorderRadius = 20,
    axisColor = '#000',
    axisCircleFillColor = '#000',
    axisCircleStrokeColor = 'red',
    axisStrokeWidth = 1,
    axisCircleRadius = 5,
    axisCircleOpacity = 0.7,
    showHorizontalLines = true,
    horizontalLineOpacity = 0.1,
    showVerticalLines = true,
    verticalLineOpacity = 0.1,
    lineStrokeWidth = 2,
    x_label_renderer,
    y_label_renderer,
    lineGradient = false,
    gradient_background_config = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: containerHeight,
      gradientUnits: 'userSpaceOnUse',
      stop1: {
        offset: 0,
        stopColor: '#6491d9',
        stopOpacity: 0.3,
      },
      stop2: {
        offset: 1,
        stopColor: '#3557bf',
        stopOpacity: 0.8,
      },
    },
    x_axis_config = {
      fontSize: 12,
      textAnchor: 'middle',
      fontColor: '#000',
      fontWeight: '400',
      rotation: 0,
    },
    y_axis_config = {
      fontSize: 12,
      textAnchor: 'end',
      fontColor: '#000',
      fontWeight: '400',
      rotation: 0,
    },
  } = props;

  const handlePress = (item: MultiLineData<T>) => {
    if (onPressItem) {
      onPressItem(item);
    }
  };

  const calculateWidth = () => {
    const chartWidth = containerWidth - margin * 2;
    const gap_between_ticks = chartWidth / (data[0]!.data.length + 1);
    return {
      chartWidth,
      gap_between_ticks,
    };
  };

  const calculateMax = (a: MultiLineData<T>) => {
    return a.data.reduce((acc, cur) => {
      return parseFloat(cur[y_key] as string) > acc
        ? parseFloat(cur[y_key] as string)
        : acc;
    }, 0);
  };

  const calculateHeight = () => {
    let tmpArray = Array.from(data);
    // if (exclusions.length > 0) {
    //   exclusions.map((ex) => {
    //     tmpArray = tmpArray.filter((e) => e.label !== ex);
    //   });
    // }
    const newArray: number[] = [];
    tmpArray.map((a) => {
      newArray.push(calculateMax(a));
    });
    const yMax = newArray.reduce((acc, cur) => {
      return cur > acc ? cur : acc;
    }, 0);
    let min = 0;
    const actual_chart_height = containerHeight - margin * 2;
    const data_points = data[0]!.data.length - 1;
    let gap_between_ticks = actual_chart_height / data_points;
    const y_value_gap = (yMax - min) / data_points;
    return { yMax, min, gap_between_ticks, y_value_gap };
  };

  const render_background = () => {
    return (
      <Rect
        x={0}
        y={0}
        width={containerWidth}
        height={containerHeight}
        fill={'url(#gradientback)'}
        rx={backgroundBorderRadius}
      />
    );
  };

  const render_x_axis = () => {
    return (
      <G key="x-axis">
        <Circle
          cx={margin}
          cy={containerHeight - margin}
          r={axisCircleRadius}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          fill={axisCircleFillColor}
          opacity={axisCircleOpacity}
        />
        <Circle
          cx={containerWidth - margin}
          cy={containerHeight - margin}
          r={axisCircleRadius}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          fill={axisCircleFillColor}
          opacity={axisCircleOpacity}
        />
        <Line
          x1={margin}
          y1={containerHeight - margin}
          x2={containerWidth - margin}
          y2={containerHeight - margin}
          stroke={axisColor}
          strokeWidth={axisStrokeWidth}
        />
      </G>
    );
  };

  const render_y_axis = () => {
    return (
      <G key="y-axis">
        <Circle
          cx={margin}
          cy={margin}
          r={axisCircleRadius}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          fill={axisCircleFillColor}
          opacity={axisCircleOpacity}
        />
        <Line
          x1={margin}
          y1={containerHeight - margin}
          x2={margin}
          y2={margin}
          stroke={axisColor}
          strokeWidth={axisStrokeWidth}
        />
      </G>
    );
  };

  const render_x_axis_ticks = () => {
    const { gap_between_ticks } = calculateWidth();
    return data[0]!.data.map((_, index) => {
      const x = margin * 2 + gap_between_ticks * index;
      const y = containerHeight - margin;
      return (
        <G key={`x-axis_ticks_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
          />
        </G>
      );
    });
  };

  const render_x_axis_labels = () => {
    return data[0]!.data.map((item, index) => {
      const { gap_between_ticks } = calculateWidth();
      const {
        rotation = 0,
        fontSize = 12,
        fontColor = '#fff',
        textAnchor = 'middle',
        fontWeight = '400',
      } = x_axis_config;
      const x = margin * 2 + gap_between_ticks * index;
      const y = containerHeight - margin + 10 + fontSize;

      return (
        <SvgText
          key={`x-axis-label-${index}`}
          x={x}
          y={y}
          rotation={rotation}
          origin={`${x}, ${y}`}
          textAnchor={textAnchor}
          fontWeight={fontWeight}
          fontSize={fontSize}
          fill={fontColor}
        >
          {x_label_renderer
            ? (x_label_renderer(item[x_key]) as React.ReactNode)
            : (item[x_key] as React.ReactNode)}
        </SvgText>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const { gap_between_ticks } = calculateHeight();
    return data[0]!.data.map((_, index) => {
      const y = containerHeight - margin - gap_between_ticks * index;
      return (
        <G key={`y_axis_ticks_${index}`}>
          <Line
            x1={margin}
            y1={y}
            x2={margin - 10}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
          />
        </G>
      );
    });
  };

  const render_y_axis_labels = () => {
    const { gap_between_ticks, min, yMax } = calculateHeight();
    const {
      rotation = 0,
      fontSize = 12,
      fontWeight = '400',
      fontColor = '#fff',
      textAnchor = 'end',
    } = y_axis_config;
    const x = margin - 10;

    const yKeys = data[0]!.data.map((item) => item[y_key] as number);
    const yAxisData = quickSort(yKeys);

    return yAxisData.map((_, index) => {
      const y = containerHeight - margin - gap_between_ticks * index;
      const dataPoints = data[0]!.data.length - 1;
      const textValue = min + (yMax / dataPoints) * index;

      return (
        <G key={`y_axis_labels_${index}`}>
          <SvgText
            key={'x-axis-label'}
            x={x}
            y={y + fontSize / 3}
            rotation={rotation}
            origin={`${x}, ${y}`}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}
          >
            {y_label_renderer
              ? (y_label_renderer(textValue.toFixed(0)) as React.ReactNode)
              : (textValue.toFixed(0) as React.ReactNode)}
          </SvgText>
        </G>
      );
    });
  };

  const render_horizontal_lines = () => {
    const { gap_between_ticks } = calculateHeight();
    return data[0]!.data.map((_, index) => {
      const y = containerHeight - margin - gap_between_ticks * index;
      return (
        <G key={`horizontal_line_${index}`}>
          <Line
            x1={margin}
            y1={y}
            x2={containerWidth - margin}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={horizontalLineOpacity}
          />
        </G>
      );
    });
  };

  const render_vertical_lines = () => {
    const { gap_between_ticks } = calculateWidth();
    return data[0]!.data.map((_, index) => {
      const x = margin * 2 + gap_between_ticks * index;
      return (
        <G key={`verical_line_${index}`}>
          <Line
            x1={x}
            y1={containerHeight - margin}
            x2={x}
            y2={margin}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={verticalLineOpacity}
          />
        </G>
      );
    });
  };

  const getDPath = (arr: MultiLineData<T>[]) => {
    const { gap_between_ticks: x_gap } = calculateWidth();
    const { gap_between_ticks: y_gap, yMax, y_value_gap } = calculateHeight();
    let dPath = '';
    let prevXValue = 0;
    let prevYValue = 0;
    arr.map((item, index) => {
      let x = margin * 2 + x_gap * index;
      let y =
        (yMax - (item as unknown as number)) * (y_gap / y_value_gap) + margin;
      if ((item as unknown as number) < 0) {
        y = containerHeight - margin;
      }
      if (curve) {
        if (index === 0) {
          dPath += `M${x},${y} `;
          prevXValue = x;
          prevYValue = y;
        } else {
          const x_splitter = (x - prevXValue) / 4;
          const y_splitter = (y - prevYValue) / 2;
          dPath +=
            ` Q ${prevXValue + x_splitter},${prevYValue},${
              prevXValue + x_splitter * 2
            },${prevYValue + y_splitter}` +
            ` Q ${prevXValue + x_splitter * 3},${
              prevYValue + y_splitter * 2
            },${x},${y}`;
          prevXValue = x;
          prevYValue = y;
        }
      } else {
        if (index === 0) {
          dPath += `M${x},${y}`;
        } else {
          dPath += ` L${x},${y}`;
        }
      }
    });

    return dPath;
  };

  const render_lines = () => {
    let tmpArray = Array.from(data);
    if (exclusions.length > 0) {
      exclusions.map((ex) => {
        tmpArray = tmpArray.filter((e) => e.label !== ex);
      });
    }
    return tmpArray.map((item, index) => {
      const tmp = item.data.map((r) => r[y_key]);
      const dPath = getDPath(tmp as MultiLineData<T>[]);
      if (animated) {
        return (
          <Path
            key={`line_${index}`}
            d={dPath}
            strokeWidth={lineStrokeWidth}
            stroke={item.color}
            fill={'transparent'}
            onPress={() => handlePress(item)}
          />
        );
      } else {
        return (
          <Path
            key={`line_${index}`}
            d={dPath}
            strokeWidth={lineStrokeWidth}
            stroke={item.color}
            fill={'transparent'}
            // onLayout={() =>
            //   setPathLength(pathRef.current!.getTotalLength() as number)
            // }
            // strokeDasharray={pathLength}
            // strokeDashoffset={animatedLineProps as number}
            onPress={() => handlePress(item)}
          />
        );
      }
    });
  };

  const render_gradients = () => {
    let tmpArray = Array.from(data);
    if (exclusions.length > 0) {
      exclusions.map((ex) => {
        tmpArray = tmpArray.filter((e) => e.label !== ex);
      });
    }
    return tmpArray.map((item, index) => {
      if (item.gradient) {
        const tmp = item.data.map((r) => r[y_key]);
        let dPath = getDPath(tmp as MultiLineData<T>[]);
        dPath += `L ${containerWidth - margin * 2}, ${
          containerHeight - margin
        } L ${margin}, ${containerHeight - margin} Z`;
        return (
          <Path
            key={`gradient_${index}`}
            d={dPath}
            strokeWidth={0}
            fill={`url(#fillShadowGradient_${index})`}
          />
        );
      } else {
        return null;
      }
    });
  };

  const render_legend = () => {
    const legendPaddingY = 25;
    const legendPaddingX = 50;
    let lastY = legendPaddingY;
    const fontSize = 12;
    const radius = 10;
    const stringLength = 4;

    return data.map((item, index) => {
      let x = index * 75 + legendPaddingX;
      if (x + legendPaddingX > containerWidth) {
        lastY += legendPaddingY * 2;
        x = legendPaddingX;
      }
      let y = lastY;
      return (
        <G key={`legend_${index}`}>
          <Circle
            testID={`leg-circle-${index}`}
            cx={x}
            cy={lastY}
            r={radius}
            strokeWidth={1}
            fill={exclusions.includes(item.label) ? '#ccc' : item.color}
            onPress={() => handleExclusionPress(item.label)}
          />
          <Rect
            testID={`leg-rect-${index}`}
            x={x - radius / 2 - 10}
            y={y - radius / 2 - legendPaddingY / 2}
            width={fontSize + legendPaddingX + stringLength}
            height={fontSize + legendPaddingY}
            opacity={0.5}
            rx={radius / 2}
            stroke={'#000'}
            strokeWidth={2}
            onPress={() => handleExclusionPress(item.label)}
          />
          <SvgText
            testID={`leg-text-${index}`}
            id={`legend_item_${index}`}
            x={x + 15}
            y={y + 7}
            fill={exclusions.includes(item.label) ? '#ccc' : '#000'}
            fontSize={12}
            onPress={() => handleExclusionPress(item.label)}
          >
            {item.label.length > stringLength
              ? item.label.substring(0, stringLength)
              : item.label}
          </SvgText>
        </G>
      );
    });
  };

  const handleExclusionPress = (label: string) => {
    if (exclusions.includes(label)) {
      const tmpArray = Array.from(exclusions);
      const index = tmpArray.findIndex((l) => l === label);
      tmpArray.splice(index, 1);
      setExclusions(tmpArray);
    } else {
      setExclusions([...exclusions, label]);
    }
  };

  const mainContainer = {
    height: containerHeight,
    width: containerWidth,
    backgroundColor,
  };

  const svgContainer = {
    backgroundColor: svgBackgroundColor,
  };

  const legendStyle = {
    backgroundColor: 'transparent',
    fill: 'transparent',
    strokeWidth: 3,
    stroke: '#000',
  };

  return (
    <View style={mainContainer}>
      <Svg style={svgContainer}>
        <Defs>
          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              if (item.gradient) {
                return (
                  <LinearGradient
                    key={`lg-${index}`}
                    id={`fillShadowGradient_${index}`}
                    gradientUnits={'userSpaceOnUse'}
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={containerHeight}
                  >
                    <Stop
                      offset={item.gradient.stop1!.offset}
                      stopColor={item.gradient.stop1!.stopColor}
                      stopOpacity={item.gradient.stop1!.stopOpacity}
                    />
                    <Stop
                      offset={item.gradient.stop2!.offset}
                      stopColor={item.gradient.stop2!.stopColor}
                      stopOpacity={item.gradient.stop2!.stopOpacity}
                    />
                  </LinearGradient>
                );
              } else {
                return null;
              }
            })}
          <LinearGradient
            id="gradientback"
            // @ts-ignore
            gradientUnits={gradient_background_config?.gradientUnits}
            x1={gradient_background_config.x1}
            y1={gradient_background_config.y1}
            x2={gradient_background_config.x2}
            y2={gradient_background_config.y2}
          >
            <Stop
              offset={gradient_background_config.stop1?.offset}
              stopColor={gradient_background_config.stop1?.stopColor}
              stopOpacity={gradient_background_config.stop1?.stopOpacity}
            />
            <Stop
              offset={gradient_background_config.stop2?.offset}
              stopColor={gradient_background_config.stop2?.stopColor}
              stopOpacity={gradient_background_config.stop2?.stopOpacity}
            />
          </LinearGradient>
        </Defs>
        {useGradientBackground && render_background()}
        {render_x_axis()}
        {render_y_axis()}
        {data && data.length > 0 && render_x_axis_ticks()}
        {data && data.length > 0 && render_x_axis_labels()}
        {data && data.length > 0 && render_y_axis_ticks()}
        {data && data.length > 0 && render_y_axis_labels()}
        {data && data.length > 0 && lineGradient && render_gradients()}
        {data &&
          data.length > 0 &&
          showHorizontalLines &&
          render_horizontal_lines()}
        {data &&
          data.length > 0 &&
          showVerticalLines &&
          render_vertical_lines()}
        {data && data.length > 0 && render_lines()}
      </Svg>
      {legend ? (
        <Svg
          height={Math.ceil(data.length / 4) * 50}
          width={containerWidth}
          style={legendStyle}
        >
          <G>
            <Rect
              x={0}
              y={0}
              height={Math.ceil(data.length / 4) * 50}
              width={containerWidth}
              fill={'transparent'}
              rx={10}
            />
            {data && data.length > 0 && render_legend()}
          </G>
        </Svg>
      ) : null}
    </View>
  );
};

export default MultiLine;
