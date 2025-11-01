import { TableColumn, DataPage } from './../../../../shared/models/data-table-helpers';
import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { Partner } from '../../models/partner';
import { PartnerFilters, PartnerService } from '../../services/partner-service';

@Component({
  selector: 'app-partners',
  imports: [DataTable],
  templateUrl: './partners.html',
  styleUrl: './partners.scss'
})
export class Partners implements OnInit {
  partners$: Observable<DataPage<Partner>> | null = null;

  columns: TableColumn[] = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'previewImageUrl', header: 'Logo', type: 'image' }
  ];

  searchTerm = '';
  currentFilters: PartnerFilters = {};
  pageIndex = 0;
  pageSize = 10;

  partnerService = inject(PartnerService);

  ngOnInit() {
    this.loadPartnersWithFilters();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadPartnersWithFilters();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadPartnersWithFilters();
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.loadPartnersWithFilters();
  }

  onClearFilters() {
    this.searchTerm = '';
    this.currentFilters = {};
    this.pageIndex = 0;
    this.loadPartnersWithFilters();
  }

  private loadPartnersWithFilters() {
    this.currentFilters = {
      ...this.currentFilters,
      page: this.pageIndex,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined
    };

    this.partners$ = this.partnerService.getFilteredPartners(this.currentFilters);
  }
}
