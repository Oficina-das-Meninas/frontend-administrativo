import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EventFilters } from '../models/event-filters';
import { toLocalDate } from '../../../shared/components/utils/date-utils';
import { ImageService } from '../../../shared/services/image-service';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { Event } from '../models/event';

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
      .get<DataPage<Event>>(this.API_URL, { params })
      .pipe(
        map((eventPage: DataPage<Event>) => ({
          ...eventPage,
          data: eventPage.data.map(ev => ({
            ...ev,
            previewImageUrl: this.imageService.getPubImage((ev as any).previewImageUrl)
          }))
        }))
      );
  }

  create(eventData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, eventData);
  }

  getById(eventId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}/${eventId}`).pipe(
      map((event) => ({
        ...event,
        previewImageUrl: this.imageService.getPubImage((event).previewImageUrl),
        partnersImageUrl: this.imageService.getPubImage((event).partnersImageUrl),
      }))
    );
  }

  update(eventId: string, eventData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${eventId}`, eventData);
  }
}
