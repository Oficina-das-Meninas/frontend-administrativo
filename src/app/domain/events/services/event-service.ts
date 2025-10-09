import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../shared/services/image-service';
import { EventPage } from '../models/event-page';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly API_URL = `${environment.apiUrl}/events`;
  private httpClient = inject(HttpClient);
  private imageService = inject(ImageService);

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
