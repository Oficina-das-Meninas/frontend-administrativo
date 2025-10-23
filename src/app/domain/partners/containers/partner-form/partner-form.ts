import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartnerService } from '../../services/partner-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Partner } from '../../models/partner';
import { FormHelperService } from '../../../../shared/services/form/form-helper-service';

@Component({
  selector: 'app-partner-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './partner-form.html',
  styleUrl: './partner-form.scss',
})
export class PartnerForm {
  form!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  private location = inject(Location);
  private route = inject(ActivatedRoute)
  private _snackBar = inject(MatSnackBar);

  formHelperService = inject(FormHelperService);

  ngOnInit() {
    const partner: Partner = this.route.snapshot.data['partner'];
    this.form = this.formBuilder.group({
      id: [partner.id],
      name: [partner.name],
      previewImage: [partner.previewImageUrl],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.partnerService.save(this.form.value).subscribe({
        next: () => {
          this.openSnackBar('Parceiro salvo com sucesso!');
          this.onCancel();
        },
        error: () => {
          this.openSnackBar('Erro ao salvar parceiro.');
        },
      });
    } else {
      this.formHelperService.validateAllFormFields(this.form);
    }
  }

  onCancel() {
    this.location.back();
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
