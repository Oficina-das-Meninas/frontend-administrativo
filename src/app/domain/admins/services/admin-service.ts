import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Admin } from '../models/admin';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { ApiPagedResponse } from '../../../shared/models/api-response';
import { AdminResponse } from '../models/admin-response';


export interface AdminFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminsService {
  private readonly API_URL = `${environment.apiUrl}/admins`;
  private http = inject(HttpClient);

  list(page: number, size: number): Observable<DataPage<Admin>> {
    return this.getFilteredAdmins({
      page,
      pageSize: size
    });
  }

  getFilteredAdmins(filters: AdminFilters): Observable<DataPage<Admin>> {
    let params = new HttpParams()
      .set('page', (filters.page ?? 0).toString())
      .set('pageSize', (filters.pageSize ?? 10).toString());

    if (filters.searchTerm?.trim()) {
      params = params.set('searchTerm', filters.searchTerm.trim());
    }

    return this.http
      .get<ApiPagedResponse<Admin>>(this.API_URL, { params, withCredentials: true })
      .pipe(
        map((resp) => {
          const contents = resp.data?.contents ?? [];

          return {
            data: contents, 
            totalElements: resp.data?.totalElements ?? 0,
            totalPages: resp.data?.totalPages ?? 0
          } as DataPage<Admin>;
        })
      );
  }

  getById(adminId: string): Observable<Admin> {
    return this.http
      .get<AdminResponse>(`${this.API_URL}/${adminId}`, { withCredentials: true })
      .pipe(map((response) => ({ ...response.data })));
  }

  createAdmin(data: Admin): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}`, data, {
      withCredentials: true
    });
  }

  deleteAdmin(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`, {
      withCredentials: true
    });
  }

  getAll(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.API_URL}`, { withCredentials: true });
  }

  
}
