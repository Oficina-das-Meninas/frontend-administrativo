import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input';
import { FormHelperService } from '../../../../shared/services/form/form-helps';
import { SnackbarService } from '../../../../shared/services/snackbar-service';
import { ImageInputComponent } from '../../../events/components/image-input/image-input';
import { Partner } from '../../models/partner';
import { PartnerService } from '../../services/partner-service';

interface PartnerFormValue {
  name: string;
  previewImage: File[];
}

@Component({
  selector: 'app-partner-form',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    ImageInputComponent,
    MatTooltip,
    FormInputComponent,
  ],
  templateUrl: './partner-form.html',
  styleUrl: './partner-form.scss',
})
export class PartnerForm implements OnInit {
  private fb = inject(FormBuilder);
  private partnerService = inject(PartnerService);
  private formHelperService = inject(FormHelperService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public isEditMode = signal<boolean>(false);
  public partnerId: string | null = null;
  public existingPreviewImageUrl = signal<string>('');

  public partnerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    previewImage: [[] as File[], [Validators.required]],
  });

  ngOnInit(): void {
    this.existingPreviewImageUrl.set('');
    this.route.paramMap.subscribe(params => {
      this.partnerId = params.get('id');
      if (this.partnerId) {
        this.isEditMode.set(true);
        // Os dados já vêm resolvidos pela rota
        this.route.data.subscribe(data => {
          if (data['partner']) {
            this.loadPartnerData(data['partner']);
          }
        });
      }
    });
  }

  private loadPartnerData(partner: Partner): void {
    // Se a imagem existe na URL (foi validada pelo resolver), usa ela
    if (partner.previewImageUrl?.trim()) {
      this.existingPreviewImageUrl.set(partner.previewImageUrl);
    }

    this.partnerForm.patchValue({
      name: partner.name,
    });
  }

  onSubmit() {
    if (!this.partnerForm.valid) {
      this.formHelperService.validateAllFormFields(this.partnerForm);
      return;
    }

    const formValue = this.partnerForm.getRawValue() as unknown as PartnerFormValue;
    const formData = this.buildFormData(formValue);

    const request$ = this.isEditMode()
      ? this.partnerService.update(this.partnerId!, formData)
      : this.partnerService.create(formData);

    request$.subscribe({
      next: () => {
        const successMessage = this.isEditMode()
          ? 'Parceiro atualizado com sucesso!'
          : 'Parceiro cadastrado com sucesso!';

        this.snackbarService.success(successMessage);
        this.partnerForm.reset();
        this.router.navigate(['/parceiros']);
      },
      error: (error) => {
        const errorMessage = this.isEditMode()
          ? 'Erro ao atualizar parceiro. Tente novamente.'
          : 'Erro ao cadastrar parceiro. Tente novamente.';

        this.snackbarService.error(errorMessage);
        console.error('Erro ao salvar parceiro:', error);
      }
    });
  }

  private buildFormData(formValue: PartnerFormValue): FormData {
    const formData = new FormData();
    formData.append('name', formValue.name);

    if (formValue.previewImage && formValue.previewImage.length > 0) {
      formData.append('previewImage', formValue.previewImage[0]);
    }

    return formData;
  }

  onImageSelected(files: File[]): void {
    this.partnerForm.get('previewImage')?.setValue(files);
    this.partnerForm.get('previewImage')?.markAsTouched();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.partnerForm.get(fieldName);
    return field?.invalid ? this.formHelperService.getErrorMessage(this.partnerForm, fieldName) : '';
  }

  hasImageError(): boolean {
    const field = this.partnerForm.get('previewImage');
    return !!(field?.invalid && field?.touched);
  }

  getImageErrorMessage(): string {
    return this.hasImageError() ? 'É obrigatório selecionar uma imagem' : '';
  }

  goBack(): void {
    this.router.navigate(['/parceiros']);
  }
}
