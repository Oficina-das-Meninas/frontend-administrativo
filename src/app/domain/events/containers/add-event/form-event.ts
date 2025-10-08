import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { FormHelperService } from '../../../../shared/services/form/form-helps';
import { CKEditorComponent } from '../../components/ck-editor/ck-editor';
import { DatePickerComponent } from "../../components/date-picker/date-picker";
import { ImageInputComponent } from '../../components/image-input/image-input';
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
    ImageInputComponent,
    MatTooltip,
    TimePickerComponent,
    FormInputComponent,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    DatePickerComponent
],
  templateUrl: './form-event.html',
  styleUrl: './form-event.scss',
})
export class FormEventComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private formHelperService = inject(FormHelperService);
  private router = inject(Router);

  public description = signal<string>('');

  public eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    eventDate: [null as Date | null, [Validators.required]],
    eventTime: ['', [EventValidators.timeValidator]],
    location: ['', [Validators.required]],
    urlToPlatform: ['', [
      Validators.required,
      Validators.pattern(/^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
    ]],
    partnersImage: [[] as File[], [Validators.required, EventValidators.imageValidator]],
    previewImage: [[] as File[], [Validators.required, EventValidators.imageValidator]],
  });

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

    this.eventService.create(formData).subscribe(() => {
      this.eventForm.reset();
      this.description.set('');
      this.router.navigate(['/eventos']);
    });
  }

  private buildFormData(
    finalData: Omit<EventFormValue, 'eventTime'> & { eventDate: Date },
    formValue: EventFormValue
  ): FormData {
    const formData = new FormData();
    formData.append('title', finalData.title);
    formData.append('description', finalData.description);
    formData.append('eventDate', DateTimeUtils.formatForBackend(finalData.eventDate));
    formData.append('location', finalData.location);
    formData.append('urlToPlatform', finalData.urlToPlatform);
    formData.append('partnersImage', formValue.partnersImage[0]);
    formData.append('previewImage', formValue.previewImage[0]);
    return formData;
  }

  onDataChange(data: string) {
    this.description.set(data);
    this.eventForm.get('description')?.setValue(data);
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
}
