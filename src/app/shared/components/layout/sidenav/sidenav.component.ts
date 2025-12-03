import { Component, input } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../../models/nav-item';
import { Logo } from '../../logo/logo';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatIcon,
    RouterLink,
    RouterLinkActive,
    Logo
],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  sidenavItems = input.required<NavItem[]>();

}
