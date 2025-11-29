import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { toLocalDate } from '../../../shared/components/utils/date-utils';
import { ImageService } from '../../../shared/services/image-service';
import { EventFilters } from '../models/event-filters';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { Event } from '../models/event';
import { ApiPagedResponse } from '../../../shared/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly API_URL = `${environment.apiUrl}/events`;
  private httpClient = inject(HttpClient);
  private imageService = inject(ImageService);

  list(page: number, size: number): Observable<DataPage<Event>> {
    return this.getFilteredEvents({
      page,
      pageSize: size
    });
  }

  getFilteredEvents(filters: EventFilters): Observable<DataPage<Event>> {
    let params = new HttpParams();

    params = params.set('page', (filters.page ?? 0).toString());
    params = params.set('pageSize', (filters.pageSize ?? 10).toString());

    if (filters.searchTerm?.trim()) {
      params = params.set('searchTerm', filters.searchTerm.trim());
    }

    if (filters.startDate) {
      params = params.set('startDate', toLocalDate(filters.startDate));
    }
    if (filters.endDate) {
      params = params.set('endDate', toLocalDate(filters.endDate));
    }

    return this.httpClient
      .get<ApiPagedResponse<Event>>(this.API_URL, { params, withCredentials: true })
      .pipe(
        map((resp) => {
          const contents = resp.data?.contents ?? [];

          const mapped = contents.map((ev: Event) => ({
            ...ev,
            previewImageUrl: this.imageService.getPubImage(ev.previewImageUrl)
          }));

          return {
            data: mapped,
            totalElements: resp.data?.totalElements ?? 0,
            totalPages: resp.data?.totalPages ?? 0
          } as DataPage<Event>;
        })
      );
  }

  create(eventData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, eventData, { withCredentials: true });
  }

  getById(eventId: string): Observable<Event> {
    return this.httpClient.get<ApiPagedResponse<Event>>(`${this.API_URL}/${eventId}`, { withCredentials: true }).pipe(
      map((resp) => {
        const ev = resp.data as unknown as Event;
        return {
          ...ev,
          previewImageUrl: this.imageService.getPubImage(ev.previewImageUrl),
          partnersImageUrl: this.imageService.getPubImage(ev?.partnersImageUrl),
        } as Event;
      })
    );
  }

  update(eventId: string, eventData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${eventId}`, eventData, { withCredentials: true });
  }

  delete(eventId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${eventId}`);
  }
}
