import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormInputComponent } from "../../../../shared/components/form-input/form-input";
import { Logo } from '../../../../shared/components/logo/logo';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule,
    FormInputComponent,
    Logo,
],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  form!: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  loadingRequest = signal(false);
  tokenValid = signal(true);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  token: string | null = null;

  constructor() {
    this.form = new FormGroup(
      {
        password: new FormControl<string>(null!, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl<string>(null!, [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];

      if (!this.token) {
        this.tokenValid.set(false);
        this.snackBar.open('Token inválido ou expirado.', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
        return;
      }

      this.validateToken();
    });
  }

  private validateToken() {
    if (!this.token) return;

    this.authService.validateResetToken(this.token).subscribe({
      next: () => {
        this.tokenValid.set(true);
      },
      error: (err: unknown) => {
        this.tokenValid.set(false);

        let message = 'Token inválido ou expirado. Solicite um novo link.';

        if (err instanceof Object && 'status' in err) {
          const status = (err as Record<string, unknown>)['status'];
          if (status === 400) {
            message = 'O link de recuperação expirou. Solicite um novo.';
          } else if (status === 401) {
            message = 'Token não autenticado. Solicite um novo link.';
          }
        }

        this.snackBar.open(message, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = control.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['passwordMismatch'];
      }
    }

    return null;
  }

  onSubmit() {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingRequest.set(true);
    const { password } = this.form.getRawValue();

    this.authService
      .resetPassword(this.token, { newPassword: password })
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Senha alterada com sucesso! Redirecionando para login...',
            'Fechar',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-success'],
            }
          );

          this.loadingRequest.set(false);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: unknown) => {
          let message =
            'Ocorreu um erro inesperado. Tente novamente mais tarde.';

          if (err instanceof Object && 'status' in err) {
            const status = (err as Record<string, unknown>)['status'];
            if (status === 400) {
              message = 'Falha ao atualizar a senha. Tente novamente.';
            } else if (status === 401) {
              message = 'Token expirado. Solicite um novo link.';
            }
          }

          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          });

          this.loadingRequest.set(false);
        },
      });
  }

  handlePasswordErrorMessage(): string {
    const passwordErrors = this.form.get('password')?.errors;

    if (passwordErrors) {
      if (passwordErrors['required']) {
        return "Informe uma senha";
      }
      if (passwordErrors['minlength']) {
        return "A senha deve conter no mínimo 6 caracteres";
      }
      if (passwordErrors['maxlength']) {
        return "Senha muito longa";
      }
    }

    return "Senha inválida";
  }

  handleConfirmPasswordErrorMessage(): string {
    const confirmErrors = this.form.get('confirmPassword')?.errors;

    if (confirmErrors) {
      if (confirmErrors['required']) {
        return "Confirme a senha";
      }
      if (confirmErrors['passwordMismatch']) {
        return "As senhas não correspondem";
      }
    }

    return "Senha inválida";
  }

}
