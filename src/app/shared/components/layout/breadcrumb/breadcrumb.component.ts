import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Breadcrumb } from '../../../models/breadcrumb';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterLink, 
    AsyncPipe, 
    MatIcon,
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  private breadcrumbService = inject(BreadcrumbService);
  breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbService.breadcrumbs$();

}
