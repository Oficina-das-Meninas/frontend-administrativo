import { Component, inject } from '@angular/core';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import {
  DataPage,
  TableColumn,
} from '../../../../shared/models/data-table-helpers';
import { Observable } from 'rxjs';
import { Donor } from '../../models/donor';
import { DonorService } from '../../services/donor-service';

@Component({
  selector: 'app-donors',
  imports: [DataTable],
  templateUrl: './donors.html',
  styleUrl: './donors.scss',
})
export class Donors {
  donors$: Observable<DataPage<Donor>> | null = null;

  columns: TableColumn[] = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Celular' },
    { key: 'badge', header: 'Badge' },
  ];

  searchTerm = '';
  pageIndex = 0;
  pageSize = 10;

  private donorService = inject(DonorService);

  ngOnInit() {
    this.loadDonorsWithFilters();
  }

  loadDonorsWithFilters() {
    this.donors$ = this.donorService.getDonors(
      this.searchTerm || undefined,
      this.pageIndex,
      this.pageSize
    );
  }

  onPageChange(pageEvent: any) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadDonorsWithFilters();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }

  onClearFilters() {
    this.pageIndex = 0;
    this.loadDonorsWithFilters();
  }
}
