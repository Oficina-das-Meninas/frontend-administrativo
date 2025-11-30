import { AsyncPipe, CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BadgeColorConfig, DataPage, DeleteService, TableColumn } from '../../models/data-table-helpers';
import { DateRange } from '../../models/date-range';
import { CalendarFilter } from '../calendar-filter/calendar-filter';
import { ConfirmDeleteDialog } from '../confirm-delete-dialog/confirm-delete-dialog';
import { FlowerSpinner } from '../flower-spinner/flower-spinner';
import { SearchInput } from '../search-input/search-input';

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
    AsyncPipe,
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
  @Input() removeEditAction = false;
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
    options: Array<{ value: unknown; label: string }>;
    multiple?: boolean;
  }> = [];

  @Output() selectFiltersChange = new EventEmitter<Record<string, unknown>>();

  selectedFilters: Record<string, unknown> = {};

  @Output() search = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() dateFilter = new EventEmitter<DateRange>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<{ sortField: string; sortDirection: 'asc' | 'desc' }>();
  @Output() deleteSuccess = new EventEmitter<string>();
  @Output() deleteError = new EventEmitter<any>();

  pageIndex = 0;
  pageSize = 10;
  viewMode: 'cards' | 'table' = 'cards';
  isMobile = false;
  itemToDelete: T | null = null;

  currentSortField: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

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

  @HostListener('window:resize')
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
      this.viewMode = 'table';
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

  onSelectFilterChange(key: string, value: unknown) {
    const filterDef = this.selectFilters.find(f => f.key === key);
    const isMultiple = filterDef?.multiple === true;

    if (value === undefined || value === null) {
      delete this.selectedFilters[key];
    } else if (isMultiple) {
      if (!this.selectedFilters[key]) {
        this.selectedFilters[key] = [value];
      } else {
        const currentValues = this.selectedFilters[key] as unknown[];
        const valueIndex = currentValues.indexOf(value);

        if (valueIndex === -1) {
          this.selectedFilters[key] = [...currentValues, value];
        } else {
          this.selectedFilters[key] = currentValues.filter((v: unknown) => v !== value);

          if ((this.selectedFilters[key] as unknown[]).length === 0) {
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

  onSortChange(column: TableColumn) {
    if (!column.sortable) return;

    const sortField = column.sortField || column.key;

    if (this.currentSortField === sortField) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = sortField;
      this.currentSortDirection = 'asc';
    }

    this.sortChange.emit({
      sortField,
      sortDirection: this.currentSortDirection
    });

    this.pageIndex = 0;
  }

  getSortIndicator(column: TableColumn): string {
    if (!column.sortable) return '';
    const sortField = column.sortField || column.key;
    if (this.currentSortField !== sortField) return '';
    return this.currentSortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  navigateToCreate() {
    this.router.navigate([`${this.basePath}/cadastro`]);
  }

  navigateToEdit(id: string) {
    this.router.navigate([`${this.basePath}/editar`, id]);
  }

  confirmDelete(item: T) {
    this.itemToDelete = item;

    const itemTitle = String((item as Record<string, unknown>)[this.titleProperty]) || 'este item';

    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      data: { title: itemTitle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.deleteService && this.itemToDelete) {
        this.deleteService.delete(this.itemToDelete.id).subscribe({
          next: (response: any) => {
            const message = response?.message || 'Item excluído com sucesso';
            this.deleteSuccess.emit(message);
            this.pageChange.emit({
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              length: 0
            });
          },
          error: (error) => {
            console.error('Erro ao excluir item:', error);
            this.deleteError.emit(error);
          }
        });
      }
      this.itemToDelete = null;
    });
  }

  getCellValue(item: T, column: TableColumn): unknown {
    return item[column.key as keyof T];
  }

  getBadgeStyles(value: unknown, column: TableColumn | { badgeConfig?: BadgeColorConfig }): { bgColor: string; textColor: string } | null {
    if (!value || !column.badgeConfig) {
      return this.getDefaultBadgeStyles();
    }

    const valueKey = String(value).toLowerCase();
    const colorName = column.badgeConfig[valueKey];

    if (!colorName) {
      return this.getDefaultBadgeStyles();
    }

    const bgColor = `bg-${colorName}-200`;
    const textColor = `text-${colorName}-900`;

    return { bgColor, textColor };
  }

  private getDefaultBadgeStyles() {
    return {
      bgColor: 'bg-gray-200',
      textColor: 'text-gray-900'
    };
  }

  isFilterValueSelected(key: string, value: unknown): boolean {
    const filter = this.selectedFilters[key];
    if (Array.isArray(filter)) {
      return filter.indexOf(value) > -1;
    }
    return false;
  }

  getSelectedFiltersArray(key: string): unknown[] {
    const filter = this.selectedFilters[key];
    return Array.isArray(filter) ? filter : [];
  }

  formatCurrencyValue(value: any): string {
    if (value === null || value === undefined) return '';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  }

  formatDateValue(value: unknown): string | null {
    if (value instanceof Date) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear();
      return `${day}/${month}/${year}`;
    }
    if (typeof value === 'string') {
      try {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch {
        return null;
      }
    }
    if (typeof value === 'number') {
      try {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch {
        return null;
      }
    }
    return null;
  }
}
