import React from 'react';
import { View, Dimensions, Animated, Easing } from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg'; // Stop, // LinearGradient, // Rect, // Path, // Defs, // G,
import BasicChart from '../BasicChart';
import {
  BarChartProps,
  ILinearGradient,
  IBarChartTooltipConfig,
} from '../../interfaces';
import { newShade } from '../../utils';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const { width: SCREEN_WIDTH } = Dimensions.get('window');

class BarChart<T> extends BasicChart<T, BarChartProps> {
  handlePress(item: T, onPressItem: (item: T) => void) {
    if (onPressItem) {
      onPressItem(item);
    }
  }

  render_gradient_def(barGradientConfig: ILinearGradient) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = this.state.containerHeight,
    } = barGradientConfig;
    const {
      offset: offset1 = '0',
      stopColor: stopColor1 = '#7e248a',
      stopOpacity: stopOpacity1 = 0.8,
    } = barGradientConfig.stop1!;
    const {
      offset: offset2 = '1',
      stopColor: stopColor2 = '#b92bcc',
      stopOpacity: stopOpacity2 = 0.3,
    } = barGradientConfig.stop2!;
    return (
      <Defs>
        <LinearGradient
          id="bargradient"
          gradientUnits="userSpaceOnUse"
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

  render_barchart(
    barColor: string,
    barOpacity: number,
    barWidth: number,
    onPressItem: (item: T) => void,
    useBarGradient: boolean,
    animated: boolean,
    threeD: boolean,
    threeDX: number,
    threeDY: number,
    bar_gradient_config: ILinearGradient
  ) {
    const {
      gap_between_ticks: y_gap,
      yMax,
      y_value_gap,
    } = this.calculateHeight();
    const { gap_between_ticks: x_gap } = this.calculateWidth();
    const y = this.state.containerHeight - this.state.margin;
    const { stopColor = '#b92bcc' } = bar_gradient_config.stop2!;

    return this.state.data.map((item, index) => {
      const x = this.state.margin * 2 + x_gap * index;
      const height =
        (yMax - (item[this.state.y_key] as number)) * (y_gap / y_value_gap) +
        this.state.margin;
      const barHeight = this.state.containerHeight - this.state.margin - height;

      const animatedHeight = new Animated.Value(0);
      Animated.timing(animatedHeight, {
        toValue: -barHeight,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      let barShadowFillColor = useBarGradient
        ? newShade(stopColor, 50)
        : newShade(barColor, 50);

      return (
        <G key={`bar_${index}`}>
          {threeD ? (
            <AnimatedPath
              d={`
              
              M ${x - barWidth / 2}, ${y}
              L ${x - barWidth / 2 - threeDX}, ${y - threeDY}
              L ${x - barWidth / 2 - threeDX}, ${y - threeDY - barHeight}
              L ${x + barWidth / 2 - threeDX}, ${y - threeDY - barHeight}
              L ${x + barWidth / 2}, ${y - barHeight}
              L ${x + barWidth / 2}, ${y}
            Z`}
              strokeWidth={0}
              fill={barShadowFillColor}
              opacity={1}
            />
          ) : null}
          <AnimatedRect
            x={x - barWidth / 2}
            y={y}
            height={animated ? animatedHeight : -barHeight}
            width={barWidth}
            fill={useBarGradient ? 'url(#bargradient)' : barColor}
            opacity={barOpacity}
            onPress={() => this.handlePress(item, onPressItem)}
          />
        </G>
      );
    });
  }

  render_tooltips(tooltipConfig: IBarChartTooltipConfig) {
    const {
      gap_between_ticks: y_gap,
      yMax,
      y_value_gap,
    } = this.calculateHeight();
    const { textAnchor, fontWeight, fontSize, fontColor } = tooltipConfig;
    const { gap_between_ticks: x_gap } = this.calculateWidth();
    const animatedOpacity = new Animated.Value(0);
    Animated.timing(animatedOpacity, {
      toValue: 1,
      delay: 500,
      duration: 500,
      useNativeDriver: true,
    }).start();
    return this.state.data.map((item, index) => {
      const x = this.state.margin * 2 + x_gap * index;
      const y =
        (yMax - (item[this.state.y_key] as number)) * (y_gap / y_value_gap) +
        this.state.margin;
      return (
        <G key={`tooltips_${index}`}>
          <AnimatedSvgText
            x={x}
            y={y - 5}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}
            opacity={animatedOpacity}
          >
            {item[this.state.y_key] as React.ReactNode}
          </AnimatedSvgText>
        </G>
      );
    });
  }

  render() {
    const {
      onPressItem,
      height: containerHeight = 300,
      width: containerWidth = SCREEN_WIDTH - 50,
      backgroundColor = 'transparent',
      svgBackgroundColor = 'transparent',
      backgroundBorderRadius = 20,
      axisCircleRadius = 5,
      axisColor = '#000',
      axisCircleFillColor = '#000',
      axisCircleStrokeColor = 'purple',
      axisStrokeWidth = 1,
      axisCircleOpacity = 0.8,
      showHorizontalLines = true,
      horizontalLineOpacity = 0.1,
      showVerticalLines = true,
      verticalLineOpacity = 0.1,
      useBarGradient = true,
      threeD = true,
      threeDX = 5,
      threeDY = 5,
      x_label_renderer,
      y_label_renderer,
      barColor = 'purple',
      barOpacity = 1,
      barWidth = 20,
      animated = true,
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
      bar_gradient_config = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: containerHeight,
        stop1: {
          offset: 0,
          stopColor: '#7e248a',
          stopOpacity: 0.8,
        },
        stop2: {
          offset: 1,
          stopColor: '#b92bcc',
          stopOpacity: 0.3,
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
      showTooltips = true,
      tooltip_config = {
        fontColor: '#000',
        fontSize: 12,
        fontWeight: '400',
        textAnchor: 'middle',
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
          {this.render_background(backgroundBorderRadius)}
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
            this.render_x_axis_labels(x_axis_config, x_label_renderer)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_y_axis_ticks(axisColor, axisStrokeWidth)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_y_axis_labels(y_axis_config, y_label_renderer)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_gradient_def(bar_gradient_config)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_barchart(
              barColor,
              barOpacity,
              barWidth,
              onPressItem!,
              useBarGradient,
              animated,
              threeD,
              threeDX,
              threeDY,
              bar_gradient_config
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            showTooltips &&
            this.render_tooltips(tooltip_config)}
        </Svg>
      </View>
    );
  }
}

export default BarChart;
