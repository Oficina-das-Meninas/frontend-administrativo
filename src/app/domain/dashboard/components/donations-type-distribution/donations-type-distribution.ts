import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexTooltip } from 'ng-apexcharts';
import { THEME_COLORS } from '../../../../shared/constants/theme-colors';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';
import { DonationDistribution } from './../../models/indicator-data';
import { FlowerSpinner } from '../../../../shared/components/flower-spinner/flower-spinner';

@Component({
  selector: 'app-donations-type-distribution',
  imports: [GenericChartComponent, FlowerSpinner],
  templateUrl: './donations-type-distribution.html'
})
export class DonationsTypeDistribution implements OnInit, OnChanges {
  @Input() data: DonationDistribution | null = null;
  @Input() viewMode: 'valueLiquid' | 'value' = 'valueLiquid';
  @Input() isLoading = false;

  get hasData(): boolean {
    return (
      this.data !== null &&
      (this.data.recurring > 0 ||
        this.data.recurringLiquid > 0 ||
        this.data.oneTime > 0 ||
        this.data.oneTimeLiquid > 0)
    );
  }

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
    if (this.data) {
      this.initializeChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.data) {
        this.initializeChart();
      }
    } else if (changes['viewMode'] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (this.data) {
      const recurringValue = this.viewMode === 'valueLiquid' ? this.data.recurringLiquid : this.data.recurring;
      const oneTimeValue = this.viewMode === 'valueLiquid' ? this.data.oneTimeLiquid : this.data.oneTime;
      this.series = [recurringValue, oneTimeValue];
    }
  }

  private initializeChart(): void {
    const recurringValue = this.data
      ? (this.viewMode === 'valueLiquid' ? this.data.recurringLiquid : this.data.recurring)
      : 0;
    const oneTimeValue = this.data
      ? (this.viewMode === 'valueLiquid' ? this.data.oneTimeLiquid : this.data.oneTime)
      : 0;
    this.series = [recurringValue, oneTimeValue];

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
