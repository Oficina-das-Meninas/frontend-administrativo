import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { DataPage, TableColumn } from '../../../../shared/models/data-table-helpers';
import { AdminsService, AdminFilters } from '../../services/admin-service';
import { Admin } from '../../models/admin';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [DataTable],
  templateUrl: './admins.html',
})
export class Admins implements OnInit {

  admins$: Observable<DataPage<Admin>> | null = null;

  columns: TableColumn[] = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' }
  ];

  searchTerm = '';
  pageIndex = 0;
  pageSize = 10;

  private adminService = inject(AdminsService);

  ngOnInit() {
    this.loadAdminWithFilters();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageIndex = 0;
    this.loadAdminWithFilters();
  }

  onClearSearch() {
    this.searchTerm = '';
    this.pageIndex = 0;
    this.loadAdminWithFilters();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAdminWithFilters();
  }

  private loadAdminWithFilters() {
    this.admins$ = this.adminService.getFilteredAdmins({
      page: this.pageIndex,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined
    });
    console.log(this.admins$)
  }
}
