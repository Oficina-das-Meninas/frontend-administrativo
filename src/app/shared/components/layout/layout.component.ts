import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { NavItem } from '../../models/nav-item';
import { SessionService } from '../../../domain/auth/services/session-service';
import { AuthService } from '../../../domain/auth/services/auth-service';

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
  private authService = inject(AuthService);
  private router = inject(Router);

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
        matIcon: "dashboard",
        title: "Dashboard",
        path: "/dashboard"
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
    ];

    this.menuItems = [
      {
        matIcon: 'logout',
        title: 'Sair',
        action: () => this.onLogout(),
      },
    ];
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }

}
