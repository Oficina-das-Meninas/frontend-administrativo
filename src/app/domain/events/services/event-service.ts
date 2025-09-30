import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { EventPage } from '../models/event-page';
import { environment } from '../../../../environments/environment';

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
}
