import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  success(message: string, duration: number = 6000): void {
    this.snackBar.open(message, 'Fechar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Fechar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error'],
    });
  }

  info(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fechar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-info'],
    });
  }

  warning(message: string, duration: number = 3500): void {
    this.snackBar.open(message, 'Fechar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-warning'],
    });
  }
}
