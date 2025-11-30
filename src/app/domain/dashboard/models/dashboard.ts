export interface TimeSeriesFilters {
  startDate: string;
  endDate: string;
  groupBy?: 'month' | 'day';
}

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
}

export interface IndicatorsData {
  totalDonation: number;
  totalDonationLiquid: number;
  averageDonation: number;
  averageDonationLiquid: number;
  totalDonors: number;
  activeSponsorships: number;
}

export interface IndicatorsResponse {
  data: IndicatorsData;
  date: string;
}

export interface DonationDistributionData {
  oneTimeDonation: number;
  oneTimeDonationLiquid: number;
  recurringDonation: number;
  recurringDonationLiquid: number;
  totalDonation: number;
  totalDonationLiquid: number;
}

export interface DonationTypeDistributionResponse {
  data: DonationDistributionData;
  date: string;
}

export interface DonationTimeSeriesItem {
  period: string;
  value: number;
  valueLiquid: number;
}

export interface DonationTimeSeriesData {
  oneTimeDonations: DonationTimeSeriesItem[];
  recurringDonations: DonationTimeSeriesItem[];
}

export interface DonationTimeSeriesResponse {
  data: DonationTimeSeriesData;
  date: string;
}
