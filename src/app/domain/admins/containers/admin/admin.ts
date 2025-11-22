import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { AdminsService } from '../../services/admin-service';
import { Admin as AdminModel } from '../../models/admin';
import { SnackbarService } from '../../../../shared/services/snackbar-service';

@Component({
	selector: 'app-admin',
	imports: [
		Dialog,
		ReactiveFormsModule,
		FormInputComponent,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatCardModule
	],
	templateUrl: './admin.html',
	styleUrl: './admin.scss'
})
export class Admin {
	@ViewChild('addAdminDialog') addAdminDialog!: TemplateRef<any>;

	adminForm: FormGroup;

	private dialog = inject(MatDialog);
	private formBuilder = inject(FormBuilder);
	private adminsService = inject(AdminsService);
	private snackbar = inject(SnackbarService);

	constructor() {
		this.adminForm = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(100)]],
			email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
			password: ['', [Validators.required, Validators.maxLength(14)]]
		});
	}

	openAddAdminDialog() {
		this.dialog.open(this.addAdminDialog);
	}

	onAddAdmin() {
		if (this.adminForm.valid) {
			const data: AdminModel = this.adminForm.value;
			this.adminsService.createAdmin(data).subscribe({
				next: (response) => {
					this.snackbar.success(response.message);
					this.dialog.closeAll();
					this.adminForm.reset();
				},
				error: (err) => this.snackbar.error(err.error?.message)
			});
		}
	}

}

