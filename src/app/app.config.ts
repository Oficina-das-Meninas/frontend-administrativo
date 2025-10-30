import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CookieService } from 'ngx-cookie-service';

registerLocaleData(localePt);

function configureMatPaginatorIntl() {
  const matPaginatorIntl = new MatPaginatorIntl();
  matPaginatorIntl.itemsPerPageLabel = 'Items por página:';
  matPaginatorIntl.nextPageLabel = 'Próxima página';
  matPaginatorIntl.previousPageLabel = 'Página anterior';
  matPaginatorIntl.firstPageLabel = 'Primeira página';
  matPaginatorIntl.lastPageLabel = 'Última página';
  matPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };
  return matPaginatorIntl;
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    CookieService,
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: MatPaginatorIntl, useFactory: configureMatPaginatorIntl }
  ]
};
