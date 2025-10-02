import { Routes } from '@angular/router';
import { partnerResolver } from './domain/partners/guards/partner-resolver';

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
          import('./domain/home/containers/home/home').then((m) => m.Home),
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
      {
        path: 'parceiros',
        data: {
          breadcrumb: 'Parceiros',
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./domain/partners/containers/partners/partners').then(
                (m) => m.Partners
              ),
          },
          {
            path: 'cadastro',
            loadComponent: () =>
              import(
                './domain/partners/containers/partner-form/partner-form'
              ).then((m) => m.PartnerForm),
            data: {
              breadcrumb: 'Cadastro',
            },
            resolve: {
              partner: partnerResolver,
            },
          },
        ],
      },
    ],
  },
];
