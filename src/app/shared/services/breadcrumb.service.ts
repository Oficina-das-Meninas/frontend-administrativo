import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import { Breadcrumb } from '../models/breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  constructor(private router: Router) { }

  breadcrumbs$(): Observable<Breadcrumb[]> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(this.router.routerState.snapshot),
      map(() => {
        const root = this.router.routerState.snapshot.root;
        return this.buildBreadcrumbs(root);
      })
    );
  }

  private buildBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const label = route.data['breadcrumb'];
    const path = route.url.map(segment => segment.path).join('/');

    if (path) {
      url += `/${path}`;
    }

    if (label) {
      breadcrumbs.push({ label, url });
    }

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }

}
