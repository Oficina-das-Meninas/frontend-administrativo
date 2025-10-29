import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { ImageInputComponent } from '../../../../shared/components/image-input/image-input';
import { CanComponentDeactivate } from '../../../../shared/guards/unsaved-changes.guard';
import { FormHelperService } from '../../../../shared/services/form/form-helps';
import { SnackbarService } from '../../../../shared/services/snackbar-service';
import { CKEditorComponent } from '../../components/ck-editor/ck-editor';
import { DatePickerComponent } from '../../components/date-picker/date-picker';
import { TimePickerComponent } from '../../components/time-picker/time-picker';
import { EventService } from '../../services/event-service';
import { DateTimeUtils } from '../../utils/date-time';
import { UrlUtils } from '../../utils/url';
import { EventValidators } from '../../validators/event-validators';

interface EventFormValue {
  title: string;
  description: string;
  eventDate: Date | null;
  eventTime: string;
  location: string;
  urlToPlatform: string;
  partnersImage: File[];
  previewImage: File[];
}

const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  eventDate: { invalidDate: 'Data inválida' },
  eventTime: { invalidTime: 'Hora inválida. Use o formato: HH:MM (ex: 14:30)' },
  urlToPlatform: { pattern: 'URL inválida. Use o formato: exemplo.com' },
};

@Component({
  selector: 'app-form-event',
  imports: [
    MatCardModule,
    CKEditorComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    ImageInputComponent,
    MatTooltip,
    TimePickerComponent,
    FormInputComponent,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    DatePickerComponent,
  ],
  templateUrl: './form-event.html',
  styleUrl: './form-event.scss',
})
export class FormEventComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private formHelperService = inject(FormHelperService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public description = signal<string>('');
  public isEditMode = signal<boolean>(false);
  public eventId: string | null = null;
  public existingPreviewImageUrl = signal<string>('');
  public existingPartnersImageUrl = signal<string>('');

  public eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    eventDate: [null as Date | null, [Validators.required]],
    eventTime: ['', [EventValidators.timeValidator]],
    location: ['', [Validators.required]],
    urlToPlatform: [
      '',
      [Validators.required, Validators.pattern(/^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/)],
    ],
    partnersImage: [[] as File[], [Validators.required, EventValidators.imageValidator]],
    previewImage: [[] as File[], [Validators.required, EventValidators.imageValidator]],
  });

  // Snapshot of the initial normalized form value used to detect real changes
  private initialFormValue: any = null;

  private updateImageValidators(): void {
    const previewControl = this.eventForm.get('previewImage');
    const partnersControl = this.eventForm.get('partnersImage');

    if (!previewControl || !partnersControl) return;

    if (this.isEditMode()) {
      if (this.existingPreviewImageUrl()?.trim()) {
        previewControl.setValidators([EventValidators.imageValidator]);
      } else {
        previewControl.setValidators([Validators.required, EventValidators.imageValidator]);
      }

      if (this.existingPartnersImageUrl()?.trim()) {
        partnersControl.setValidators([EventValidators.imageValidator]);
      } else {
        partnersControl.setValidators([Validators.required, EventValidators.imageValidator]);
      }
    }

    previewControl.updateValueAndValidity();
    partnersControl.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['event']) {
        this.isEditMode.set(true);
        this.loadEventData(data['event']);
      }
    });

    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
    });
    this.captureInitialForm?.();
  }

  private loadEventData(event: any): void {
    const eventDate = new Date(event.eventDate);
    const eventTime = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    this.existingPreviewImageUrl.set(event.previewImageUrl || '');
    this.existingPartnersImageUrl.set(event.partnersImageUrl || '');

    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      eventDate: eventDate,
      eventTime: eventTime,
      location: event.location,
      urlToPlatform: UrlUtils.removeHttpPrefix(event.urlToPlatform || ''),
    });

    this.description.set(event.description);
    this.captureInitialForm();

    if (event.previewImageUrl?.trim()) {
      this.urlToFile(event.previewImageUrl).then(file => {
        this.eventForm.patchValue({ previewImage: [file] });
        this.captureInitialForm();
      });
    }

    if (event.partnersImageUrl?.trim()) {
      this.urlToFile(event.partnersImageUrl).then(file => {
        this.eventForm.patchValue({ partnersImage: [file] });
        this.captureInitialForm();
      });
    }

    this.updateImageValidators();
  }

  private async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const mimeType = blob.type || 'image/jpeg';
    return new File([blob], filename, { type: mimeType });
  }

  private normalizeValue(value: any): any {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value.getTime();
    if (Array.isArray(value)) return value.map(v => this.normalizeValue(v));
    try {
      if (typeof File !== 'undefined' && value instanceof File) {
        return { name: value.name, size: value.size, type: value.type };
      }
    } catch (err) {}
    if (typeof value === 'object') {
      const keys = Object.keys(value).sort();
      const out: any = {};
      keys.forEach(k => {
        out[k] = this.normalizeValue((value as any)[k]);
      });
      return out;
    }
    return value;
  }

  private captureInitialForm(): void {
    try {
      this.initialFormValue = this.normalizeValue(this.eventForm.getRawValue());
    } catch (err) {
      console.error('Erro ao capturar snapshot inicial do formulário:', err);
      this.initialFormValue = null;
    }
  }

  private isFormEqualToInitial(): boolean {
    try {
      const current = this.normalizeValue(this.eventForm.getRawValue());
      return JSON.stringify(current) === JSON.stringify(this.initialFormValue);
    } catch (err) {
      console.error('Erro ao comparar formulário com snapshot inicial:', err);
      return false;
    }
  }

  onSubmit() {
    if (!this.eventForm.valid) {
      this.formHelperService.validateAllFormFields(this.eventForm);
      return;
    }

    const formValue = this.eventForm.getRawValue() as EventFormValue;

    const finalData = {
      ...formValue,
      eventDate: DateTimeUtils.combineDateTime(formValue.eventDate!, formValue.eventTime),
      urlToPlatform: UrlUtils.addHttpsPrefix(formValue.urlToPlatform),
    };

    const formData = this.buildFormData(finalData, formValue);

    const request$ = this.isEditMode() ? this.eventService.update(this.eventId!, formData) : this.eventService.create(formData);

    request$.subscribe({
      next: () => {
        const successMessage = this.isEditMode() ? 'Evento atualizado com sucesso!' : 'Evento cadastrado com sucesso!';

        this.snackbarService.success(successMessage);
        this.eventForm.reset();
        this.description.set('');
        this.router.navigate(['/eventos']);
      },
      error: error => {
        const errorMessage = this.isEditMode() ? 'Erro ao atualizar evento. Tente novamente.' : 'Erro ao cadastrar evento. Tente novamente.';

        this.snackbarService.error(errorMessage);
        console.error('Erro ao salvar evento:', error);
      },
    });
  }

  private buildFormData(finalData: Omit<EventFormValue, 'eventTime'> & { eventDate: Date }, formValue: EventFormValue): FormData {
    const formData = new FormData();
    formData.append('title', finalData.title);
    formData.append('description', finalData.description);
    formData.append('eventDate', DateTimeUtils.formatForBackend(finalData.eventDate));
    formData.append('location', finalData.location);
    formData.append('urlToPlatform', finalData.urlToPlatform);

    if (formValue.partnersImage && formValue.partnersImage.length > 0) {
      formData.append('partnersImage', formValue.partnersImage[0]);
    }

    if (formValue.previewImage && formValue.previewImage.length > 0) {
      formData.append('previewImage', formValue.previewImage[0]);
    }

    return formData;
  }

  onDataChange(data: string) {
    this.eventForm.get('description')?.setValue(data, { emitEvent: false });
  }

  onImageSelected(fieldName: string, files: File[]) {
    this.eventForm.get(fieldName)?.setValue(files);
    this.eventForm.get(fieldName)?.markAsTouched();
  }

  onPartnersImageSelected(files: File[]) {
    this.onImageSelected('partnersImage', files);
  }

  onPreviewImageSelected(files: File[]) {
    this.onImageSelected('previewImage', files);
  }

  onUrlInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanUrl = UrlUtils.removeHttpPrefix(input.value);
    this.eventForm.get('urlToPlatform')?.setValue(cleanUrl, { emitEvent: false });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (!field?.invalid) return '';

    const fieldErrors = ERROR_MESSAGES[fieldName];
    if (fieldErrors) {
      for (const [errorKey, message] of Object.entries(fieldErrors)) {
        if (field.hasError(errorKey)) {
          return message;
        }
      }
    }

    return this.formHelperService.getErrorMessage(this.eventForm, fieldName);
  }

  hasImageError(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getImageErrorMessage(fieldName: string): string {
    return this.hasImageError(fieldName) ? 'É obrigatório selecionar uma imagem' : '';
  }

  goBack(): void {
    this.router.navigate(['/eventos']);
  }

  canDeactivate(): boolean {
    // Consider there are no changes if the current normalized value equals the
    // initial snapshot. This handles the case where the user types and then
    // reverts the input to its original value.
    if (!this.eventForm) return true;
    return this.isFormEqualToInitial();
  }

  getForm(): FormGroup | null {
    return this.eventForm;
  }

  getFormName(): string {
    return 'evento';
  }
}
