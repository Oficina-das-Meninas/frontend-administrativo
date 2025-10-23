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
        ],
      },
    ],
  },
];
