import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormSelectItem } from '../../models/form-select-item';

@Component({
  selector: 'app-form-select',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss'
})
export class FormSelect {
  @Input() label: string = '';
  @Input() items: FormSelectItem<any>[] = [];
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() required: boolean = false;

  value: string = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
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

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    let inputValue = input.value;

    const trimmedValue = inputValue.trimStart();
    if (trimmedValue !== inputValue) {
      inputValue = trimmedValue;
      input.value = inputValue;
    }

    this.value = inputValue;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
