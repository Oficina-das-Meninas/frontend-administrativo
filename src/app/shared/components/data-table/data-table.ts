import { AsyncPipe, DatePipe, NgTemplateOutlet, CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DateRange } from '../../models/date-range';
import { CalendarFilter } from '../calendar-filter/calendar-filter';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { FlowerSpinner } from '../flower-spinner/flower-spinner';
import { DataPage, DeleteService, TableColumn } from '../../models/data-table-helpers';

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
    MatFormFieldModule,
  MatSelectModule,
    MatInputModule,
  CommonModule,
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
  @Input() showActions = true;
  @Input() enableSort = false;
  @Input() dataTitle = '';
  @Input() searchPlaceholder = 'Buscar...';
  @Input() data$: Observable<DataPage<T>> | null = null;
  @Input() columns: TableColumn[] = [];
  @Input() enableCardsView = true;
  @Input() enableCreateButton = true;
  @Input() enableDateFilter = true;
  @Input() basePath = '';
  @Input() deleteService: DeleteService | null = null;
  @Input() cardTemplate: TemplateRef<any> | null = null;
  @Input() titleProperty = 'title';

  @ViewChild(MatSort) sort!: MatSort;

  @Input() selectFilters: Array<{
    key: string;
    label: string;
    options: Array<{ value: any; label: string }>;
    multiple?: boolean;
  }> = [];

  @Output() selectFiltersChange = new EventEmitter<Record<string, any>>();

  selectedFilters: Record<string, any> = {};

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
    const cols = [...this.columns.map(col => col.key)];
    if (this.showActions) {
      cols.push('acoes');
    }
    return cols;
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

  onSelectFilterChange(key: string, value: any) {
    const filterDef = this.selectFilters.find(f => f.key === key);
    const isMultiple = filterDef?.multiple === true;

    if (value === undefined || value === null) {
      delete this.selectedFilters[key];
    } else if (isMultiple) {
      if (!this.selectedFilters[key]) {
        this.selectedFilters[key] = [value];
      } else {
        const currentValues = this.selectedFilters[key];
        const valueIndex = currentValues.indexOf(value);

        if (valueIndex === -1) {
          this.selectedFilters[key] = [...currentValues, value];
        } else {
          this.selectedFilters[key] = currentValues.filter((v: any) => v !== value);

          if (this.selectedFilters[key].length === 0) {
            delete this.selectedFilters[key];
          }
        }
      }
    } else {
      this.selectedFilters[key] = value;
    }

    this.selectFiltersChange.emit({ ...this.selectedFilters });

    this.pageIndex = 0;
    try {
      const evt: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: 0 };
      this.refresh(evt);
    } catch (e) {}
  }

  clearSelectFilters() {
    this.selectedFilters = {};
    this.selectFiltersChange.emit({});
    this.pageIndex = 0;
    try {
      const evt: PageEvent = { pageIndex: 0, pageSize: this.pageSize, length: 0 };
      this.refresh(evt);
    } catch (e) {
    }
  }

  hasSelectedFilters(): boolean {
    return Object.keys(this.selectedFilters).length > 0;
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
    const value = item[column.key];

    if (column.type === 'currency') {
      try {
        const num = typeof value === 'number' ? value : parseFloat(value);
        if (!isNaN(num)) {
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
        }
      } catch (e) {
        return value;
      }
    }

    return value;
  }
}
