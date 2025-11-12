import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../../../domain/auth/services/session-service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  const isLoginPage = state.url === '/login';

  return sessionService.getSession().pipe(
    map(() => {
      if (isLoginPage) {
        return router.parseUrl('/');
      }
      return true;
    }),
    catchError(() => {
      if (!isLoginPage) {
        return of(router.parseUrl('/login'));
      }
      return of(true);
    })
  );
  
};



