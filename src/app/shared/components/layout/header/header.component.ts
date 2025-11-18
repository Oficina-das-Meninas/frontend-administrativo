import { Component, input, output } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NavItem } from '../../../models/nav-item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatMenuModule,
    BreadcrumbComponent,
    MatMenuTrigger,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuItems = input<NavItem[]>();
  username = input.required<string>();
  isMobile = input.required<boolean>();
  menuToggle = output<void>();

  onMenuClick() {
    this.menuToggle.emit();
  }
}
