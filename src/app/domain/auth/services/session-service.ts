import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class SessionService {

  private readonly API_URL = `${environment.apiUrl}/sessions`;
  private readonly USERNAME_KEY = 'username';
  private readonly IS_ADMIN_KEY = 'isAdmin';

  private usernameSubject = new BehaviorSubject<string>(
    localStorage.getItem(this.USERNAME_KEY) ?? 'Usuário'
  );
  username$ = this.usernameSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(
    localStorage.getItem(this.IS_ADMIN_KEY) === 'true'
  );
  isAdmin$ = this.isAdminSubject.asObservable();

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

  setIsAdmin(isAdmin: boolean) {
    localStorage.setItem(this.IS_ADMIN_KEY, isAdmin ? 'true' : 'false');
    this.isAdminSubject.next(isAdmin);
  }

  getIsAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  clearIsAdmin() {
    localStorage.removeItem(this.IS_ADMIN_KEY);
    this.isAdminSubject.next(false);
  }

  clearSession() {
    this.clearUsername();
    this.clearIsAdmin();
  }

  getSession(): Observable<void> {
    return this.httpClient.get<void>(`${this.API_URL}`, { withCredentials: true });
  }

  hasSession(): Observable<{ data: boolean }> {
    return this.httpClient.get<{ data: boolean }>(`${this.API_URL}/present`, { withCredentials: true });
  }

}
