import { Component, Input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.html',
  imports: [CurrencyPipe, DecimalPipe]
})
export class Indicator {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() valueType: 'currency' | 'number' = 'number';
}
