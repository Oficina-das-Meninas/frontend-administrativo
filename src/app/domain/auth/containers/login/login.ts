import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { FormInputComponent } from "../../../../shared/components/form-input/form-input";
import { Logo } from '../../../../shared/components/logo/logo';
import { AuthService } from '../../../auth/services/auth-service';
import { LoginRequest } from '../../models/login-request';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    FormInputComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    Logo
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  errorMessage: string | null = null;
  loginForm: FormGroup;

  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

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
        next: (response) => {
          this.errorMessage = null;
          this.loginForm.reset();

          const user = response.data.user;

          if (!user.isAdmin) {
            this.errorMessage = 'Acesso restrito a administradores.';
            return;
          }

          this.sessionService.setUsername(user.name);
          this.sessionService.setIsAdmin(user.isAdmin);

          this.router.navigate(['/']);
        },
        error: (response) => {
          this.loginForm.reset();
          this.errorMessage = response.error?.message;
        }
      });
    }
  }

}
