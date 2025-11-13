import { Component, EventEmitter, inject, Input, NgZone, OnChanges, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-image-input',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './image-input.html',
  styleUrl: './image-input.scss'
})
export class ImageInputComponent implements OnChanges {
  @Input() text: string = '';
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() limit: number = 1;
  @Input() maxFileSize: number = 10;
  @Input() fullPreview: boolean = false;
  @Input() initialUrls: string[] = [];
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileSizeExceeded = new EventEmitter<{ fileName: string; fileSize: number; maxSize: number }>();

  private zone = inject(NgZone);
  @Input() readonly = false;

  previewUrls: WritableSignal<string[]> = signal([]);
  selectedFiles: File[] = [];
  isDragging = false;
  private dragCounter = 0;
  isLoadingInitialImages = signal<boolean>(false);
  private loadingCounter = signal<number>(0);
  fileSizeErrorMessage = signal<string>('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialUrls']) {
      if (this.initialUrls.length > 0) {
        this.isLoadingInitialImages.set(true);
        this.loadingCounter.set(this.initialUrls.length);

        for (const url of this.initialUrls) {
          this.loadImage(url);
        }
      } else {
        this.previewUrls.set([]);
        this.isLoadingInitialImages.set(false);
      }
    }
  }

  private loadImage(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.zone.run(() => {
        this.previewUrls.set([...this.previewUrls(), url]);
        this.decreaseLoadingCounter();
      });
    };
    img.onerror = () => {
      this.zone.run(() => {
        this.decreaseLoadingCounter();
      });
    };
    img.src = url;
  }

  private decreaseLoadingCounter(): void {
    const current = this.loadingCounter() - 1;
    this.loadingCounter.set(current);
    if (current <= 0) {
      this.isLoadingInitialImages.set(false);
    }
  }

  onFileSelected(event: any) {
    if (this.readonly) return;
    const files: FileList = event.target.files;
    this.replaceFiles(Array.from(files));
    event.target.value = '';
  }

  replaceFiles(files: File[]) {
    this.previewUrls.set([]);
    this.selectedFiles = [];
    this.addFiles(files);
  }

  addFiles(files: File[]) {
    for (let file of files) {
      // Validar tamanho do arquivo (maxFileSize está em MB)
      const maxSizeInBytes = this.maxFileSize * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const errorMessage = `Arquivo "${file.name}" excede o tamanho máximo de ${this.maxFileSize}MB (tamanho atual: ${fileSizeMB}MB)`;
        this.fileSizeErrorMessage.set(errorMessage);
        this.fileSizeExceeded.emit({
          fileName: file.name,
          fileSize: file.size,
          maxSize: maxSizeInBytes
        });
        continue;
      }

      this.fileSizeErrorMessage.set('');
      const reader = new FileReader();
      reader.onload = () => {
        this.zone.run(() => {
          this.previewUrls.set([...this.previewUrls(), reader.result as string]);
          this.selectedFiles.push(file);
          this.filesSelected.emit(this.selectedFiles);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    if (this.readonly) return;
    const updatedPreviews = [...this.previewUrls()];
    updatedPreviews.splice(index, 1);
    this.previewUrls.set(updatedPreviews);

    if (index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }

    this.filesSelected.emit(this.selectedFiles);
  }

  fullPreviewUrl: string | null = null;

  showFullPreview(url: string) {
    this.fullPreviewUrl = url;
  }

  closePreview() {
    this.fullPreviewUrl = null;
  }

  onDragOver(event: DragEvent) {
    if (this.readonly) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragEnter(event: DragEvent) {
    if (this.readonly) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
      event.dataTransfer.effectAllowed = 'copy';
    }
    this.dragCounter++;
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    if (this.readonly) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.isDragging = false;
    }
  }

  onDrop(event: DragEvent) {
    if (this.readonly) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.dragCounter = 0;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        this.replaceFiles(imageFiles);
      }
    }
  }

  getFileName(url: string): string {
    if (!url) return '';
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || '';
  }
}
