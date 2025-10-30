import { Event } from './event';

export interface EventListResponse {
  data: {
    contents: Event[];
    totalElements: number;
    totalPages: number;
  };
  date: Date;
}
