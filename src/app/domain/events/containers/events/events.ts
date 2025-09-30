import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catchError, Observable, of, tap } from 'rxjs';
import { EventPage } from '../../models/event-page';
import { EventService } from '../../services/event-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarFilter } from '../../../../shared/components/calendar-filter/calendar-filter';
import { DateRange } from '../../../../shared/models/date-range';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-events',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    AsyncPipe,
    MatProgressSpinner,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    CalendarFilter,
    MatTooltipModule,
    MatButtonToggleModule
  ],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  events$: Observable<EventPage> | null = null;

  private eventService = inject(EventService);

  pageIndex = 0;
  pageSize = 10;
  viewMode: 'cards' | 'table' = 'cards';
  isMobile = false;

  displayedColumns: string[] = ['imagem', 'nome', 'data', 'local', 'acoes'];

  dateRange: DateRange = {
    start: null,
    end: null,
  };

  ngOnInit() {
    this.checkScreenSize();
    this.setDefaultViewMode();
    this.refresh();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.setDefaultViewMode();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  private setDefaultViewMode() {
    if (this.isMobile) {
      this.viewMode = 'cards';
    } else {
      this.viewMode = 'table';
    }
  }

  onViewModeChange(newViewMode: 'cards' | 'table') {
    this.viewMode = newViewMode;
  }

  applyFilter($event: KeyboardEvent) {
    console.log('Filter applied:', ($event.target as HTMLInputElement).value);
  }

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.events$ = this.eventService
      .list(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap(() => this.updatePagination(pageEvent)),
        catchError(() => this.emptyEventPage())
      );
  }

  private updatePagination(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
  }

  private emptyEventPage() {
    return of({ data: [], totalElements: 0, totalPages: 0 });
  }

  applyDateFilter() {
    if (this.dateRange.start && this.dateRange.end) {
      this.pageIndex = 0;
      this.refresh();
    }
  }

  clearFilters() {
    this.dateRange.start = null;
    this.dateRange.end = null;
    this.pageIndex = 0;
    this.refresh();
  }
}
