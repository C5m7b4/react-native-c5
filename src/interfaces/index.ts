import { TextAnchor } from 'src/types';

export interface AxisConfig {
  fill?: string;
  fontColor?: string;
  fontSize?: number;
  fontWeight?: string;
  rotation?: number;
  textAnchor?: TextAnchor;
}

export interface IStop {
  offset: number;
  stopColor: string;
  stopOpacity: number;
}

export interface ILinearGradient {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stop1?: IStop;
  stop2?: IStop;
  stop3?: IStop;
  stop4?: IStop;
}

export interface ILineTooltipConfig {
  tooltipHeight: number;
  tooltipWidth: number;
  tooltipFill: string;
  tooltipBorderRadius: number;
  fontSize: number;
  fontWeight: string;
  textAnchor: TextAnchor;
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
