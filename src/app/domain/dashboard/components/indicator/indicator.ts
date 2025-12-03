import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlowerSpinner } from '../../../../shared/components/flower-spinner/flower-spinner';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.html',
  imports: [CurrencyPipe, DecimalPipe, MatTooltipModule, FlowerSpinner]
})
export class Indicator {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() valueType: 'currency' | 'number' = 'number';
  @Input() tooltipText?: string;
  @Input() isLoading: boolean = false;
}
