import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { ItemCard } from '../../../../shared/components/item-card/item-card';
import { DateRange } from '../../../../shared/models/date-range';
import { EventFilters } from '../../models/event-filters';
import { EventPage } from '../../models/event-page';
import { EventService } from '../../services/event-service';

@Component({
  selector: 'app-events',
  imports: [DataTable, ItemCard],
  templateUrl: './events.html'
})
export class Events implements OnInit {
  events$: Observable<EventPage> | null = null;

  columns: TableColumn[] = [
    { key: 'title', header: 'Título', type: 'text' },
    { key: 'eventDate', header: 'Data', type: 'date' },
    { key: 'location', header: 'Local', type: 'text' }
  ];

  searchTerm = '';
  currentFilters: EventFilters = {};
  pageIndex = 0;
  pageSize = 10;

  eventService = inject(EventService);

  ngOnInit() {
    this.loadEventsWithFilters();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadEventsWithFilters();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadEventsWithFilters();
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadEventsWithFilters();
  }

  onDateFilter(dateRange: DateRange) {
    this.currentFilters.startDate = dateRange.start || undefined;
    this.currentFilters.endDate = dateRange.end || undefined;
    this.pageIndex = 0;
    this.loadEventsWithFilters();
  }

  onClearFilters() {
    this.searchTerm = '';
    this.currentFilters = {};
    this.pageIndex = 0;
    this.loadEventsWithFilters();
  }

  private loadEventsWithFilters() {
    this.currentFilters = {
      ...this.currentFilters,
      page: this.pageIndex,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined
    };

    this.events$ = this.eventService.getFilteredEvents(this.currentFilters);
  }
}
