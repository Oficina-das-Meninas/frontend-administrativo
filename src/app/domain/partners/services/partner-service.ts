import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
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

  private mockPartners: Partner[] = [
    {
      id: '1',
      name: 'Tech Solutions',
      logoUrl: 'https://via.placeholder.com/300x200?text=Tech+Solutions'
    },
    {
      id: '2',
      name: 'Green Energy Co',
      logoUrl: 'https://via.placeholder.com/300x200?text=Green+Energy'
    },
    {
      id: '3',
      name: 'Digital Innovation',
      logoUrl: 'https://via.placeholder.com/300x200?text=Digital+Innovation'
    }
  ];

  list(page: number, size: number): Observable<PartnerPage> {
    return this.getFilteredPartners({
      page,
      pageSize: size
    });
  }

  getFilteredPartners(filters: PartnerFilters): Observable<PartnerPage> {
    // Uncomment the line below to use mock data for testing
    return this.getMockPartners(filters);

    /* Uncomment below to use real API
    let params = new HttpParams();

    params = params.set('page', (filters.page ?? 0).toString());
    params = params.set('pageSize', (filters.pageSize ?? 10).toString());

    if (filters.searchTerm?.trim()) {
      params = params.set('searchTerm', filters.searchTerm.trim());
    }

    return this.httpClient
      .get<PartnerPage>(this.API_URL, { params })
      .pipe(
        map((partnerPage: PartnerPage) => ({
          ...partnerPage,
          data: partnerPage.data.map(partner => ({
            ...partner,
            logoUrl: this.imageService.getPubImage(partner.logoUrl)
          }))
        }))
      );
    */
  }

  private getMockPartners(filters: PartnerFilters): Observable<PartnerPage> {
    const page = filters.page ?? 0;
    const pageSize = filters.pageSize ?? 10;
    const searchTerm = filters.searchTerm?.toLowerCase() ?? '';

    let filtered = this.mockPartners;

    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm)
      );
    }

    const startIndex = page * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return of({
      data: paginatedData,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize)
    });
  }

  create(partnerData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, partnerData);
  }

  getById(partnerId: string): Observable<Partner> {
    return this.httpClient.get<Partner>(`${this.API_URL}/${partnerId}`).pipe(
      map((partner) => ({
        ...partner,
        logoUrl: this.imageService.getPubImage(partner.logoUrl),
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
