import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./domain/home/containers/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'transparencia',
                loadComponent: () => import('./domain/transparency/containers/transparency/transparency.component').then(m => m.TransparencyComponent),
                data: {
                    breadcrumb: 'Transparência'
                },
            },
            {
              path: 'eventos',
              data: {
                breadcrumb: 'Eventos'
              },
              children: [
                {
                  path: '',
                  loadComponent: () => import('./domain/events/containers/events/events').then(m => m.Events)
                },
                {
                  path: 'criar',
                  loadComponent: () => import('./domain/events/containers/add-event/add-event').then(m => m.AddEventComponent),
                  data: {
                      breadcrumb: 'Criar Evento'
                  }
                }
              ]
            },
        ]
    }
];
