import { IGradientUnits, TextAnchor } from 'src/types';

export interface AxisConfig {
  fill?: string;
  fontColor?: string;
  fontSize?: number;
  fontWeight?: string;
  rotation?: number;
  textAnchor?: TextAnchor;
}

export interface IStop {
  offset?: number;
  stopColor?: string;
  stopOpacity?: number;
}

export interface ILinearGradient {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  GradientUnits?: IGradientUnits;
  stop1?: IStop;
  stop2?: IStop;
  stop3?: IStop;
  stop4?: IStop;
}

export interface ILineTooltipConfig {
  tooltipHeight?: number;
  tooltipWidth?: number;
  tooltipFill?: string;
  tooltipBorderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  textAnchor?: TextAnchor;
}

export interface LineChartProps {
  lineCircleRadius?: number;
  lineCircleStroke?: string;
  lineCircleFill?: string;
  lineCircleStrokeWidth?: number;
  showTooltips?: boolean;
  tooltip_config?: ILineTooltipConfig;
  lineStrokeWidth?: number;
  lineStroke?: string;
  curve?: boolean;
  useLineShadow?: boolean;
}

export interface BarChartProps {
  barColor?: string;
  barWidth?: number;
  barOpacity?: number;
  useBarGradient?: boolean;
  bar_gradient_config?: ILinearGradient;
  animated?: boolean;
  threeD?: boolean;
  threeDX?: number;
  threeDY?: number;
  showTooltips?: boolean;
  tooltip_config?: IBarChartTooltipConfig;
}

export interface IBarChartTooltipConfig {
  fontSize?: number;
  fontWeight?: string;
  textAnchor?: TextAnchor;
  fontColor?: string;
}

export interface BoxPlotPress<T> {
  record: string;
  q1: number;
  q3: number;
  index: number;
  x: number;
  m: number;
  outliers: number[];
  maxwo: number;
  minwo: number;
  dayData: any;
  predicateResult: T[] | null;
}

export interface BoxPlotProps<T> {
  barWidth?: number;
  animated?: boolean;
  barColor?: string;
  barOpacity?: number;
  bar_gradient_config?: ILinearGradient;
  predicate_gradient_config?: ILinearGradient;
  skipYAxisLabels?: number;
  barStroke?: string;
  barStrokeWidth?: number;
  useBarGradient?: boolean;
  medianStroke?: string;
  medianStrokeWidth?: number;
  upperLineStroke?: string;
  upperLineStrokeWidth?: number;
  upperboxStroke?: string;
  upperboxStrokeWidth?: number;
  lowerLineSroke?: string;
  lowerLineStrokeWidth?: number;
  lowerboxStroke?: string;
  lowerboxStrokeWidth?: number;
  onPress?: (record: BoxPlotPress<T>) => void;
  predicateResult?: (item: T) => T[] | [];
  outlier_config?: IOutlier;
}

export interface IOutlier {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fill?: string;
}

export interface MultiLineData<T> {
  data: T[];
  label: string;
  color: string;
  useGradient?: boolean;
  gradient?: ILinearGradient;
}

export interface MultiLineProps<T> {
  data: MultiLineData<T>[];
  x_key: keyof T;
  y_key: keyof T;
  onPressItem?: (item: MultiLineData<T>) => void;
  margin?: number;
  height?: number;
  width?: number;
  backgroundColor?: string;
  svgBackgroundColor?: string;
  useGradientBackground?: boolean;
  backgroundBorderRadius?: number;
  axisColor?: string;
  axisStrokeWidth?: number;
  axisCircleStrokeColor?: string;
  axisCircleRadius?: number;
  axisCircleFillColor?: string;
  axisCircleOpacity?: number;
  gradient_background_config?: ILinearGradient;
  x_axis_config?: AxisConfig;
  y_axis_config?: AxisConfig;
  showHorizontalLines?: boolean;
  horizontalLineOpacity?: number;
  showVerticalLines?: boolean;
  verticalLineOpacity?: number;
  curve?: boolean;
  animated?: boolean;
  lineStrokeWidth?: number;
  legend?: boolean;
  x_label_renderer?: (item: T[keyof T]) => void;
  y_label_renderer?: (item: string) => void;
  lineGradient?: boolean;
}
