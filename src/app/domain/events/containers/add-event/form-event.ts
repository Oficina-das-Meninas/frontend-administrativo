import { Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    ImageInputComponent
  ],
  templateUrl: './form-event.html',
  styleUrl: './form-event.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormEventComponent {
  public eventForm: FormGroup;

  constructor() {
    this.eventForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      eventDate: new FormControl(''),
      location: new FormControl(''),
      urlToPlataform: new FormControl(''),
      partnersImage: new FormControl([]),
      previewImage: new FormControl([])
    });
  }

  public description = signal<string>('');

  onDataChange(data: string) {
    this.description.set(data);
    this.eventForm.get('description')?.setValue(data);
  }

  onPartnersImageSelected(files: File[]) {
    this.eventForm.get('partnersImage')?.setValue(files);
  }

  onPreviewImageSelected(files: File[]) {
    this.eventForm.get('previewImage')?.setValue(files);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log(this.eventForm.value);
      // Handle form submission
    }
  }
}
