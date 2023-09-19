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
