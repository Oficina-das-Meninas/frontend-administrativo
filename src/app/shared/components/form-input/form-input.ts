import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Optional, Output, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrls: ['./form-input.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormInputComponent implements ControlValueAccessor {

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() type: string = 'text';
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() rows?: number;
  @Input() multiline: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;

  value: string = '';
  disabled = false;
  inputTypeForPassword: 'password' | 'text' = 'password';

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

  get inputType(): string {
    if (this.type === 'password') {
      return this.inputTypeForPassword;
    }
    return this.type;
  }

  get passwordIcon(): string {
    if (this.inputTypeForPassword === 'password') {
      return 'visibility_off';
    }
    return 'visibility';
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

  togglePassword(): void {
    if (this.inputTypeForPassword === 'password') {
      this.inputTypeForPassword = 'text';
      return;
    }
    this.inputTypeForPassword = 'password';
  }

}
