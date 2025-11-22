import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmUnsavedChangesData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-unsaved-changes-dialog',
  templateUrl: './confirm-unsaved-changes-dialog.html',
  imports: [MatButtonModule, MatDialogModule]
})
export class ConfirmUnsavedChangesDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmUnsavedChangesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmUnsavedChangesData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
