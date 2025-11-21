import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly API_URL = `${environment.apiUrl}/sessions`;
  
  private httpClient = inject(HttpClient);

  getSession(): Observable<void> {
    return this.httpClient.get<void>(`${this.API_URL}`, { withCredentials: true });
  }

}
