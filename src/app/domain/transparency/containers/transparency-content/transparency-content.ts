import { Component, inject, input, OnInit, output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { DatePickerComponent } from '../../../events/components/date-picker/date-picker';
import { TransparencyAccordionComponent } from "../../components/transparency-accordion/transparency-accordion";
import { UploadFile } from "../../components/upload-file/upload-file";
import { UploadProfileImage } from "../../components/upload-profile-image/upload-profile-image";
import { AccordionCollaborator } from '../../models/transparency-accordion/accordion-collaborator';
import { AccordionContent } from '../../models/transparency-accordion/accordion-content';
import { DeleteItem } from '../../models/transparency-accordion/delete-item';
import { TransparencyCategory } from '../../models/transparency/transparency-category';
import { TransparencyService } from '../../services/transparency.service';
import { SnackbarService } from '../../../../shared/services/snackbar-service';
import { finalize } from 'rxjs';

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
    UploadProfileImage,
    MatTooltipModule,
    FormInputComponent,
    DatePickerComponent,
    UploadFile
],
  templateUrl: './transparency-content.html',
  styleUrl: './transparency-content.scss'
})
export class TransparencyContent {

  @ViewChild('addDocumentDialog') addDocumentDialog!: TemplateRef<any>;
  @ViewChild('addCollaboratorDialog') addCollaboratorDialog!: TemplateRef<any>;
  @ViewChild('updateCategoryNameDialog') updateCategoryNameDialog!: TemplateRef<any>;
  @ViewChild('deleteCategoryDialog') deleteCategoryDialog!: TemplateRef<any>;
  @ViewChild('deleteItemDialog') deleteItemDialog!: TemplateRef<any>;

  content = input.required<AccordionContent>();

  isUpdated = output();

  deleteItem: DeleteItem = {
    id: '',
    name: '',
  };

  documentForm: FormGroup;
  collaboratorForm: FormGroup;
  categoryForm: FormGroup;

  private transparencyService = inject(TransparencyService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);

  constructor() {
    this.documentForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      effectiveDate: ['', Validators.required],
      file: ['', Validators.required],
    });

    this.collaboratorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      role: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: ['', Validators.required],
    });

    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  openAddDocumentDialog() {
    this.dialog.open(this.addDocumentDialog);
  }

  openAddCollaboratorDialog() {
    this.dialog.open(this.addCollaboratorDialog);
  }

  openUpdateCategoryName() {
    this.categoryForm.setValue({
      name: this.content().categoryName
    });
    this.dialog.open(this.updateCategoryNameDialog);
  }

  openDeleteCategoryDialog() {
    this.dialog.open(this.deleteCategoryDialog);
  }

  openDeleteItemDialog(event: DeleteItem) {
    this.deleteItem = event;
    this.dialog.open(this.deleteItemDialog);
  }

  onAddDocument() {
    if (this.documentForm.valid) {
      const formData = new FormData();

      formData.append('title', this.documentForm.value.title);

      const effectiveDate: Date = this.documentForm.get('effectiveDate')?.value;
      const formattedDate = effectiveDate.toISOString().split('T')[0];
      formData.append('effectiveDate', formattedDate);

      formData.append('categoryId', this.content().id ?? '');

      const file = this.documentForm.value.file;
      if (file) {
        formData.append('file', file);
      }

      this.transparencyService.createDocument(formData)
      .pipe(
        finalize(() => {
          this.isUpdated.emit();
          this.dialog.closeAll();
          this.documentForm.reset();
        })
      )
      .subscribe({
        next: (response) => this.snackbarService.error(response.message),
        error: (response) => this.snackbarService.error(response.error?.message)
      });
    }
  }

  onAddCollaborator() {
    if (this.collaboratorForm.valid) {
      const formData = new FormData();

      formData.append('name', this.collaboratorForm.value.name);
      formData.append('role', this.collaboratorForm.value.role);
      formData.append('description', this.collaboratorForm.value.description);

      formData.append('categoryId', this.content().id ?? '');
      formData.append('priority', String(this.content().collaborators?.length ?? 0));

      const image = this.collaboratorForm.value.image;
      if (image) {
        formData.append('image', image);
      }

      this.transparencyService.createCollaborator(formData)
      .pipe(
        finalize(() => {
          this.isUpdated.emit();
          this.dialog.closeAll();
          this.collaboratorForm.reset();
        })
      )
      .subscribe({
        next: (response) => this.snackbarService.error(response.message),
        error: (response) => this.snackbarService.error(response.error?.message)
      });
    }
  }

  onUpdateCategoryName() {
    if (this.categoryForm.valid) {
      const data: TransparencyCategory = {
        name: this.categoryForm.value.name,
        priority: this.content().priority
      }

      this.transparencyService.updateCategory(this.content().id ?? '', data)
      .pipe(
        finalize(() => {
          this.isUpdated.emit();
          this.dialog.closeAll();
          this.collaboratorForm.reset();
        })
      )
      .subscribe({
        next: (response) => this.snackbarService.error(response.message),
        error: (response) => this.snackbarService.error(response.error?.message)
      });
    }
  }

  onUpdateAllCollaborators(event: AccordionCollaborator[]) {
    event.forEach((item, index) => {
      const data: TransparencyCategory = {
        priority: index
      }
      this.transparencyService
        .updateCollaborator(item.id ?? '', data)
        .subscribe();
    });
  }

  onDeleteCategoryDialog() {
    this.transparencyService.deleteCategory(this.content().id ?? '')
    .pipe(
      finalize(() => {
        this.isUpdated.emit();
        this.dialog.closeAll();
      })
    )
    .subscribe({
      next: (response) => this.snackbarService.error(response.message),
      error: (response) => this.snackbarService.error(response.error?.message)
    });
  }

  onDeleteItemDialog(): void {
    const { id } = this.deleteItem;
    const deleteFn = this.content().documents
      ? this.transparencyService.deleteDocument.bind(this.transparencyService)
      : this.transparencyService.deleteCollaborator.bind(this.transparencyService);

    deleteFn(id ?? '')
    .pipe(
      finalize(() => {
        this.isUpdated.emit();
        this.dialog.closeAll();
      })
    )
    .subscribe({
      next: (response) => this.snackbarService.error(response.message),
      error: (response) => this.snackbarService.error(response.error?.message)
    });
  }

}
