import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  const isLoginPage = state.url === '/login';

  if (!token && !isLoginPage) {
    return router.parseUrl('/login');
  }

  if (token && isLoginPage) {
    return router.parseUrl('/');
  }

  return true;
};


