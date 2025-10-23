import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../shared/services/image-service';
import { Partner } from '../models/partner';
import { PartnerPage } from '../models/partner-page';

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

  list(page: number, size: number): Observable<PartnerPage> {
    return this.getFilteredPartners({
      page,
      pageSize: size
    });
  }

  getFilteredPartners(filters: PartnerFilters): Observable<PartnerPage> {
    let params = new HttpParams();

    params = params.set('page', (filters.page ?? 0).toString());
    params = params.set('pageSize', (filters.pageSize ?? 10).toString());

    if (filters.searchTerm?.trim()) {
      params = params.set('searchTerm', filters.searchTerm!.trim());
    }

    return this.httpClient
      .get<PartnerPage>(this.API_URL, { params })
      .pipe(
        map((partnerPage: PartnerPage) => ({
          ...partnerPage,
          data: partnerPage.data.map(partner => ({
            ...partner,
            logoUrl: this.imageService.getPubImage(partner.previewImageUrl)
          }))
        }))
      );
  }

  create(partnerData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, partnerData);
  }

  getById(partnerId: string): Observable<Partner> {
    return this.httpClient.get<Partner>(`${this.API_URL}/${partnerId}`).pipe(
      map((partner) => ({
        ...partner,
        logoUrl: this.imageService.getPubImage(partner.previewImageUrl),
      }))
    );
  }

  update(partnerId: string, partnerData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${partnerId}`, partnerData);
  }

  delete(partnerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${partnerId}`);
  }
}
