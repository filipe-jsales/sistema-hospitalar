export type PeriodType = 'Todos' | 'Último mês' | 'Últimos 3 meses' | 'Últimos 6 meses' | 'Último ano';

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartData extends ChartData {
  percentage: number;
}

export interface Incident {
  description: string;
  classification?: string;
  theme?: string;
  date?: string;
  status?: string;
}

export interface Notification {
  id: number;
  date: string;
  description: string;
  status: string;
  classification: string;
}

export const COLORS = {
  primary: '#00B8D4',
  secondary: '#00E5CF',
  warning: '#FFC107',
  danger: '#FF5722',
  success: '#4CAF50',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  darkGray: '#424242'
};

export const PERIODS: PeriodType[] = [
  'Todos',
  'Último mês',
  'Últimos 3 meses',
  'Últimos 6 meses',
  'Último ano'
];