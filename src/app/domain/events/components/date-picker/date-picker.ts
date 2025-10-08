import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule
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
        this.onChange(value as any);
        this.onTouched();
        return;
      }

      const date = new Date(year, month, day);

      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        this.value = date;
        this.onChange(date);
      } else {
        this.value = null;
        this.onChange(value as any);
        this.onTouched();
      }
    } else if (value.length > 0) {
      this.value = null;
      this.onChange(value as any);
    } else {
      this.value = null;
      this.onChange(null);
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
