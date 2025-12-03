import {
  Component,
  TemplateRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { SnackbarService } from '../../../../shared/services/snackbar-service';
import { PageEvent } from '@angular/material/paginator';
import { switchMap } from 'rxjs';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { TableColumn } from '../../../../shared/models/data-table-helpers';
import { AdminsService } from '../../services/admin-service';

@Component({
  selector: 'app-admins',
  imports: [
    Dialog,
    ReactiveFormsModule,
    FormInputComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    DataTable,
  ],
  templateUrl: './admins.html',
})
export class Admins {
  @ViewChild('addAdminDialog') addAdminDialog!: TemplateRef<any>;

  private adminService = inject(AdminsService);
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  private snackbar = inject(SnackbarService);

  searchTerm = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);

  private refreshSignal = signal(0);

  adminForm: FormGroup;

  columns: TableColumn[] = [
    { key: 'name', header: 'Nome', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' },
  ];

  private filterState = computed(() => ({
    page: this.pageIndex(),
    pageSize: this.pageSize(),
    searchTerm: this.searchTerm() || undefined,
    refresh: this.refreshSignal(),
  }));

  admins$ = toObservable(this.filterState).pipe(
    switchMap((state) =>
      this.adminService.getFilteredAdmins({
        page: state.page,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm,
      })
    )
  );

  deleteService = {
    delete: (id: string) => {
      return this.adminService.deleteAdmin(id);
    },
  };

  constructor() {
    this.adminForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      password: ['', [Validators.required, Validators.maxLength(14)]],
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onClearSearch() {
    this.searchTerm.set('');
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
        },
        error: (err) => this.snackbar.error(err.error?.message),
        complete: () => this.refresh(),
      });
    }
  }

  onDeleteSuccess(message: string) {
    this.snackbar.success(message);
    this.refresh();
  }

  onDeleteError(error: any) {
    this.snackbar.error(
      error.error?.message || 'Erro ao excluir administrador'
    );
  }

  private refresh() {
    this.refreshSignal.update((v) => v + 1);
  }
}
