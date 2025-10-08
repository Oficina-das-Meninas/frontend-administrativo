import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EventPage } from '../models/event-page';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly API_URL = `${environment.apiUrl}/events`;
  private httpClient = inject(HttpClient);
  private readonly BUCKET_URL = `${environment.bucketUrl}/`;

  list(page: number, size: number): Observable<EventPage> {
    return this.httpClient
      .get<EventPage>(this.API_URL, {
        params: {
          page: page,
          pageSize: size,
        },
      })
      .pipe(
        map((eventPage: EventPage) => ({
          ...eventPage,
          data: eventPage.data.map(ev => ({
            ...ev,
            previewImageUrl: ev.previewImageUrl
              ? this.BUCKET_URL + ev.previewImageUrl
              : ''
          }))
        }))
      );
  }

  create(eventData: FormData): Observable<void> {
    return this.httpClient.post<void>(this.API_URL, eventData);
  }

  update(eventId: string, eventData: FormData): Observable<void> {
    return this.httpClient.put<void>(`${this.API_URL}/${eventId}`, eventData);
  }
}
