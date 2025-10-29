import { Event } from './event';

export interface EventListResponse {
  data: {
    data: Event[];
    totalElements: number;
    totalPages: number;
  };
  date: Date;
}
