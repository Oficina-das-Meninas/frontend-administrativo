import { Component, inject, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { DataPage, TableColumn } from '../../../shared/models/data-table-helpers';
import { Donation } from '../models/donation';
import { Observable } from 'rxjs';
import { DonationsService } from '../services/donations-service';
import { DateRange } from '../../../shared/models/date-range';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-donations',
  imports: [ DataTable, CommonModule ],
  templateUrl: './donations.html'
})
export class Donations implements AfterViewInit {
  @ViewChild('donationTypeTemplate') donationTypeTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  donations$: Observable<DataPage<Donation>> | null = null;

  columns: TableColumn[] = [
    { key: 'donorName', header: 'Doador', type: 'text', sortable: true, sortField: 'donorName' },
    { key: 'value', header: 'Valor Bruto', type: 'currency', sortable: true, sortField: 'value' },
    { key: 'valueLiquid', header: 'Valor Líquido', type: 'currency', sortable: true, sortField: 'valueLiquid' },
    { key: 'donationAt', header: 'Data', type: 'date', sortable: true, sortField: 'donationAt' },
    {
      key: 'donationType',
      header: 'Tipo',
      type: 'custom',
      sortable: true,
      sortField: 'donationType'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'custom',
      sortable: true,
      sortField: 'status'
    }
  ];

  searchTerm = '';
  currentFilters: Record<string, unknown> = {};
  pageIndex = 0;
  pageSize = 10;
  currentSortField: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  private donationService = inject(DonationsService);

  ngOnInit() {
    this.loadDonationsWithFilters();
  }

  ngAfterViewInit() {
    const donationTypeColumn = this.columns.find(col => col.key === 'donationType');
    if (donationTypeColumn && this.donationTypeTemplate) {
      donationTypeColumn.cellTemplate = this.donationTypeTemplate;
    }

    const statusColumn = this.columns.find(col => col.key === 'status');
    if (statusColumn && this.statusTemplate) {
      statusColumn.cellTemplate = this.statusTemplate;
    }
  }

  getBadgeStyles(value: string): { bgColor: string; textColor: string } {
    const colors: Record<string, { bgColor: string; textColor: string }> = {
      'ativa': { bgColor: 'bg-green-200', textColor: 'text-green-900' },
      'inativa': { bgColor: 'bg-gray-200', textColor: 'text-gray-900' },
      'pendente': { bgColor: 'bg-yellow-200', textColor: 'text-yellow-900' },
      'concluído': { bgColor: 'bg-green-200', textColor: 'text-green-900' },
      'cancelado': { bgColor: 'bg-red-200', textColor: 'text-red-900' }
    };
    return colors[value.toLowerCase()] || { bgColor: 'bg-gray-200', textColor: 'text-gray-900' };
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadDonationsWithFilters();
  }

  onDateFilter(dateRange: DateRange) {
    this.currentFilters['startDate'] = dateRange.start || undefined;
    this.currentFilters['endDate'] = dateRange.end || undefined;
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onClearFilters() {
    this.searchTerm = '';
    this.currentFilters = {};
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onSelectFiltersChange(selected: Record<string, unknown>) {
    const { status, type, ...otherFilters } = this.currentFilters as Record<string, unknown>;

    this.currentFilters = { ...otherFilters, ...selected };

    Object.keys(this.currentFilters).forEach(k => {
      if (this.currentFilters[k] === undefined || this.currentFilters[k] === null || (Array.isArray(this.currentFilters[k]) && this.currentFilters[k].length === 0)) {
        delete this.currentFilters[k];
      }
    });
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onSortChange(event: { sortField: string; sortDirection: 'asc' | 'desc' }) {
    this.currentSortField = event.sortField;
    this.currentSortDirection = event.sortDirection;
    this.currentFilters['sortField'] = event.sortField;
    this.currentFilters['sortDirection'] = event.sortDirection;
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  private loadDonationsWithFilters() {
    this.currentFilters = {
      ...this.currentFilters,
      page: this.pageIndex,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined
    };

    this.donations$ = this.donationService.getFilteredDonations(this.currentFilters);
  }
}
