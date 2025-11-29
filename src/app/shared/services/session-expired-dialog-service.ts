import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialog } from '../components/session-expired-dialog/session-expired-dialog';

@Injectable({
  providedIn: 'root',
})
export class SessionExpiredDialogService {
  private dialog = inject(MatDialog);

  open() {
    this.dialog.open(SessionExpiredDialog, {
      disableClose: true,
    });
  }

}
