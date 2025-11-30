import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { TransparencyService } from '../../services/transparency.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AccordionContent } from '../../models/transparency-accordion/accordion-content';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AccordionContentType } from '../../enums/transparency-accordion/accordion-content-type';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TransparencyCategory } from '../../models/transparency/transparency-category';
import { Observable, tap } from 'rxjs';
import { TransparencyContent } from '../transparency-content/transparency-content';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { FormSelect } from '../../../../shared/components/form-select/form-select';
import { FormSelectItem } from '../../../../shared/models/form-select-item';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-transparency',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    AsyncPipe,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    TransparencyContent,
    MatCardModule,
    MatIcon,
    MatTooltipModule,
    FormInputComponent,
    FormSelect,
    MatProgressSpinner
],
  templateUrl: './transparency.html',
  styleUrl: './transparency.scss',
})
export class Transparency implements OnInit {
  @ViewChild('addCategoryDialog') addCategoryDialog!: TemplateRef<any>;

  accordionContentList$!: Observable<AccordionContent[]>;
  accordionContentList: AccordionContent[] = [];
  accordionContentType = AccordionContentType;
  categoryForm: FormGroup;
  categoryTypes: FormSelectItem<AccordionContentType>[] = [
    {
      value: AccordionContentType.DOCUMENT,
      name: 'Documentos',
    },
    {
      value: AccordionContentType.COLLABORATOR,
      name: 'Colaboradores',
    },
  ];
  isLoading = false;

  private transparencyService = inject(TransparencyService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.categoryForm = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.loadAccordionContent();
  }

  drop(event: CdkDragDrop<AccordionContent[]>) {
    moveItemInArray(
      this.accordionContentList,
      event.previousIndex,
      event.currentIndex
    );
    this.updateAllPriorities();
  }

  openAddCategoryDialog() {
    this.categoryForm.patchValue({
      type: AccordionContentType.DOCUMENT,
    });
    this.dialog.open(this.addCategoryDialog);
  }

  onAddCategory() {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      const data: TransparencyCategory = {
        name: this.categoryForm.value.name,
        isImage:
          this.categoryForm.value.type === AccordionContentType.COLLABORATOR
            ? true
            : false,
        priority: this.accordionContentList.length,
      };

      this.transparencyService.createCategory(data).subscribe({
        next: () => {
          this.categoryForm.reset({
            type: AccordionContentType.DOCUMENT,
          });
        },
        complete: () => {
          this.isLoading = false;
          this.loadAccordionContent();
          this.dialog.closeAll();
        },
      });
    }
  }

  loadAccordionContent() {
    this.accordionContentList$ = this.transparencyService
      .list()
      .pipe(tap((response) => (this.accordionContentList = response)));
  }

  updateAllPriorities(): void {
    this.accordionContentList.forEach((item, index) => {
      const data: TransparencyCategory = {
        name: item.categoryName,
        priority: index,
      };
      this.transparencyService.updateCategory(item.id ?? '', data).subscribe();
    });
  }
}
