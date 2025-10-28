import { Component, inject, input, OnInit, output, TemplateRef, ViewChild } from '@angular/core';
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
import { UploadProfileImage } from "../../components/upload-profile-image/upload-profile-image";
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransparencyCategory } from '../../models/transparency/transparency-category';
import { DeleteItem } from '../../models/transparency-accordion/delete-item';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { DatePickerComponent } from '../../../events/components/date-picker/date-picker';
import { UploadFile } from "../../components/upload-file/upload-file";
import { AccordionCollaborator } from '../../models/transparency-accordion/accordion-collaborator';

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
export class TransparencyContent implements OnInit {

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

  ngOnInit(): void {
    this.categoryForm.setValue({
      name: this.content().categoryName
    });
  }

  openAddDocumentDialog() {
    this.dialog.open(this.addDocumentDialog);
  }

  openAddCollaboratorDialog() {
    this.dialog.open(this.addCollaboratorDialog);
  }

  openUpdateCategoryName() {
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

      formData.append('categoryId', this.content().id ?? '');
      formData.append('priority', String(this.content().collaborators?.length ?? 0));

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

  onUpdateCategoryName() {
    if (this.categoryForm.valid) {
      const data: TransparencyCategory = {
        name: this.categoryForm.value.name,
        priority: this.content().priority
      }

      this.transparencyService.updateCategory(this.content().id ?? '', data).subscribe({
        next: () => {
          this.isUpdated.emit();
          this.categoryForm.reset({ 
            name: this.categoryForm.value.name
          });
          this.dialog.closeAll();
        }
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
    this.transparencyService.deleteCategory(this.content().id ?? '').subscribe({
      next: () => {
        this.isUpdated.emit();
        this.dialog.closeAll();
      }
    });
  }

  onDeleteItemDialog(): void {
    const { id } = this.deleteItem;
    const deleteFn = this.content().documents
      ? this.transparencyService.deleteDocument.bind(this.transparencyService)
      : this.transparencyService.deleteCollaborator.bind(this.transparencyService);

    deleteFn(id ?? '').subscribe({
      next: () => {
        this.isUpdated.emit();
        this.dialog.closeAll();
      }
    });
  }

}
