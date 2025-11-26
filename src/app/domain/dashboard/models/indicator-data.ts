export interface IndicatorData {
  title: string;
  value: number;
  valueType: 'number' | 'currency';
}

export interface DonationData {
  period: string;
  oneTime: number;
  recurring: number;
}

export interface DonationDistribution {
  oneTime: number;
  recurring: number;
  total: number;
}
