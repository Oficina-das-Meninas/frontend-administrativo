import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { Donor } from '../models/donor';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiPagedResponse } from '../../../shared/models/api-response';
import { DonorFilters } from '../models/donor-filters';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  private readonly API_URL = `${environment.apiUrl}/donors`;
  private httpClient = inject(HttpClient);

  list(donorFilters: DonorFilters): Observable<DataPage<Donor>> {
    let params = new HttpParams();

    params = params.set('page', (donorFilters.page ?? 0).toString());
    params = params.set('pageSize', (donorFilters.pageSize ?? 10).toString());

    if (donorFilters.searchTerm?.trim()) {
      params = params.set('searchTerm', donorFilters.searchTerm.trim());
    }

    if (donorFilters.badge) {
      params = params.set('badge', donorFilters.badge);
    }

    if (donorFilters.sortField) {
      params = params.set('sortField', donorFilters.sortField);
    }

    if (donorFilters.sortDirection) {
      params = params.set('sortDirection', donorFilters.sortDirection);
    }

    return this.httpClient
      .get<ApiPagedResponse<Donor>>(this.API_URL, { params })
      .pipe(
        map((response) => ({
          data: response.data.contents,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }))
      );
  }
}
