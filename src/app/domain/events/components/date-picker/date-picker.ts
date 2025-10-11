import { Component, Injectable, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
            return date;
          }
        }
      }
    }
    return null;
  }

  override format(date: Date, displayFormat: Object): string {
    if (!date) {
      return '';
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export const BR_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, ReactiveFormsModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: BR_DATE_FORMATS },
  ],
  templateUrl: './date-picker.html',
  styleUrls: ['./date-picker.scss'],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = 'Data';
  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() errorMessage: string = '';
  @Input() showError: boolean = false;

  value: Date | null = null;
  disabled = false;
  hasInvalidInput = false;

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl | null) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  get formControl(): FormControl | null {
    return this.ngControl?.control as FormControl | null;
  }

  get shouldShowError(): boolean {
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  get displayError(): string {
    if (!this.shouldShowError) {
      return '';
    }

    if (this.hasInvalidInput) {
      return 'Data inválida';
    }

    if (this.ngControl?.errors?.['matDatepickerParse']) {
      return 'Data inválida';
    }

    if (this.ngControl?.errors?.['required']) {
      return this.errorMessage || 'Campo obrigatório';
    }

    return this.errorMessage;
  }

  writeValue(value: Date | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateChange(date: Date | null): void {
    this.value = date;
    this.onChange(date);
    this.onTouched();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.trimStart();

    let value = rawValue.replace(/\D/g, '').substring(0, 8);

    value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    value = value.replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');

    input.value = value;

    if (value.length === 10) {
      const parts = value.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1000) {
        this.value = null;
        this.hasInvalidInput = true;
        this.onChange(null);
        return;
      }

      const date = new Date(year, month, day);

      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        this.value = date;
        this.hasInvalidInput = false;
        this.onChange(date);
      } else {
        this.value = null;
        this.hasInvalidInput = true;
        this.onChange(null);
      }
    } else if (value.length > 0) {
      this.value = null;
      this.hasInvalidInput = false;
      this.onChange(null);
    } else {
      this.value = null;
      this.hasInvalidInput = false;
      this.onChange(null);
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
