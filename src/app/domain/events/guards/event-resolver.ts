import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { Event } from '../models/event';
import { EventService } from '../services/event-service';

export const eventResolver: ResolveFn<Event | Record<string, unknown>> = (route, state) => {
  const eventService = inject(EventService);

  if (route.params && route.params['id']) {
    return eventService.getById(route.params['id']);
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
