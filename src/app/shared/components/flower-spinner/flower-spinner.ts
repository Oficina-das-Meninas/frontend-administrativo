import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flower-spinner',
  imports: [],
  templateUrl: './flower-spinner.html',
  styleUrl: './flower-spinner.scss'
})
export class FlowerSpinner {
  @Input() target?: string;
}
