import { AsyncPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DateRange } from '../../models/date-range';
import { CalendarFilter } from '../calendar-filter/calendar-filter';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { FlowerSpinner } from '../flower-spinner/flower-spinner';
import { SearchInput } from '../search-input/search-input';

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'image';
}

export interface DataPage<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
}

export interface DeleteService {
  delete(id: string): Observable<any>;
}

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    CalendarFilter,
    MatTooltipModule,
    MatButtonToggleModule,
    SearchInput,
    MatDialogModule,
    NgTemplateOutlet,
    FlowerSpinner
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T extends { id: string }> implements OnInit {
  @Input() dataTitle = '';
  @Input() data$: Observable<DataPage<T>> | null = null;
  @Input() columns: TableColumn[] = [];
  @Input() enableCardsView = true;
  @Input() enableCreateButton = true;
  @Input() enableDateFilter = true;
  @Input() basePath = '';
  @Input() deleteService: DeleteService | null = null;
  @Input() cardTemplate: TemplateRef<any> | null = null;
  @Input() titleProperty = 'title';
  @Input() defaultViewMode: 'cards' | 'table' = 'table';

  @Output() search = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() dateFilter = new EventEmitter<DateRange>();
  @Output() clearFilters = new EventEmitter<void>();

  pageIndex = 0;
  pageSize = 10;
  viewMode: 'cards' | 'table' = 'cards';
  isMobile = false;
  itemToDelete: T | null = null;
  imageLoadingState = new Map<string, boolean>();
  imageErrorState = new Map<string, boolean>();
  itemLoadingState = new Map<string, boolean>();

  dateRange: DateRange = {
    start: null,
    end: null,
  };

  private router = inject(Router);
  private dialog = inject(MatDialog);

  get displayedColumns(): string[] {
    return [...this.columns.map(col => col.key), 'acoes'];
  }

  ngOnInit() {
    this.checkScreenSize();
    this.setDefaultViewMode();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
    this.setDefaultViewMode();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  private setDefaultViewMode() {
    if (this.isMobile) {
      this.viewMode = this.enableCardsView ? 'cards' : 'table';
    } else {
      this.viewMode = this.defaultViewMode;
    }
  }

  onViewModeChange(newViewMode: 'cards' | 'table') {
    this.viewMode = newViewMode;
  }

  onSearch(searchTerm: string) {
    this.search.emit(searchTerm);
  }

  onClearSearch() {
    this.clearSearch.emit();
  }

  refresh(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageChange.emit(pageEvent);
  }

  applyDateFilter() {
    if (this.dateRange.start && this.dateRange.end) {
      this.dateFilter.emit(this.dateRange);
    }
  }

  clearAllFilters() {
    this.dateRange.start = null;
    this.dateRange.end = null;
    this.clearFilters.emit();
  }

  navigateToCreate() {
    this.router.navigate([`${this.basePath}/cadastro`]);
  }

  navigateToEdit(id: string) {
    this.itemLoadingState.set(id, true);
    this.router.navigate([`${this.basePath}/editar`, id]);
  }

  isItemLoading(itemId: string): boolean {
    return this.itemLoadingState.get(itemId) ?? false;
  }

  confirmDelete(item: T) {
    this.itemToDelete = item;

    const itemTitle = (item as any)[this.titleProperty] || 'este item';

    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      data: { title: itemTitle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.deleteService && this.itemToDelete) {
        // Mark item as loading while being deleted
        this.itemLoadingState.set(this.itemToDelete.id, true);

        this.deleteService.delete(this.itemToDelete.id).subscribe({
          next: () => {
            this.pageChange.emit({
              pageIndex: 0,
              pageSize: this.pageSize,
              length: 0
            });

            this.pageIndex = 0;
          },
          error: (error) => {
            console.error('Erro ao excluir item:', error);
            if (this.itemToDelete) {
              this.itemLoadingState.delete(this.itemToDelete.id);
            }
          },
          complete: () => {
            if (this.itemToDelete) {
              this.itemLoadingState.delete(this.itemToDelete.id);
            }
            this.itemToDelete = null;
          }
        });
      } else {
        this.itemToDelete = null;
      }
    });
  }

  getCellValue(item: any, column: TableColumn): any {
    return item[column.key];
  }

  isImageLoading(itemId: string): boolean {
    return this.imageLoadingState.get(itemId) ?? true;
  }

  isImageError(itemId: string): boolean {
    return this.imageErrorState.get(itemId) ?? false;
  }

  onImageLoad(itemId: string) {
    this.imageLoadingState.set(itemId, false);
    this.imageErrorState.set(itemId, false);
  }

  onImageError(itemId: string) {
    this.imageLoadingState.set(itemId, false);
    this.imageErrorState.set(itemId, true);
  }
}
