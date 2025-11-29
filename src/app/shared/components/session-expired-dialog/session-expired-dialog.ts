import { AfterViewInit, Component, inject, OnDestroy, signal, TemplateRef, ViewChild } from '@angular/core';
import { Dialog } from "../dialog/dialog";
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../domain/auth/services/auth-service';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-session-expired-dialog',
  imports: [Dialog, MatButtonModule],
  templateUrl: './session-expired-dialog.html',
  styleUrl: './session-expired-dialog.scss',
})
export class SessionExpiredDialog implements AfterViewInit, OnDestroy {

  @ViewChild('sessionExpiredDialog') logoutDialog!: TemplateRef<any>;

  secondsRemaining = signal(10);
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
      next: () => this.router.navigate(['/login'])
    });
    this.dialog.closeAll();
  }

  private startCountdown(): void {
    this.countdownSub = interval(1000)
      .pipe(take(10))
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
