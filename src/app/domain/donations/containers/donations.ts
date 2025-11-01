import { Component, inject } from '@angular/core';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { DataPage, TableColumn } from '../../../shared/models/data-table-helpers';
import { Donation } from '../models/donation';
import { Observable } from 'rxjs';
import { DonationsService } from '../services/donations-service';

@Component({
  selector: 'app-donations',
  imports: [ DataTable ],
  templateUrl: './donations.html',
  styleUrl: './donations.scss'
})
export class Donations {
  donations$: Observable<DataPage<Donation>> | null = null;

  columns: TableColumn[] = [
    { key: 'donorName', header: 'Doador', type: 'text' },
    { key: 'value', header: 'Valor', type: 'currency' },
    { key: 'donationAt', header: 'Data', type: 'date' },
    { key: 'donationType', header: 'Tipo', type: 'donation-type-badge' },
    { key: 'status', header: 'Status', type: 'text' }
  ];

  searchTerm = '';
  currentFilters: any = {};
  pageIndex = 0;
  pageSize = 10;

  private donationService = inject(DonationsService);

  ngOnInit() {
    this.loadDonationsWithFilters();
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

  onPageChange(pageEvent: any) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadDonationsWithFilters();
  }

  onDateFilter(dateRange: any) {
    this.currentFilters.startDate = dateRange.start || undefined;
    this.currentFilters.endDate = dateRange.end || undefined;
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onClearFilters() {
    this.searchTerm = '';
    this.currentFilters = {};
    this.pageIndex = 0;
    this.loadDonationsWithFilters();
  }

  onSelectFiltersChange(selected: Record<string, any>) {
    const { status, type, ...otherFilters } = this.currentFilters;

    this.currentFilters = { ...otherFilters, ...selected };

    Object.keys(this.currentFilters).forEach(k => {
      if (this.currentFilters[k] === undefined || this.currentFilters[k] === null || (Array.isArray(this.currentFilters[k]) && this.currentFilters[k].length === 0)) {
        delete this.currentFilters[k];
      }
    });
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
