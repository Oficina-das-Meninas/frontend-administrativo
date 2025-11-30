import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DonationTimeSeriesResponse,
  DonationTypeDistributionResponse,
  IndicatorsResponse
} from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/statistics`;
  private httpClient = inject(HttpClient);

  getIndicators(
    startDate?: string,
    endDate?: string
  ): Observable<IndicatorsResponse> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.httpClient.get<IndicatorsResponse>(
      `${this.API_URL}/indicators`,
      { params, withCredentials: true }
    );
  }

  getDonationTypeDistribution(
    startDate?: string,
    endDate?: string
  ): Observable<DonationTypeDistributionResponse> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.httpClient.get<DonationTypeDistributionResponse>(
      `${this.API_URL}/donations/distribution`,
      { params, withCredentials: true }
    );
  }

  getDonationsByPeriod(
    startDate: string,
    endDate: string,
    groupBy: 'month' | 'day' = 'month'
  ): Observable<DonationTimeSeriesResponse> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('groupBy', groupBy);

    return this.httpClient.get<DonationTimeSeriesResponse>(
      `${this.API_URL}/donations`,
      { params, withCredentials: true }
    );
  }
}
