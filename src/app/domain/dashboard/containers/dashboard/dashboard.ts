import { Indicator } from '../../components/indicator/indicator';
import { DonorsPercentage } from '../../components/donors-percentage/donors-percentage';
import { DonorsLineChart } from '../../components/donors-line-chart/donors-line-chart';
import { PeriodPicker, DateRange } from '../../../../shared/components/period-picker/period-picker';
import { Component, OnInit } from '@angular/core';
import { IndicatorData } from '../../models/indicator-data';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [Indicator, DonorsPercentage, DonorsLineChart, PeriodPicker, FormsModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  indicators: IndicatorData[] = [
    {
      title: 'Doações',
      value: 2000500,
      valueType: 'currency'
    },
    {
      title: 'Média de valor doado',
      value: 849.7,
      valueType: 'currency'
    },
    {
      title: 'Qtde. de doadores',
      value: 657800,
      valueType: 'number'
    },
    {
      title: 'Padrinhos ativos',
      value: 1250,
      valueType: 'number'
    }
  ];

  indicatorsDateRange: DateRange | null = null;
  donorsPercentageDateRange: DateRange | null = null;
  donorsLineChartDateRange: DateRange | null = null;

  constructor() {}

  onIndicatorsDateRangeSelected(range: DateRange) {
    this.indicatorsDateRange = range;
    console.log('Filtro indicadores:', range);
  }

  onDonorsPercentageDateRangeSelected(range: DateRange) {
    this.donorsPercentageDateRange = range;
    console.log('Filtro gráfico percentual:', range);
  }

  onDonorsLineChartDateRangeSelected(range: DateRange) {
    this.donorsLineChartDateRange = range;
    console.log('Filtro gráfico linha:', range);
  }

  ngOnInit(): void {}
}
