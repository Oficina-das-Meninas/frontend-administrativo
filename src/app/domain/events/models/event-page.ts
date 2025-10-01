import { Event } from "./event";

export interface EventPage {
  data: Event[];
  totalElements: number;
  totalPages: number;
}
