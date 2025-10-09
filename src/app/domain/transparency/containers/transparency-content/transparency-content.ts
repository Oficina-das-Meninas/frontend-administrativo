import { Component, inject, input, output, TemplateRef, ViewChild } from '@angular/core';
import { TransparencyAccordionComponent } from "../../components/transparency-accordion/transparency-accordion";
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { AccordionContent } from '../../models/transparency-accordion/accordion-content';
import { TransparencyService } from '../../services/transparency.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MaskDate } from '../../../../shared/directives/mask-date';
import { UploadProfileImage } from "../../components/upload-profile-image/upload-profile-image";

@Component({
  selector: 'app-transparency-content',
  imports: [
    TransparencyAccordionComponent,
    Dialog,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MaskDate,
    UploadProfileImage
],
  templateUrl: './transparency-content.html',
  styleUrl: './transparency-content.scss'
})
export class TransparencyContent {

  @ViewChild('addDocumentDialog') addDocumentDialog!: TemplateRef<any>;
  @ViewChild('addCollaboratorDialog') addCollaboratorDialog!: TemplateRef<any>;

  content = input<AccordionContent>();
  isUpdated = output();

  documentForm: FormGroup;
  collaboratorForm: FormGroup;

  private transparencyService = inject(TransparencyService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.documentForm = this.formBuilder.group({
      title: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      file: ['', Validators.required],
    });

    this.collaboratorForm = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      description : ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  openAddDocumentDialog() {
    this.dialog.open(this.addDocumentDialog);
  }

  openAddCollaboratorDialog() {
    this.dialog.open(this.addCollaboratorDialog);
  }

  onAddDocument() {
    if (this.documentForm.valid) {
      const formData = new FormData();

      formData.append('title', this.documentForm.value.title);

      const effectiveDate: Date = this.documentForm.get('effectiveDate')?.value;
      const formattedDate = effectiveDate.toISOString().split('T')[0];
      formData.append('effectiveDate', formattedDate);
      
      formData.append('categoryId', this.content()?.id ?? '');

      const file = this.documentForm.value.file;
      if (file) {
        formData.append('file', file);
      }

      this.transparencyService.createDocument(formData).subscribe({
        next: () => {
          this.isUpdated.emit();
          this.documentForm.reset();
        }
      });
    }
  }

  onAddCollaborator() {
    if (this.collaboratorForm.valid) {
      const formData = new FormData();

      formData.append('name', this.collaboratorForm.value.name);
      formData.append('role', this.collaboratorForm.value.role);
      formData.append('description', this.collaboratorForm.value.description);

      formData.append('categoryId', this.content()?.id ?? '');
      formData.append('priority', String(this.content()?.collaborators?.length ?? 0));

      const image = this.collaboratorForm.value.image;
      if (image) {
        formData.append('image', image);
      }

      this.transparencyService.createCollaborator(formData).subscribe({
        next: () => {
          this.isUpdated.emit();
          this.collaboratorForm.reset();
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.documentForm.patchValue({ file });
    this.documentForm.get('file')?.updateValueAndValidity();
  }

}
