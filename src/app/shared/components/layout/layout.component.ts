import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { NavItem } from '../../models/nav-item';
import { Profile } from '../../models/profile';
import { SessionService } from '../../../domain/auth/services/session-service';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    MatMenuModule,
    HeaderComponent,
    SidenavComponent,
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  isMobile: boolean = false;
  sidenavItems: NavItem[] = [];
  menuItems: NavItem[] = [];
  username: string = "";

  private sessionService = inject(SessionService);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
    this.sessionService.username$.subscribe(username => {
      this.username = username;
    });

    this.sidenavItems = [
      {
        matIcon: "home",
        title: "Início",
        path: "/"
      },
      {
        category: "Institucional",
        isCategory: true
      },
      {
        matIcon: "calendar_month",
        title: "Eventos",
        path: "/eventos"
      },
      {
        matIcon: 'business',
        title: 'Parceiros',
        path: '/parceiros',
      },
      {
        matIcon: "handshake",
        title: "Transparência",
        path: "/transparencia"
      },
      {
        category: "Apoio",
        isCategory: true
      },
      {
        matIcon: "volunteer_activism",
        title: "Doações",
        path: "/doacoes"
      },
      {
        matIcon: "diversity_1",
        title: "Doadores",
        path: "/doadores"
      },
      {
        matIcon: "people",
        title: "Administradores",
        path: "/admins",
        position: "bottom"
      },
      {
        matIcon: "settings",
        title: "Configurações",
        path: "/configuracoes",
        position: "bottom"
      }
    ];

    this.menuItems = [
      {
        matIcon: 'logout',
        title: 'Sair',
        path: '/logout',
      },
    ];
  }

}
