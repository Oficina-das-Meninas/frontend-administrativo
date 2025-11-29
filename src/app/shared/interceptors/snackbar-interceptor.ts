import { inject } from "@angular/core";
import { SnackbarService } from "../services/snackbar-service";
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";

const IGNORED_URLS = [
  '/sessions',
  '/login',
  '/logout',
];

const IGNORED_METHODS: string[] = ['GET'];

export const snackbarInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const snackbarService = inject(SnackbarService);

  const ignoreByUrl = IGNORED_URLS.some(url => req.url.includes(url));
  const ignoreByMethod = IGNORED_METHODS.includes(req.method);

  const shouldIgnore = ignoreByUrl || ignoreByMethod;

  return next(req).pipe(
    tap((event) => {
      if (shouldIgnore) return;

      if (event instanceof HttpResponse) {
        const body = event.body as any;
        const message = body?.message;

        if (message) {
          snackbarService.success(message);
        }
      }
    }),

    catchError((error: HttpErrorResponse) => {
      if (!shouldIgnore) {
        const message = error.error?.message;

        if (message) {
          snackbarService.error(message);
        }
      }

      return throwError(() => error);
    })
  );
};
