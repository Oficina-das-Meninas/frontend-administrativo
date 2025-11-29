import { Component, Output, EventEmitter, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DatePickerComponent } from '../../../domain/events/components/date-picker/date-picker';
import { CustomDateAdapter, BR_DATE_FORMATS } from '../../../domain/events/components/date-picker/date-picker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

@Component({
  selector: 'app-period-picker',
  templateUrl: './period-picker.html',
  styleUrls: ['./period-picker.scss'],
  imports: [ReactiveFormsModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatInputModule,
            MatFormFieldModule,
            MatIconModule,
            MatButtonModule,
            MatSidenavModule,
            DatePickerComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: BR_DATE_FORMATS }
  ]
})
export class PeriodPicker implements OnInit, OnDestroy {
  @Output() dateRangeSelected = new EventEmitter<DateRange>();
  @Input() excludePeriods: string[] = [];

  dateForm: FormGroup;
  isOpen = false;
  selectedPeriod = 'Últimos 30 dias';
  private destroy$ = new Subject<void>();
  private periodFilterService?: any;

  constructor() {
    this.dateForm = new FormGroup({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
    });
    this.initializeDefaultPeriod();

    try {
      this.periodFilterService = inject(this.periodFilterService);
      this.periodFilterService.periodFilter$
        .pipe(takeUntil(this.destroy$))
        .subscribe((range: DateRange) => {
          this.selectedPeriod = range.label;
          this.dateForm.patchValue({
            startDate: range.startDate,
            endDate: range.endDate
          });
        });
    } catch (e) {

    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDefaultPeriod() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    this.currentStartDate = startDate;
    this.currentEndDate = endDate;

    this.dateRangeSelected.emit({
      startDate,
      endDate,
      label: 'Últimos 30 dias'
    });
  }

  get startDate(): FormControl {
    return this.dateForm.get('startDate') as FormControl;
  }

  get endDate(): FormControl {
    return this.dateForm.get('endDate') as FormControl;
  }

  periods = [
    { label: 'Hoje', days: 0 },
    { label: 'Ontem', days: 1 },
    { label: 'Últimos 7 dias', days: 7 },
    { label: 'Últimos 30 dias', days: 30 },
    { label: 'Últimos 90 dias', days: 90 }
  ];

  private tempSelectedDays = 0;
  private tempSelectedLabel = '';
  private currentStartDate: Date | null = null;
  private currentEndDate: Date | null = null;

  toggleDrawer() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.currentStartDate && this.currentEndDate) {
      this.dateForm.patchValue({
        startDate: this.currentStartDate,
        endDate: this.currentEndDate
      });
    }
  }

  closeDrawer() {
    this.isOpen = false;
    this.tempSelectedDays = 0;
    this.tempSelectedLabel = '';
  }

  selectPeriod(label: string, days: number) {
    this.tempSelectedLabel = label;
    this.tempSelectedDays = days;
    this.selectedPeriod = label;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    this.currentStartDate = startDate;
    this.currentEndDate = endDate;

    this.dateForm.patchValue({
      startDate,
      endDate
    });
  }

  applyCustom() {
    const startDate = this.dateForm.get('startDate')?.value;
    const endDate = this.dateForm.get('endDate')?.value;

    if (startDate && endDate) {
      let label = this.tempSelectedLabel;

      if (!label) {
        const formattedStartDate = this.formatDate(startDate);
        const formattedEndDate = this.formatDate(endDate);
        label = `${formattedStartDate} - ${formattedEndDate}`;
      }

      this.selectedPeriod = label;

      this.currentStartDate = startDate;
      this.currentEndDate = endDate;

      const range: DateRange = {
        startDate,
        endDate,
        label
      };

      this.dateRangeSelected.emit(range);
      if (this.periodFilterService) {
        this.periodFilterService.emitPeriodFilter(range);
      }
      this.isOpen = false;
      this.tempSelectedDays = 0;
      this.tempSelectedLabel = '';
    }
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
