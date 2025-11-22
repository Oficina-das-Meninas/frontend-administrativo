import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Admin } from '../models/admin';

@Injectable({ providedIn: 'root' })
export class AdminsService {
  private readonly API_URL = `${environment.apiUrl}/admins`;
  private http = inject(HttpClient);

  createAdmin(data: Admin): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(`${this.API_URL}`, data, { withCredentials: true });
  }

  deleteAdmin(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`, { withCredentials: true });
  }
}
