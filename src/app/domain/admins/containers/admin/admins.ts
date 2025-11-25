import { Component, TemplateRef, ViewChild, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { SnackbarService } from '../../../../shared/services/snackbar-service';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { DataPage, TableColumn } from '../../../../shared/models/data-table-helpers';
import { AdminsService, AdminFilters } from '../../services/admin-service';
import { Admin } from '../../models/admin';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [
    Dialog,
    ReactiveFormsModule,
    FormInputComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    DataTable
  ],
  templateUrl: './admins.html',
})
export class Admins implements OnInit {

  @ViewChild('addAdminDialog') addAdminDialog!: TemplateRef<any>;

  adminForm: FormGroup;

  admins$: Observable<DataPage<Admin>> | null = null;

  columns: TableColumn[] = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' }
  ];

  searchTerm = '';
  pageIndex = 0;
  pageSize = 10;

  private adminService = inject(AdminsService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  private snackbar = inject(SnackbarService);

  constructor() {
    this.adminForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(14)]]
    });
  }

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

  openAddAdminDialog() {
    this.dialog.open(this.addAdminDialog);
  }

  onAddAdmin() {
    if (this.adminForm.valid) {
      const data = this.adminForm.value;
      this.adminService.createAdmin(data).subscribe({
        next: (response) => {
          this.snackbar.success(response.message);
          this.dialog.closeAll();
          this.adminForm.reset();
          this.loadAdminWithFilters();
        },
        error: (err) => this.snackbar.error(err.error?.message)
      });
    }
  }
}
