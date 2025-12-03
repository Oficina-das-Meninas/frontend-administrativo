import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../../domain/auth/services/session-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  if (sessionService.getIsAdmin()) {
    return true;
  }

  return router.parseUrl('/login');
};
