export interface IndicatorData {
  title: string;
  value: number;
  valueLiquid: number;
  valueType: 'number' | 'currency';
  tooltipText?: string;
}

export interface DonationData {
  period: string;
  oneTime: number;
  oneTimeLiquid: number;
  recurring: number;
  recurringLiquid: number;
}

export interface DonationDistribution {
  oneTime: number;
  oneTimeLiquid: number;
  recurring: number;
  recurringLiquid: number;
  total: number;
  totalLiquid: number;
}
