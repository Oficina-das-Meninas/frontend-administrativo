import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../domain/auth/services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const isLoginPage = state.url === '/login';
  const token = authService.getToken();

  if (!token && !isLoginPage) {
    return router.parseUrl('/login');
  }

  if (token && isLoginPage) {
    return router.parseUrl('/');
  }

  return true;
};


