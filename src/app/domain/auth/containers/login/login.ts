import { Component, inject } from '@angular/core';
import { FormInputComponent } from "../../../../shared/components/form-input/form-input";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth-service';
import { LoginRequest } from '../../models/login-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    FormInputComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  isInvalidRequest = false;
  loginForm: FormGroup;

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const data: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }

      this.authService.login(data).subscribe({
        next: () => {
          this.loginForm.reset();
        },
        error: () => {
          this.loginForm.reset();
          this.isInvalidRequest = true;
        }
      });
    }
  }

  handlePasswordErrorMessage(): string {
    const passwordErrors = this.loginForm.get('password')?.errors;

    if (passwordErrors) {
      if (passwordErrors['maxlength']) {
        return "Senha muito longa";
      }
    }

    return "Senha inválida";
  }

}
