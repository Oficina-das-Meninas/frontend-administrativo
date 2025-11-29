import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateRange } from '../../models/date-range';

@Component({
  selector: 'app-calendar-filter',
  imports: [
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './calendar-filter.html',
  styleUrl: './calendar-filter.scss',
})
export class CalendarFilter {
  @Input() dateRange: DateRange = { start: null, end: null };
  @Input() tooltipText = 'Filtrar por data';

  @Output() dateRangeChange = new EventEmitter<DateRange>();
  @Output() apply = new EventEmitter<DateRange>();
  @Output() clear = new EventEmitter<void>();
  @Output() dateRangeSelected = new EventEmitter<DateRange>();

  onClearDateFilter(): void {
    this.dateRange = { start: null, end: null };
    this.dateRangeChange.emit(this.dateRange);
    this.clear.emit();
  }

  onApplyDateFilter(): void {
    this.dateRangeChange.emit(this.dateRange);
    this.apply.emit(this.dateRange);
    this.dateRangeSelected.emit(this.dateRange);
  }

  onDateRangeChanged(): void {
    this.dateRangeChange.emit(this.dateRange);
  }

  hasDateFilter(): boolean {
    return !!(this.dateRange.start || this.dateRange.end);
  }
}
