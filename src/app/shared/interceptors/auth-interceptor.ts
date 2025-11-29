import { SessionExpiredDialogService } from './../services/session-expired-dialog-service';
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../../domain/auth/services/session-service';

const IGNORED_URLS = [
  '/login',
];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const sessionExpiredDialogService = inject(SessionExpiredDialogService);

  const shouldIgnore = IGNORED_URLS.some(url => req.url.includes(url));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (!shouldIgnore && error.status === 401) {

        sessionService.hasSession().subscribe(hasCookie => {
          if (hasCookie.data) {
            sessionExpiredDialogService.open();
          } else {
            router.navigateByUrl('/login');
          }
        });
      }

      return throwError(() => error);
    })
  );
};

