import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { NavItem } from '../../models/nav-item';
import { Profile } from '../../models/profile';

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
  profile!: Profile;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
    this.sidenavItems = [
      {
        matIcon: "home",
        title: "Início",
        path: "/"
      },
      {
        matIcon: "handshake",
        title: "Transparência",
        path: "/transparencia"
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
        matIcon: "volunteer_activism",
        title: "Doações",
        path: "/doacoes"
      }
    ];

    this.menuItems = [
      {
        matIcon: "logout",
        title: "Sair",
        path: "/"
      },
    ];

    this.profile = {
      username: "Usuário Logado",
      role: "Cargo",
    }
  }

}
