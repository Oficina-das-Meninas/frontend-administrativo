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
          import('./domain/transparency/containers/transparency/transparency').then(
            (m) => m.Transparency
          ),
        data: {
          breadcrumb: 'Transparência',
        },
      },
      {
        path: 'eventos',
        data: {
          breadcrumb: 'Eventos',
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./domain/events/containers/events/events').then(
                (m) => m.Events
              ),
          },
          {
            path: 'cadastro',
            loadComponent: () =>
              import('./domain/events/containers/form-event/form-event').then(
                (m) => m.FormEventComponent
              ),
            data: {
              breadcrumb: 'Cadastro de Evento',
            },
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('./domain/events/containers/form-event/form-event').then(
                (m) => m.FormEventComponent
              ),
            data: {
              breadcrumb: 'Edição de Evento',
            },
          },
        ],
      },
      {
        path: 'doacoes',
        loadComponent: () =>
          import('./domain/donations/containers/donations').then(
            (m) => m.Donations
          ),
        data: {
          breadcrumb: 'Doações',
        },
      }
    ],
  },
];
