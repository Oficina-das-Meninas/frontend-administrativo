import { Component, inject, input } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.scss'],
})
export class Dialog {

  title = input<string>('');
  formDialog = input<FormGroup>();
  dialogRef = inject(MatDialogRef<Dialog>);

  onCloseDialog(): void {
    if (this.formDialog()) {
      this.formDialog()?.reset();
    }
    this.dialogRef.close();
  }

}

