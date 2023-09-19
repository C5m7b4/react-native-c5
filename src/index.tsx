import { BasicChart, LineChart } from './charts';
import { BasicChartProps, BasicChartState, TextAnchor } from './types';
import {
  AxisConfig,
  ILinearGradient,
  ILineTooltipConfig,
  IStop,
  LineChartProps,
} from './interfaces';
import { quickSort, newShade } from './utils';

export const multiply = (a: number, b: number) => a * b;

export {
  AxisConfig,
  BasicChart,
  BasicChartProps,
  BasicChartState,
  ILinearGradient,
  ILineTooltipConfig,
  IStop,
  LineChart,
  LineChartProps,
  TextAnchor,
};
export { quickSort, newShade };
