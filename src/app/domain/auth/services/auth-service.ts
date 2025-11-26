import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;

  private httpClient = inject(HttpClient);

  login(data: LoginRequest): Observable<{ data: LoginResponse }> {
    return this.httpClient.post<{ data: LoginResponse }>(`${this.API_URL}/login`, data, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.httpClient.get<void>(`${this.API_URL}/logout`, { withCredentials: true });
  }

}
