import { Component, inject } from '@angular/core';
import { FormInputComponent } from "../../../../shared/components/form-input/form-input";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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

  loginForm: FormGroup;

  private formBuilder = inject(FormBuilder);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {

  }

}
