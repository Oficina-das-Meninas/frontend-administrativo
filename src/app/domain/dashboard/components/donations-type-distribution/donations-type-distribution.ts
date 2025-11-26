import { DonationDistribution } from './../../models/indicator-data';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexLegend, ApexDataLabels, ApexPlotOptions, ApexTooltip, ApexResponsive } from 'ng-apexcharts';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';
import { THEME_COLORS } from '../../../../shared/constants/theme-colors';

@Component({
  selector: 'app-donations-type-distribution',
  imports: [GenericChartComponent],
  templateUrl: './donations-type-distribution.html'
})
export class DonationsTypeDistribution implements OnInit, OnChanges {
  @Input() data: DonationDistribution | null = null;

  series!: ApexNonAxisChartSeries;
  chart!: ApexChart;
  legend!: ApexLegend;
  dataLabels!: ApexDataLabels;
  plotOptions!: ApexPlotOptions;
  tooltip!: ApexTooltip;
  responsive!: ApexResponsive[];
  colors: string[] = [THEME_COLORS.PINK, THEME_COLORS.BLUE];
  labels: string[] = ['Padrinho', 'Doação Única'];

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (this.data) {
      this.series = [this.data.recurring, this.data.oneTime];
    }
  }

  private initializeChart(): void {
    this.series = this.data ? [this.data.recurring, this.data.oneTime] : [0, 0];

    this.chart = {
      type: 'donut',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          reset: false,
          zoomin: false,
          zoomout: false,
          selection: false,
          pan: false,
          zoom: false
        }
      },
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
    };

    this.legend = {
      position: 'bottom',
      fontSize: '13px'
    };

    this.dataLabels = {
      enabled: true,
      formatter: (value: string) => `${parseFloat(value).toFixed(1)}%`
    };

    this.plotOptions = {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600
            },
            value: {
              show: true,
              fontSize: '13px',
              formatter: (value: string) => `R$ ${parseInt(value).toLocaleString('pt-BR')}`
            },
            total: {
              show: true,
              label: 'Total de Doações',
              fontSize: '13px',
              formatter: (w: any) => {
                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return `R$ ${sum.toLocaleString('pt-BR')}`;
              }
            }
          }
        }
      }
    };

    this.tooltip = {
      theme: 'light',
      y: {
        formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
      }
    };

    this.responsive = [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          }
        }
      }
    ];
  }
}
