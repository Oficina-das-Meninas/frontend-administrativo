import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../../models/nav-item';
import { Profile } from '../../models/profile';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, RouterOutlet, MatMenuModule, HeaderComponent, SidenavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  isMobile: boolean = false;
  sidenavItems: NavItem[] = [];
  menuItems: NavItem[] = [];
  profile!: Profile;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
    this.sidenavItems = [
      {
        matIcon: 'home',
        title: 'Início',
        path: '/',
      },
      {
        matIcon: 'handshake',
        title: 'Transparência',
        path: '/transparencia',
      },
      {
        matIcon: 'calendar_month',
        title: 'Eventos',
        path: '/eventos',
      },
      {
        matIcon: 'business',
        title: 'Parceiros',
        path: '/parceiros',
      },
    ];

    this.menuItems = [
      {
        matIcon: 'logout',
        title: 'Sair',
        path: '/logout',
      },
    ];

    this.profile = {
      username: 'Usuário Logado',
      role: 'Cargo',
    };
  }

}
