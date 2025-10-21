import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

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
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useFactory: configureMatPaginatorIntl }
  ]
};
