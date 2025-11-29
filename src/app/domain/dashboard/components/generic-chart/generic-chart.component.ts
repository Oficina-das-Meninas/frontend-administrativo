import { ApexChart } from 'ng-apexcharts';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-generic-chart',
  imports: [CommonModule, ChartComponent],
  templateUrl: './generic-chart.component.html'
})
export class GenericChartComponent {
  @Input() containerClass: string = 'bg-white rounded-lg p-6';
  @Input() chartTitle: string = '';

  @Input() chart!: ApexChart;
  @Input() annotations!: ApexAnnotations;
  @Input() colors!: string[];
  @Input() dataLabels!: ApexDataLabels;
  @Input() series!: ApexAxisChartSeries | ApexNonAxisChartSeries;
  @Input() stroke!: ApexStroke;
  @Input() labels!: string[];
  @Input() legend!: ApexLegend;
  @Input() fill!: ApexFill;
  @Input() tooltip!: ApexTooltip;
  @Input() plotOptions!: ApexPlotOptions;
  @Input() responsive!: ApexResponsive[];
  @Input() xaxis!: ApexXAxis;
  @Input() yaxis!: ApexYAxis | ApexYAxis[];
  @Input() grid!: ApexGrid;
  @Input() states!: ApexStates;
  @Input() title!: ApexTitleSubtitle;
  @Input() subtitle!: ApexTitleSubtitle;
  @Input() theme!: ApexTheme;
}
