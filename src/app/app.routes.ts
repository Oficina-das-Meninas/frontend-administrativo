import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./domain/home/containers/home/home').then(
            (m) => m.Home
          ),
      },
      {
        path: 'transparencia',
        loadComponent: () =>
          import(
            './domain/transparency/containers/transparency/transparency'
          ).then((m) => m.Transparency),
        data: {
          breadcrumb: 'Transparência',
        },
      },
    ],
  },
];
