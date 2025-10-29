import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { toLocalDate } from '../../../shared/components/utils/date-utils';
import { ImageService } from '../../../shared/services/image-service';
import { Event } from '../models/event';
import { EventFilters } from '../models/event-filters';
import { EventListResponse } from '../models/event-list-response';
import { EventPage } from '../models/event-page';
import { EventResponse } from '../models/event-response';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly API_URL = `${environment.apiUrl}/events`;
  private httpClient = inject(HttpClient);
  private imageService = inject(ImageService);

  list(page: number, size: number): Observable<EventPage> {
    return this.getFilteredEvents({
      page,
      pageSize: size
    });
  }

  getFilteredEvents(filters: EventFilters): Observable<EventPage> {
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
      .get<EventListResponse>(this.API_URL, { params })
      .pipe(
        map((eventPage: EventListResponse) => {
          const items = eventPage.data.data;

          const mappedItems = items.map((ev: any) => ({
            ...ev,
            previewImageUrl: this.imageService.getPubImage(ev.previewImageUrl)
          }));

          return {
            data: mappedItems,
            totalElements: eventPage.data.totalElements,
            totalPages: eventPage.data.totalPages,
          } as EventPage;
        })
      );
  }

  create(eventData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, eventData);
  }

  getById(eventId: string): Observable<Event> {
    return this.httpClient.get<EventResponse>(`${this.API_URL}/${eventId}`).pipe(
      map((res: EventResponse) => {
        const event = res.data;
        return {
          ...event,
          previewImageUrl: this.imageService.getPubImage(event?.previewImageUrl),
          partnersImageUrl: this.imageService.getPubImage(event?.partnersImageUrl),
        } as Event;
      })
    );
  }

  update(eventId: string, eventData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${eventId}`, eventData);
  }
}
