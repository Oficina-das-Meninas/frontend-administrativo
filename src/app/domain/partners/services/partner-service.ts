import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../shared/services/image-service';
import { Partner } from '../models/partner';
import { PartnerResponse } from '../models/partner-response';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { ApiPagedResponse } from '../../../shared/models/api-response';

export interface PartnerFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private readonly API_URL = `${environment.apiUrl}/partners`;
  private httpClient = inject(HttpClient);
  private imageService = inject(ImageService);

  list(page: number, size: number): Observable<DataPage<Partner>> {
    return this.getFilteredPartners({
      page,
      pageSize: size
    });
  }

  getFilteredPartners(filters: PartnerFilters): Observable<DataPage<Partner>> {
    let params = new HttpParams();

    params = params.set('page', (filters.page ?? 0).toString());
    params = params.set('pageSize', (filters.pageSize ?? 10).toString());

    if (filters.searchTerm?.trim()) {
      params = params.set('searchTerm', filters.searchTerm!.trim());
    }

    return this.httpClient
      .get<ApiPagedResponse<Partner>>(this.API_URL, { params, withCredentials: true })
      .pipe(
        map((resp) => {
          const contents = resp.data?.contents ?? [];

          const mapped = contents.map((partner: Partner) => ({
            ...partner,
            previewImageUrl: this.imageService.getPubImage(partner.previewImageUrl)
          }));

          return {
            data: mapped,
            totalElements: resp.data?.totalElements ?? 0,
            totalPages: resp.data?.totalPages ?? 0
          } as DataPage<Partner>;
        })
      );
  }

  create(partnerData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, partnerData, { withCredentials: true });
  }

  getById(partnerId: string): Observable<Partner> {
    return this.httpClient.get<PartnerResponse>(`${this.API_URL}/${partnerId}`, { withCredentials: true }).pipe(
      map((response) => ({
        ...response.data,
        previewImageUrl: this.imageService.getPubImage(response.data.previewImageUrl)
      }))
    );
  }

  update(partnerId: string, partnerData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${partnerId}`, partnerData, { withCredentials: true });
  }

  delete(partnerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${partnerId}`, { withCredentials: true });
  }
}

