import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;

  private cookieService = inject(CookieService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
      tap((response: LoginResponse) => {
        this.cookieService.set(
          'token',             
          response.token,      
          1,                   
          '/',                
          undefined,                
          false,               
          'Lax'                
        );
        this.router.navigate(['/']);
      })
    );
  }

  logout(): string {
    this.cookieService.delete('token');
    return 'login';
  }

  getToken(): string | null {
    const token = this.cookieService.get('token');
    return token ? token : null;
  }

}
