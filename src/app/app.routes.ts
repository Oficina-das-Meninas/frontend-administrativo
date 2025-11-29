import { Routes } from '@angular/router';
import { eventResolver } from './domain/events/guards/event-resolver';
import { partnerResolver } from './domain/partners/guards/partner-resolver';
import { unsavedChangesGuard } from './shared/guards/unsaved-changes.guard';
import { authGuard } from './shared/guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./domain/auth/containers/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./domain/dashboard/containers/dashboard/dashboard').then((m) => m.Dashboard),
        data: {
          breadcrumb: 'Dashboard',
        },
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
            canDeactivate: [unsavedChangesGuard],
            data: {
              breadcrumb: 'Cadastro de Evento',
            },
          },
          {
            path: 'editar/:id',
            resolve: {
              event: eventResolver,
            },
            loadComponent: () =>
              import('./domain/events/containers/form-event/form-event').then(
                (m) => m.FormEventComponent
              ),
            canDeactivate: [unsavedChangesGuard],
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
          {
            path: 'cadastro',
            loadComponent: () =>
              import(
                './domain/partners/containers/partner-form/partner-form'
              ).then((m) => m.PartnerForm),
            canDeactivate: [unsavedChangesGuard],
            data: {
              breadcrumb: 'Cadastro de Parceiro',
            },
          },
          {
            path: 'editar/:id',
            resolve: {
              partner: partnerResolver,
            },
            loadComponent: () =>
              import(
                './domain/partners/containers/partner-form/partner-form'
              ).then((m) => m.PartnerForm),
            canDeactivate: [unsavedChangesGuard],
            data: {
              breadcrumb: 'Edição de Parceiro',
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
      },
      {
        path: 'doadores',
        loadComponent: () =>
          import('./domain/donors/containers/donors/donors').then(
            (m) => m.Donors
          ),
        data: {
          breadcrumb: 'Doadores',
        },
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
