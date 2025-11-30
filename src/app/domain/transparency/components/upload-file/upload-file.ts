import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, Input, Optional, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-upload-file',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './upload-file.html',
  styleUrl: './upload-file.scss',
})
export class UploadFile implements ControlValueAccessor, AfterViewChecked {
  @Input() label: string = 'Arquivo';
  @Input() placeholder: string = 'Selecione um arquivo';
  @Input() accept: string = '.pdf,.jpg,.jpeg,.png';
  @Input() icon: string = 'attach_file';
  @Input() hint?: string;
  @Input() errorMessage?: string;

  fileName: string = '';
  disabled = false;
  invalidFileType = false;

  private onChange: (file: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  private renderer = inject(Renderer2);
  private host = inject(ElementRef);

  constructor(
    @Optional() @Self() public ngControl: NgControl | null
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewChecked(): void {
    const wrapper: HTMLElement | null = this.host.nativeElement.querySelector(
      '.mat-mdc-text-field-wrapper.mdc-text-field'
    );

    if (!wrapper) return;

    if (this.shouldShowError) {
      this.renderer.addClass(wrapper, 'mdc-text-field--invalid');
    } else {
      this.renderer.removeClass(wrapper, 'mdc-text-field--invalid');
    }
  }

  writeValue(file: File | null): void {
    this.fileName = file?.name || '';
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const allowedTypes = this.accept
      .split(',')
      .map(ext => ext.trim().toLowerCase().replace('.', ''));

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    this.invalidFileType = !allowedTypes.includes(fileExt);

    if (this.invalidFileType) {
      this.fileName = '';
      this.onChange(null);
      return;
    }

    this.fileName = file.name;
    this.onChange(file);
    this.onTouched();
  }

  openFilePicker(fileInput: HTMLInputElement): void {
    if (!this.disabled) {
      fileInput.click();
    }
  }

  get shouldShowError(): boolean {
    const control = !!(this.ngControl?.invalid && this.ngControl?.touched);
    return this.invalidFileType || control;
  }

}
