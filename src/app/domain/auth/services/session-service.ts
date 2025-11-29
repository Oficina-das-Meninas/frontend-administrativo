import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SessionService {

  private readonly API_URL = `${environment.apiUrl}/sessions`;
  private readonly USERNAME_KEY = 'username';

  private usernameSubject = new BehaviorSubject<string>(
    localStorage.getItem(this.USERNAME_KEY) ?? 'Usuário'
  );
  username$ = this.usernameSubject.asObservable();

  private httpClient = inject(HttpClient);

  setUsername(username: string) {
    localStorage.setItem(this.USERNAME_KEY, username);
    this.usernameSubject.next(username);
  }

  getUsername(): string {
    return this.usernameSubject.value;
  }

  clearUsername() {
    localStorage.removeItem(this.USERNAME_KEY);
    this.usernameSubject.next('Usuário');
  }

  getSession(): Observable<void> {
    return this.httpClient.get<void>(`${this.API_URL}`, { withCredentials: true });
  }

  hasSession(): Observable<{ data: boolean }> {
    return this.httpClient.get<{ data: boolean }>(`${this.API_URL}/present`, { withCredentials: true });
  }

}
