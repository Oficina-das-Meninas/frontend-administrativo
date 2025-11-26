import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../../../domain/auth/services/session-service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  return sessionService.getSession().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/login')))
  );
};

