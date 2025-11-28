import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
  totalDonations: number;
  averageDonationValue: number;
  totalDonors: number;
  activeSponsorships: number;
}

export interface IndicatorsResponse {
  data: IndicatorsData;
  date: string;
}

export interface DonationTypeDistributionResponse {
  data: DonationDistributionData;
  date: string;
}

export interface DonationTimeSeriesItem {
  period: string;
  value: number;
}

export interface DonationTimeSeriesData {
  oneTimeDonations: DonationTimeSeriesItem[];
  recurringDonations: DonationTimeSeriesItem[];
}

export interface DonationTimeSeriesResponse {
  data: DonationTimeSeriesData;
  date: string;
}

export interface DonationDistributionData {
  oneTimeDonation: number;
  recurringDonation: number;
  totalDonations: number;
}

export interface DonationTypeDistributionResponseWrapper {
  data: DonationDistributionData;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/statistics`;
  private httpClient = inject(HttpClient);

  getIndicators(startDate?: string, endDate?: string): Observable<IndicatorsResponse> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.httpClient.get<IndicatorsResponse>(`${this.API_URL}/indicators`, { params });
  }

  getDonationTypeDistribution(startDate?: string, endDate?: string): Observable<DonationTypeDistributionResponse> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.httpClient.get<DonationTypeDistributionResponse>(`${this.API_URL}/donations/distribution`, { params });
  }

  getDonationsByPeriod(startDate: string, endDate: string, groupBy: 'month' | 'day' = 'month'): Observable<DonationTimeSeriesResponse> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('groupBy', groupBy);

    return this.httpClient.get<DonationTimeSeriesResponse>(`${this.API_URL}/donations`, { params });
  }
}
