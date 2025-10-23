import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ImageService } from '../../../shared/services/image-service';
import { Event } from '../models/event';
import { EventService } from '../services/event-service';

export const eventResolver: ResolveFn<Event | Record<string, unknown>> = (route, state) => {
  const eventService = inject(EventService);
  const imageService = inject(ImageService);

  if (route.params && route.params['id']) {
    return eventService.getById(route.params['id']).pipe(
      switchMap(async event => {
        const validatedEvent = await imageService.validateImages({
          previewImageUrl: event.previewImageUrl,
          partnersImageUrl: event.partnersImageUrl,
        });
        return { ...event, ...validatedEvent };
      })
    );
  }
  return of({
    id: '',
    title: '',
    description: '',
    eventDate: new Date(),
    location: '',
    urlToPlatform: '',
    previewImageUrl: '',
    partnersImageUrl: '',
  });
};
