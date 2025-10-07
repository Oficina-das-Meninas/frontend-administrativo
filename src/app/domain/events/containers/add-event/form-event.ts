import { Component, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FormHelperService } from '../../../../shared/services/form/form-helps';
import { CKEditorComponent } from "../../components/ck-editor/ck-editor";
import { ImageInputComponent } from "../../components/image-input/image-input";

@Component({
  selector: 'app-form-event',
  imports: [
    MatCardModule,
    CKEditorComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ImageInputComponent,
    MatTooltip
],
  templateUrl: './form-event.html',
  styleUrl: './form-event.scss'
})
export class FormEventComponent {
  public eventForm: UntypedFormGroup;
  public datePickerControl = new UntypedFormControl(null); 

  constructor(private formHelperService: FormHelperService) {
    this.eventForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200), this.noWhitespaceValidator]),
      description: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      eventDate: new UntypedFormControl('', [Validators.required, this.dateValidator]),
      location: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      urlToPlataform: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      partnersImage: new UntypedFormControl([], [Validators.required, this.imageValidator]),
      previewImage: new UntypedFormControl([], [Validators.required, this.imageValidator])
    });

    // Sincroniza o datepicker com o campo de texto
    this.datePickerControl.valueChanges.subscribe((date: Date | null) => {
      if (date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formatted = `${day}/${month}/${year}`;
        this.eventForm.get('eventDate')?.setValue(formatted);
      }
    });
  }

  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  // Validador de data
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null; // O required já trata isso
    }

    // Se for string, valida o padrão DD/MM/YYYY
    if (typeof value === 'string') {
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      
      if (!datePattern.test(value)) {
        return { invalidDateFormat: true };
      }

      // Converte string DD/MM/YYYY para Date
      const parts = value.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mês começa em 0
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);

      // Verifica se a data é válida (ex: 31/02/2024 seria inválida)
      if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
        return { invalidDate: true };
      }

      // Verifica se a data não é muito antiga (anterior a 1900)
      if (year < 1900) {
        return { dateOutOfRange: true };
      }

      // Verifica se a data não é muito futura (mais de 10 anos)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 10);
      if (date > maxDate) {
        return { dateTooFar: true };
      }

      return null;
    }

    // Se for Date object (do datepicker)
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    // Verifica se a data não é muito antiga (anterior a 1900)
    if (date.getFullYear() < 1900) {
      return { dateOutOfRange: true };
    }

    // Verifica se a data não é muito futura (mais de 10 anos)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);
    if (date > maxDate) {
      return { dateTooFar: true };
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

  // Formata a data enquanto o usuário digita (DD/MM/YYYY)
  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    // Limita a 8 dígitos (DDMMYYYY)
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    
    // Formata com as barras
    if (value.length >= 5) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4);
    } else if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    // Atualiza o valor do input e do form control
    input.value = value;
    this.eventForm.get('eventDate')?.setValue(value, { emitEvent: false });
    
    // Tenta atualizar o datepicker se a data estiver completa e válida
    if (value.length === 10) {
      const parts = value.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      
      // Verifica se a data é válida
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        this.datePickerControl.setValue(date, { emitEvent: false });
      }
    }
  }

  // Quando o input recebe foco
  onDateFocus(): void {
    // Apenas para manter compatibilidade
  }

  // Marca o campo como touched quando perde o foco
  onDateBlur(): void {
    this.eventForm.get('eventDate')?.markAsTouched();
  }

  // Abre o datepicker - não é mais necessário
  openDatePicker(picker: MatDatepicker<Date>): void {
    picker.open();
  }

  // Quando o datepicker é fechado
  onDatePickerClosed(): void {
    // A sincronização já acontece automaticamente via valueChanges
    this.eventForm.get('eventDate')?.markAsTouched();
  }
}
