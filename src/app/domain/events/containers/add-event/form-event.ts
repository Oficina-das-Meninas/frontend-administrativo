import { Component, inject, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { FormHelperService } from '../../../../shared/services/form/form-helps';
import { CKEditorComponent } from '../../components/ck-editor/ck-editor';
import { ImageInputComponent } from '../../components/image-input/image-input';
import { TimePickerComponent } from '../../components/time-picker/time-picker';
import { EventService } from '../../services/event-service';

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
  ],
  templateUrl: './form-event.html',
  styleUrl: './form-event.scss',
})
export class FormEventComponent {
  public eventForm: UntypedFormGroup;
  private eventService = inject(EventService);

  constructor(private formHelperService: FormHelperService) {
    this.eventForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      description: new UntypedFormControl('', [Validators.required]),
      eventDate: new UntypedFormControl(null, [Validators.required]),
      eventTime: new UntypedFormControl('', [this.timeValidator]),
      location: new UntypedFormControl('', [Validators.required]),
      urlToPlataform: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
      ]),
      partnersImage: new UntypedFormControl([], [Validators.required, this.imageValidator]),
      previewImage: new UntypedFormControl([], [Validators.required, this.imageValidator]),
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = { ...this.eventForm.value };

      const finalData = {
        ...formValue,
        eventDate: this.combineDateTime(formValue.eventDate, formValue.eventTime),
      };
      delete finalData.eventTime;

      const formData = new FormData();
      formData.append('title', finalData.title);
      formData.append('description', finalData.description);
      formData.append('eventDate', finalData.eventDate.toISOString());
      formData.append('location', finalData.location);
      formData.append('urlToPlataform', finalData.urlToPlataform);
      formData.append('partnersImage', formValue.partnersImage[0]);
      formData.append('previewImage', formValue.previewImage[0]);
      this.eventService.create(formData).subscribe(() => {
        this.eventForm.reset();
        this.description.set('');
      });
    } else {
      this.formHelperService.validateAllFormFields(this.eventForm);
    }
  }


  timeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || value === '--:--' || value.trim() === '') {
      return null;
    }

    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(value)) {
      return { invalidTime: true };
    }

    return null;
  }

  imageValidator(control: AbstractControl): ValidationErrors | null {
    const files = control.value as File[];
    if (!files || files.length === 0) {
      return { required: true };
    }
    return null;
  }

  public description = signal<string>('');

  onDataChange(data: string) {
    this.description.set(data);
    this.eventForm.get('description')?.setValue(data);
  }

  onPartnersImageSelected(files: File[]) {
    this.eventForm.get('partnersImage')?.setValue(files);
    this.eventForm.get('partnersImage')?.markAsTouched();
  }

  onPreviewImageSelected(files: File[]) {
    this.eventForm.get('previewImage')?.setValue(files);
    this.eventForm.get('previewImage')?.markAsTouched();
  }

  private combineDateTime(date: Date, time: string): Date {
    const eventDateTime = new Date(date);

    if (time && time !== '--:--' && time.trim() !== '') {
      const [hours, minutes] = time.split(':');
      eventDateTime.setHours(parseInt(hours, 10));
      eventDateTime.setMinutes(parseInt(minutes, 10));
    }

    return eventDateTime;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (!field || !field.invalid) {
      return '';
    }

    if (field.hasError('whitespace')) {
      return 'Esse campo não pode conter apenas espaços em branco';
    }

    if (fieldName === 'eventDate' && field.hasError('invalidDate')) {
      return 'Data inválida';
    }

    if (fieldName === 'eventTime' && field.hasError('invalidTime')) {
      return 'Hora inválida. Use o formato: HH:MM (ex: 14:30)';
    }

    if (fieldName === 'urlToPlataform' && field.hasError('pattern')) {
      return 'URL inválida. Use o formato: exemplo.com';
    }

    return this.formHelperService.getErrorMessage(this.eventForm, fieldName);
  }

  hasImageError(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field?.invalid);
  }

  getImageErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'É obrigatório selecionar uma imagem';
    }
    return '';
  }
}
