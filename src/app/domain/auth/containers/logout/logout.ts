import { AfterViewInit, Component, inject, OnDestroy, signal, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Dialog } from "../../../../shared/components/dialog/dialog";
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription, takeWhile } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout',
  imports: [Dialog, MatButtonModule],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout implements AfterViewInit, OnDestroy {

  @ViewChild('logoutDialog') logoutDialog!: TemplateRef<any>;

  secondsRemaining = signal(7);
  private countdownSub?: Subscription;

  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngAfterViewInit(): void {
    this.dialog.open(this.logoutDialog);
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

  toLogin() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
    this.dialog.closeAll();
  }

  private startCountdown(): void {
    this.countdownSub = interval(1000)
      .pipe(takeWhile(() => this.secondsRemaining() > 0))
      .subscribe({
        next: () => {
          const newValue = this.secondsRemaining() - 1;
          this.secondsRemaining.set(newValue);
          if (newValue === 0) {
            this.toLogin();
          }
        },
      });
  }
  
}
