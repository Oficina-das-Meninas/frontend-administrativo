import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Breadcrumb } from '../../../models/breadcrumb';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    RouterLink, 
    AsyncPipe, 
    MatIcon,
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  breadcrumbs$!: Observable<Breadcrumb[]>;

  constructor(private breadcrumbService: BreadcrumbService) { 
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$()
  }

}
