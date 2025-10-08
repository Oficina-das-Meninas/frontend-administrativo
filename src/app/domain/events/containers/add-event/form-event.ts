import { Component, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { FormInputComponent } from "../../../../shared/components/form-input/form-input";
import { FormHelperService } from '../../../../shared/services/form/form-helps';
import { CKEditorComponent } from "../../components/ck-editor/ck-editor";
import { DatePickerComponent } from "../../components/date-picker/date-picker";
import { ImageInputComponent } from "../../components/image-input/image-input";

@Component({
  selector: 'app-form-event',
  imports: [
    MatCardModule,
    CKEditorComponent,
    ReactiveFormsModule,
    MatButtonModule,
    ImageInputComponent,
    MatTooltip,
    DatePickerComponent,
    FormInputComponent
],
  templateUrl: './form-event.html',
  styleUrl: './form-event.scss'
})
export class FormEventComponent {
  public eventForm: UntypedFormGroup;

  constructor(private formHelperService: FormHelperService) {
    this.eventForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200), this.noWhitespaceValidator]),
      description: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      eventDate: new UntypedFormControl(null, [Validators.required, this.dateValidator]),
      location: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      urlToPlataform: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      partnersImage: new UntypedFormControl([], [Validators.required, this.imageValidator]),
      previewImage: new UntypedFormControl([], [Validators.required, this.imageValidator])
    });
  }

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!(value instanceof Date)) {
      return { invalidDate: true };
    }

    if (isNaN(value.getTime())) {
      return { invalidDate: true };
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

  onSubmit() {
    if (this.eventForm.valid) {
      console.log(this.eventForm.value);
      // Handle form submission
    } else {
      this.formHelperService.validateAllFormFields(this.eventForm);
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (!field || !field.touched || !field.invalid) {
      return '';
    }

    if (field.hasError('whitespace')) {
      return 'Esse campo não pode conter apenas espaços em branco';
    }

    if (fieldName === 'eventDate' && field.hasError('invalidDate')) {
      return 'Data inválida';
    }

    return this.formHelperService.getErrorMessage(this.eventForm, fieldName);
  }

  hasImageError(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getImageErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'É obrigatório selecionar uma imagem';
    }
    return '';
  }
}
