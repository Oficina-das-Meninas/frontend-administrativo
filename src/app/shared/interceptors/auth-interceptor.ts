import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

const IGNORED_URLS = [
  '/login',
];

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);

  const shouldIgnore = IGNORED_URLS.some(url => req.url.includes(url));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (!shouldIgnore && error.status === 401) {
        router.navigateByUrl('/logout');
      }

      return throwError(() => error);
    })
  );
};

