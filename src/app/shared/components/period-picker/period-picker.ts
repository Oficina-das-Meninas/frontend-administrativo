import { Component, Output, EventEmitter } from '@angular/core';
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
export class PeriodPicker {
  @Output() dateRangeSelected = new EventEmitter<DateRange>();

  dateForm: FormGroup;
  isOpen = false;
  selectedPeriod = 'Últimos 30 dias';

  constructor() {
    this.dateForm = new FormGroup({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
    });
    this.initializeDefaultPeriod();
  }

  private initializeDefaultPeriod() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

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

  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }

  closeDrawer() {
    this.isOpen = false;
  }

  selectPeriod(label: string, days: number) {
    this.selectedPeriod = label;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    this.dateRangeSelected.emit({
      startDate,
      endDate,
      label
    });
    this.isOpen = false;
  }

  applyCustom() {
    const startDate = this.dateForm.get('startDate')?.value;
    const endDate = this.dateForm.get('endDate')?.value;

    if (startDate && endDate) {
      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);
      this.selectedPeriod = `${formattedStartDate} - ${formattedEndDate}`;
      this.dateRangeSelected.emit({
        startDate,
        endDate,
        label: this.selectedPeriod
      });
      this.isOpen = false;
    }
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
