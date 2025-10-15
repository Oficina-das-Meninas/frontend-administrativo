import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { EventPage } from '../models/event-page';
import { environment } from '../../../../environments/environment';
import { EventFilters } from '../models/event-filters';
import { toLocalDate } from '../../../shared/components/utils/date-utils';
import { ImageService } from '../../../shared/services/image-service';

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
      .get<EventPage>(this.API_URL, { params })
      .pipe(
        map((eventPage: EventPage) => ({
          ...eventPage,
          data: eventPage.data.map(ev => ({
            ...ev,
            previewImageUrl: this.imageService.getPubImage(ev.previewImageUrl)
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
        previewImageUrl: this.imageService.getPubImage(event.previewImageUrl),
        partnersImageUrl: this.imageService.getPubImage(event.partnersImageUrl),
      }))
    );
  }

  update(eventId: string, eventData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${eventId}`, eventData);
  }
}
