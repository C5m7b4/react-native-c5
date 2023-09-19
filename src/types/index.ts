export type TextAnchor = 'start' | 'middle' | 'end';
import { ILinearGradient, AxisConfig } from '../interfaces';

export type BasicChartProps<T, K> = K & {
  backgroundBorderRadius?: number;
  backgroundColor?: string;
  axisCircleFillColor?: string;
  axisCircleOpacity?: number;
  axisCircleRadius?: number;
  axisCircleStrokeColor?: string;
  axisColor?: string;
  axisStrokeWidth?: number;
  data: T[];
  gradient_background_config?: ILinearGradient;
  height?: number;
  horizontalLineOpacity?: number;
  margin?: number;
  onPressItem?: (item: T) => void;
  showHorizontalLines?: boolean;
  showVerticalLines?: boolean;
  svgBackgroundColor?: string;
  useGradientBackground?: boolean;
  verticalLineOpacity?: number;
  width?: number;
  x_axis_config?: AxisConfig;
  x_key: keyof T;
  x_label_renderer?: (item: T) => React.ReactNode;
  y_axis_config?: AxisConfig;
  y_key: keyof T;
  y_label_renderer?: (item: string) => React.ReactNode;
};

export type BasicChartState<T> = {
  data: T[];
  margin: number;
  x_key: keyof T;
  y_key: keyof T;
  yAxisLabels: number[];
  containerHeight: number;
  containerWidth: number;
};
