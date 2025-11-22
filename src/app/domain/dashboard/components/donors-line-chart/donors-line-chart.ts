import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexStroke, ApexLegend, ApexGrid, ApexTooltip, ApexResponsive, ApexDataLabels } from 'ng-apexcharts';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';
import { THEME_COLORS } from '../../../../shared/constants/theme-colors';

@Component({
  selector: 'app-donors-line-chart',
  imports: [GenericChartComponent],
  templateUrl: './donors-line-chart.html'
})
export class DonorsLineChart implements OnInit {
  series!: ApexAxisChartSeries;
  chart!: ApexChart;
  xaxis!: ApexXAxis;
  yaxis!: ApexYAxis;
  stroke!: ApexStroke;
  legend!: ApexLegend;
  grid!: ApexGrid;
  tooltip!: ApexTooltip;
  responsive!: ApexResponsive[];
  dataLabels!: ApexDataLabels;
  colors: string[] = [THEME_COLORS.PINK, THEME_COLORS.BLUE];

  ngOnInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    this.series = [
      {
        name: 'Padrinho',
        data: [2500, 3200, 2800, 4100, 3900, 4500, 5200, 4800, 5100, 5900, 6200, 6800]
      },
      {
        name: 'Doação Única',
        data: [1200, 1500, 1800, 2100, 1900, 2300, 2800, 2500, 2900, 3200, 3500, 3800]
      }
    ];

    this.chart = {
      type: 'line',
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

    this.stroke = {
      curve: 'smooth',
      width: 2
    };

    this.xaxis = {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      title: {
        text: 'Mês',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      }
    };

    this.yaxis = {
      title: {
        text: 'Valor (R$)',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`
      }
    };

    this.legend = {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px'
    };

    this.grid = {
      borderColor: '#e5e7eb',
      strokeDashArray: 3
    };

    this.dataLabels = {
      enabled: false
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
