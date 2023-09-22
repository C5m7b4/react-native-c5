import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import BasicChart from '../BasicChart';
import {
  BoxPlotProps,
  AxisConfig,
  BoxPlotPress,
  ILinearGradient,
  IOutlier,
} from '../../interfaces';
import { BasicChartProps } from '../../types';
import {
  unique,
  median,
  quartile,
  Outliers,
  IQR,
  maxWithoutOutliers,
  minWithoutOutliers,
} from '../../helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

class BoxPlot<T> extends BasicChart<T, BoxPlotProps<T>> {
  constructor(
    props:
      | BasicChartProps<T, BoxPlotProps<T>>
      | Readonly<BasicChartProps<T, BoxPlotProps<T>>>
  ) {
    super(props);
    this.calculateWidth = this.calculateWidth.bind(this);
    this.calculateHeight = this.calculateHeight.bind(this);
    this.render_x_axis_ticks = this.render_x_axis_ticks.bind(this);
    this.render_x_axis_labels = this.render_x_axis_labels.bind(this);
  }

  handlePress(
    onPress: (record: BoxPlotPress<T>) => void,
    record: string,
    q1: number,
    q3: number,
    index: number,
    x: number,
    m: number,
    outliers: number[],
    maxwo: number,
    minwo: number,
    dayData: T[],
    predicateResult: T[] | []
  ) {
    if (onPress) {
      onPress({
        record,
        q1,
        q3,
        index,
        x,
        m,
        outliers,
        maxwo,
        minwo,
        dayData,
        predicateResult,
      });
    } else {
      console.log('no onPress present');
    }
  }

  calculateWidth() {
    const data = this.state.data.map(
      (item) => item[this.state.y_key] as number
    );
    const uniques = unique(data);
    const chartWidth = this.state.containerWidth - this.state.margin / 2;
    const gap_between_ticks = chartWidth / (uniques.length / 2);
    return { chartWidth, gap_between_ticks };
  }

  calculateHeight() {
    const yMax = this.state.data.reduce((acc, cur) => {
      return acc > (cur[this.state.y_key] as number)
        ? acc
        : (cur[this.state.y_key] as number);
    }, 0);

    let min = 0;
    const actual_chart_height =
      this.state.containerHeight - this.state.margin * 2;
    const data_points = this.state.data.length - 1;
    const gap_between_ticks = actual_chart_height / data_points;
    const y_value_gap = (yMax - min) / data_points;
    return { yMax, min, gap_between_ticks, y_value_gap };
  }

  render_x_axis_ticks(axisColor: string, axisStrokeWidth: number) {
    const data = this.state.data.map(
      (item) => item[this.state.x_key] as number
    );
    const { gap_between_ticks } = this.calculateWidth();
    const uniques = unique(data);
    return uniques.map((_, index) => {
      const x = this.state.margin * 2 + gap_between_ticks * index;
      const y = this.state.containerHeight - this.state.margin;
      return (
        <G key={`x_axis_ticks_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            strokeWidth={axisStrokeWidth}
            stroke={axisColor}
          />
        </G>
      );
    });
  }

  render_x_axis_labels(
    x_axis_config: AxisConfig,
    x_label_renderer: (item: T) => React.ReactNode
  ) {
    const { gap_between_ticks } = this.calculateWidth();
    const {
      rotation = 0,
      fontSize = 12,
      fontColor = '#fff',
      textAnchor = 'middle',
      fontWeight = '400',
    } = x_axis_config;
    const data = this.state.data.map(
      (item) => item[this.state.x_key] as number
    );
    const uniques = unique(data);
    return uniques.map((item, index) => {
      const x = this.state.margin * 2 + gap_between_ticks * index;
      const y = this.state.containerHeight - this.state.margin + 10 + fontSize;
      return (
        <G key={`x_axis_label_${index}`}>
          <SvgText
            x={x}
            y={y}
            origin={`${x}, ${y}`}
            rotation={rotation}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}
          >
            {x_label_renderer ? x_label_renderer(item as T) : item}
          </SvgText>
        </G>
      );
    });
  }

  render_y_axis_ticks_boxplot(
    axisColor: string,
    axisStrokeWidth: number,
    skipYAxisLabels: number
  ) {
    const { gap_between_ticks } = this.calculateHeight();
    return this.state.yAxisLabels.map((_, index) => {
      if (index % skipYAxisLabels === 0) {
        const y =
          this.state.containerHeight -
          this.state.margin -
          gap_between_ticks * index;
        return (
          <G key={`y_axis_ticks_${index}`}>
            <Line
              x1={this.state.margin}
              y1={y}
              x2={this.state.margin - 10}
              y2={y}
              strokeWidth={axisStrokeWidth}
              stroke={axisColor}
            />
          </G>
        );
      } else {
        return null;
      }
    });
  }

  render_y_axis_labels_boxplot(
    y_axis_config: AxisConfig,
    y_label_renderer: (item: number) => React.ReactNode,
    skipYAxisLabels: number
  ) {
    const { gap_between_ticks, min, yMax } = this.calculateHeight();
    const {
      rotation = 0,
      fontSize = 12,
      fontColor = '#fff',
      textAnchor = 'middle',
      fontWeight = '400',
    } = y_axis_config;
    const x = this.state.margin - 10;
    return this.state.yAxisLabels.map((_, index) => {
      if (index % skipYAxisLabels === 0) {
        const y =
          this.state.containerHeight -
          this.state.margin -
          gap_between_ticks * index;
        const data_points = this.state.data.length - 1;
        const textValue = min + (yMax / data_points) * index;
        return (
          <G key={`y_axis_labels_${index}`}>
            <SvgText
              x={x}
              y={y + fontSize / 3}
              origin={`${x}, ${y}`}
              rotation={rotation}
              textAnchor={textAnchor}
              fontWeight={fontWeight}
              fontSize={fontSize}
              fill={fontColor}
            >
              {y_label_renderer
                ? y_label_renderer(textValue)
                : textValue.toFixed(0)}
            </SvgText>
          </G>
        );
      } else {
        return null;
      }
    });
  }

  gatherData(d: T[]) {
    const currentData = d.map((r) => r[this.state.y_key] as number);
    const m = median(currentData);
    const q1 = quartile(currentData, 0.25);
    const q3 = quartile(currentData, 0.75);
    const iqr = IQR(currentData);
    const outliers = Outliers(currentData);
    const maxwo = maxWithoutOutliers(currentData);
    const minwo = minWithoutOutliers(currentData);
    return { m, q1, q3, iqr, outliers, maxwo, minwo };
  }

  render_rect(
    record: string,
    q1: number,
    q3: number,
    index: number,
    x: number,
    m: number,
    outliers: number[],
    maxwo: number,
    minwo: number,
    dayData: T[],
    predicate: (item: T[]) => T[] | [],
    barWidth: number,
    boxStroke: string,
    boxStrokeWidth: number,
    useBarGradient: boolean,
    onPress: (record: BoxPlotPress<T>) => void,
    medianStroke: string,
    medianStrokeWidth: number,
    upperLineStroke: string,
    upperLineStrokeWidth: number,
    upperboxStroke: string,
    upperboxStrokeWidth: number,
    lowerLineSroke: string,
    lowerLineStrokeWidth: number,
    lowerboxStroke: string,
    lowerboxStrokeWidth: number
  ) {
    const {
      gap_between_ticks: y_gap,
      yMax,
      y_value_gap,
    } = this.calculateHeight();
    const y = (yMax - q1) * (y_gap / y_value_gap) + this.state.margin;
    const height = q3 - q1;
    const boxHeight = height * (y_gap / y_value_gap);
    const lineY = (yMax - m) * (y_gap / y_value_gap) + this.state.margin;
    const maxHorizontalLineY =
      (yMax - maxwo) * (y_gap / y_value_gap) + this.state.margin;
    const minHorizontalLineY =
      (yMax - minwo) * (y_gap / y_value_gap) + this.state.margin;

    let predicateResult: T[] | null = null;
    if (predicate) {
      predicateResult = predicate(dayData);
    }
    if (typeof predicateResult === 'undefined' || predicateResult === null) {
      predicateResult = [];
    }

    return (
      <G key={`rect-g-${index}`}>
        <Rect
          testID={`box-${index}`}
          x={x - barWidth / 2}
          y={y}
          width={barWidth}
          height={-boxHeight}
          stroke={boxStroke}
          strokeWidth={boxStrokeWidth}
          fill={
            useBarGradient
              ? predicateResult.length > 0
                ? 'url(#danger)'
                : 'url(#boxgradient)'
              : 'transparent'
          }
          onPress={() =>
            this.handlePress(
              onPress,
              record,
              q1,
              q3,
              index,
              x,
              m,
              outliers,
              maxwo,
              minwo,
              dayData,
              predicateResult!
            )
          }
        />
        <Line
          x1={x - barWidth / 2}
          y1={lineY}
          x2={x + barWidth / 2}
          y2={lineY}
          stroke={medianStroke}
          strokeWidth={medianStrokeWidth}
        />
        <Line
          x1={x}
          y1={y - boxHeight}
          x2={x}
          y2={maxHorizontalLineY}
          stroke={upperLineStroke}
          strokeWidth={upperLineStrokeWidth}
        />
        <Line
          x1={x - barWidth / 2}
          y1={maxHorizontalLineY}
          x2={x + barWidth / 2}
          y2={maxHorizontalLineY}
          stroke={upperboxStroke}
          strokeWidth={upperboxStrokeWidth}
        />
        <Line
          x1={x}
          y1={y}
          x2={x}
          y2={minHorizontalLineY}
          stroke={lowerLineSroke}
          strokeWidth={lowerLineStrokeWidth}
        />
        <Line
          x1={x - barWidth / 2}
          y1={minHorizontalLineY}
          x2={x + barWidth / 2}
          y2={minHorizontalLineY}
          stroke={lowerboxStroke}
          strokeWidth={lowerboxStrokeWidth}
        />
      </G>
    );
  }

  render_box(
    record: string,
    index: number,
    x: number,
    predicate: (item: T[]) => T[],
    barWidth: number,
    boxStroke: string,
    boxStrokeWidth: number,
    useBarGradient: boolean,
    onPress: (record: BoxPlotPress<T>) => void,
    medianStroke: string,
    medianStrokeWidth: number,
    upperLineStroke: string,
    upperLineStrokeWidth: number,
    upperboxStroke: string,
    upperboxStrokeWidth: number,
    lowerLineSroke: string,
    lowerLineStrokeWidth: number,
    lowerboxStroke: string,
    lowerboxStrokeWidth: number
  ) {
    // record is a single day
    const dayData: T[] = [];

    this.state.data.map((r) => {
      if (r[this.state.x_key] === record) {
        dayData.push(r);
      }
    });
    const { m, q1, q3, outliers, maxwo, minwo } = this.gatherData(dayData);
    return this.render_rect(
      record,
      q1,
      q3,
      index,
      x,
      m,
      outliers,
      maxwo,
      minwo,
      dayData,
      predicate,
      barWidth,
      boxStroke,
      boxStrokeWidth,
      useBarGradient,
      onPress,
      medianStroke,
      medianStrokeWidth,
      upperLineStroke,
      upperLineStrokeWidth,
      upperboxStroke,
      upperboxStrokeWidth,
      lowerLineSroke,
      lowerLineStrokeWidth,
      lowerboxStroke,
      lowerboxStrokeWidth
    );
  }

  render_boxes(
    predicate: (item: T[]) => T[],
    barWidth: number,
    barStroke: string,
    barStrokeWidth: number,
    useBarGradient: boolean,
    onPress: (record: BoxPlotPress<T>) => void,
    medianStroke: string,
    medianStrokeWidth: number,
    upperLineStroke: string,
    upperLineStrokeWidth: number,
    upperboxStroke: string,
    upperboxStrokeWidth: number,
    lowerLineSroke: string,
    lowerLineStrokeWidth: number,
    lowerboxStroke: string,
    lowerboxStrokeWidth: number
  ) {
    const { gap_between_ticks } = this.calculateWidth();
    const data = this.state.data.map(
      (item) => item[this.state.x_key] as string
    );
    const uniques = unique(data);

    return uniques.map((r, i) => {
      const x = this.state.margin * 2 + gap_between_ticks * i;
      return this.render_box(
        r,
        i,
        x,
        predicate,
        barWidth,
        barStroke,
        barStrokeWidth,
        useBarGradient,
        onPress,
        medianStroke,
        medianStrokeWidth,
        upperLineStroke,
        upperLineStrokeWidth,
        upperboxStroke,
        upperboxStrokeWidth,
        lowerLineSroke,
        lowerLineStrokeWidth,
        lowerboxStroke,
        lowerboxStrokeWidth
      );
    });
  }

  render_box_gradient(bar_gradient_config: ILinearGradient) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = this.state.containerHeight,
      GradientUnits = 'userSpaceOnUse',
    } = bar_gradient_config;
    const {
      offset: offset1 = 0,
      stopColor: stopColor1 = '#8122a3',
      stopOpacity: stopOpacity1 = 0.3,
    } = bar_gradient_config.stop1!;
    const {
      offset: offset2 = 1,
      stopColor: stopColor2 = '#ba34eb',
      stopOpacity: stopOpacity2 = 0.8,
    } = bar_gradient_config.stop2!;
    return (
      <Defs>
        <LinearGradient
          id="boxgradient"
          gradientUnits={GradientUnits}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        >
          <Stop
            offset={offset1}
            stopColor={stopColor1}
            stopOpacity={stopOpacity1}
          />
          <Stop
            offset={offset2}
            stopColor={stopColor2}
            stopOpacity={stopOpacity2}
          />
        </LinearGradient>
      </Defs>
    );
  }

  render_predicate_gradient(predicate_gradient_config: ILinearGradient) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 50,
      GradientUnits = 'userSpaceOnUse',
    } = predicate_gradient_config;
    const {
      offset: offset1 = '0',
      stopColor: stopColor1 = '#8122a3',
      stopOpacity: stopOpacity1 = 0,
    } = predicate_gradient_config.stop1!;
    const {
      offset: offset2 = '1',
      stopColor: stopColor2 = '#ba34eb',
      stopOpacity: stopOpacity2 = 0,
    } = predicate_gradient_config.stop2!;
    return (
      <Defs>
        <LinearGradient
          id="danger"
          gradientUnits={GradientUnits}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        >
          <Stop
            offset={offset1}
            stopColor={stopColor1}
            stopOpacity={stopOpacity1}
          />
          <Stop
            offset={offset2}
            stopColor={stopColor2}
            stopOpacity={stopOpacity2}
          />
        </LinearGradient>
      </Defs>
    );
  }

  render_outliers(outlier_config: IOutlier) {
    const data = this.state.data.map(
      (item) => item[this.state.x_key] as string
    );
    const uniques = unique(data);
    const { gap_between_ticks } = this.calculateWidth();
    const {
      gap_between_ticks: y_gap,
      yMax,
      y_value_gap,
    } = this.calculateHeight();
    const {
      radius = 5,
      stroke = '#000',
      strokeWidth = 1,
      opacity = 0.7,
      fill = '#ff0000',
    } = outlier_config;
    return uniques.map((item, index) => {
      const x = this.state.margin * 2 + gap_between_ticks * index;
      const dayData: T[] = [];
      this.state.data.map((rr) => {
        if ((rr[this.state.x_key] as string) === item) {
          dayData.push(rr);
        }
      });

      const { outliers } = this.gatherData(dayData);
      return outliers.map((o, idx) => {
        const y = (yMax - o) * (y_gap / y_value_gap) + this.state.margin;
        return (
          <Circle
            key={`o-${idx}-${index}`}
            cx={x}
            cy={y}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            fill={fill}
          />
        );
      });
    });
  }

  render() {
    const {
      onPress,
      height: containerHeight = 300,
      width: containerWidth = SCREEN_WIDTH - 50,
      backgroundColor = 'transparent',
      svgBackgroundColor = 'transparent',
      useGradientBackground = true,
      backgroundBorderRadius = 20,
      axisCircleRadius = 5,
      axisColor = '#000',
      axisCircleFillColor = '#000',
      axisCircleStrokeColor = 'purple',
      axisStrokeWidth = 1,
      axisCircleOpacity = 0.8,
      showHorizontalLines = true,
      horizontalLineOpacity = 0.1,
      showVerticalLines = false,
      verticalLineOpacity = 0.1,
      skipYAxisLabels = 2,
      predicate,
      barWidth = 20,
      barStroke = '#000',
      barStrokeWidth = 1,
      useBarGradient = true,
      x_label_renderer,
      y_label_renderer,
      medianStroke = '#000',
      medianStrokeWidth = 1,
      upperLineStroke = '#000',
      upperLineStrokeWidth = 1,
      upperboxStroke = '#000',
      upperboxStrokeWidth = 1,
      lowerLineSroke = '#000',
      lowerLineStrokeWidth = 1,
      lowerboxStroke = '#000',
      lowerboxStrokeWidth = 1,
      bar_gradient_config = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 25,
        GradientUnits: 'userSpaceOnUse',
        stop1: {
          offset: 0,
          stopColor: '#8122a3',
          stopOpacity: 0.8,
        },
        stop2: {
          offset: 1,
          stopColor: '#ba34eb',
          stopOpacity: 0.3,
        },
      },
      predicate_gradient_config = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 100,
        GradientUnits: 'userSpaceOnUse',
        stop1: {
          offset: 0,
          stopColor: '#d47822',
          stopOpacity: 1,
        },
        stop2: {
          offset: 1,
          stopColor: '#e21616',
          stopOpacity: 1,
        },
      },
      gradient_background_config = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: containerHeight,
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
        fontColor: '#fff',
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
      outlier_config = {
        radius: 5,
        stroke: '#000',
        strokeWidth: 1,
        opacity: 0.5,
        fill: 'red',
      },
    } = this.props;

    const mainContainer = {
      height: containerHeight,
      width: containerWidth,
      backgroundColor,
    };

    const svgContainer = {
      backgroundColor: svgBackgroundColor,
    };
    return (
      <View style={mainContainer}>
        <Svg height="100%" width="100%" style={svgContainer}>
          {this.render_defs(gradient_background_config)}
          {useGradientBackground &&
            this.render_background(backgroundBorderRadius)}
          {this.render_x_axis(
            axisCircleRadius,
            axisColor,
            axisCircleFillColor,
            axisCircleStrokeColor,
            axisStrokeWidth,
            axisCircleOpacity
          )}
          {this.render_y_axis(
            axisCircleRadius,
            axisCircleFillColor,
            axisStrokeWidth,
            axisCircleOpacity,
            axisColor,
            axisCircleStrokeColor
          )}
          {this.state.data &&
            this.state.data.length > 0 &&
            showHorizontalLines &&
            this.render_horizontal_lines(
              axisColor,
              axisStrokeWidth,
              horizontalLineOpacity
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            showVerticalLines &&
            this.render_vertical_lines(
              axisColor,
              axisStrokeWidth,
              verticalLineOpacity
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_x_axis_ticks(axisColor, axisStrokeWidth)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_x_axis_labels(x_axis_config, x_label_renderer!)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_y_axis_ticks_boxplot(
              axisColor,
              axisStrokeWidth,
              skipYAxisLabels
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_y_axis_labels_boxplot(
              y_axis_config,
              y_label_renderer!,
              skipYAxisLabels
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            useBarGradient &&
            this.render_box_gradient(bar_gradient_config)}
          {this.state.data &&
            this.state.data.length > 0 &&
            useBarGradient &&
            predicate &&
            this.render_predicate_gradient(predicate_gradient_config)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_boxes(
              predicate!,
              barWidth,
              barStroke,
              barStrokeWidth,
              useBarGradient,
              onPress!,
              medianStroke,
              medianStrokeWidth,
              upperLineStroke,
              upperLineStrokeWidth,
              upperboxStroke,
              upperboxStrokeWidth,
              lowerLineSroke,
              lowerLineStrokeWidth,
              lowerboxStroke,
              lowerboxStrokeWidth
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_outliers(outlier_config)}
        </Svg>
      </View>
    );
  }
}

export default BoxPlot;
