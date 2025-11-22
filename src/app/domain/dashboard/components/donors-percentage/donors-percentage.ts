import { Component, OnInit } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexLegend, ApexDataLabels, ApexPlotOptions, ApexTooltip, ApexResponsive } from 'ng-apexcharts';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';
import { THEME_COLORS } from '../../../../shared/constants/theme-colors';

@Component({
  selector: 'app-donors-percentage',
  imports: [GenericChartComponent],
  templateUrl: './donors-percentage.html'
})
export class DonorsPercentage implements OnInit {
  series!: ApexNonAxisChartSeries;
  chart!: ApexChart;
  legend!: ApexLegend;
  dataLabels!: ApexDataLabels;
  plotOptions!: ApexPlotOptions;
  tooltip!: ApexTooltip;
  responsive!: ApexResponsive[];
  colors: string[] = [THEME_COLORS.PINK, THEME_COLORS.BLUE];
  labels: string[] = ['Padrinhos', 'Doadores Únicos'];

  ngOnInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    this.series = [7250, 4100];

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
