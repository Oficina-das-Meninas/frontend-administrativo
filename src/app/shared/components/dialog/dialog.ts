import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
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
  dialogRef = inject(MatDialogRef<Dialog>);

  onCloseDialog(): void {
    this.dialogRef.close();
  }
  
}

