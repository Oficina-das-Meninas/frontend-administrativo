import { Component, input } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../../models/navItem';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatIcon,
    RouterLink,
    RouterLinkActive,
],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  sidenavItems = input.required<NavItem[]>();

}
