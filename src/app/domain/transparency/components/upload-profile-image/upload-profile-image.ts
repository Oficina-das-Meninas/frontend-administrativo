import { Component, ElementRef, forwardRef, input, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ProfileImage } from '../../models/upload-profile-image/upload-profile-image';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-profile-image',
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadProfileImage),
      multi: true
    }
  ],
  templateUrl: './upload-profile-image.html',
  styleUrl: './upload-profile-image.scss'
})
export class UploadProfileImage implements ControlValueAccessor, OnDestroy {

  size = input<string>('');
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  image: ProfileImage = { file: null, previewUrl: null };
  dragging: boolean = false;
  errorFile: boolean = false;
  errorSize: boolean = false;

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: File | string | null): void {
    if (value instanceof File) {
      this.setFile(value);
    } else if (typeof value === 'string' && value.trim()) {
      this.setPreview(value);
    } else {
      this.clearImage();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
      input.value = '';
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;

    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnter(): void {
    this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    if (!event.relatedTarget || !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
      this.dragging = false;
    }
  }

  triggerFileInput(): void {  
    this.fileInputRef?.nativeElement.click();
  }

  removeImage(): void {
    this.clearImage();

    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }

    this.revokePreviewUrl();
    this.onChange(null);
    this.onTouched();
  }

  private handleFile(file: File): void {
    const maxSizeInBytes = 15 * 1024 * 1024;

    if (!file.type.startsWith('image/')) {
      this.errorFile = true;
      this.dragging = false;
      setTimeout(() => (this.errorFile = false), 2000);
      return;
    }

    if (file.size > maxSizeInBytes) {
      this.errorSize = true;
      this.dragging = false;
      setTimeout(() => (this.errorSize = false), 3000);
      return;
    }

    this.setFile(file);
    this.onChange(file);
    this.onTouched();
  }

  private setFile(file: File): void {
    this.revokePreviewUrl();

    this.image = {
      file,
      previewUrl: URL.createObjectURL(file)
    };
  }

  private setPreview(imageUrl: string): void {
    this.image = {
      file: null,
      previewUrl: imageUrl
    };
  }

  private clearImage(): void {
    this.image = { file: null, previewUrl: null };
  }

  private revokePreviewUrl(): void {
    const preview = this.image?.previewUrl;
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
  }

}
