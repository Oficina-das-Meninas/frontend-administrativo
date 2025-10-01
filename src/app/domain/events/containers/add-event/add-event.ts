import { Component, signal, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CKEditorComponent } from "../../components/ck-editor/ck-editor";

@Component({
  selector: 'app-add-event',
  imports: [MatCardModule, CKEditorComponent],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
  encapsulation: ViewEncapsulation.None
})
export class AddEventComponent {
  public description = signal<string>('');

  onDataChange(data: string) {
    this.description.set(data);
  }
}
