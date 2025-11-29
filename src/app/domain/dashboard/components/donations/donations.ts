import { DonationData } from '../../models/indicator-data';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexGrid,
  ApexTooltip,
  ApexResponsive,
  ApexDataLabels,
} from 'ng-apexcharts';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';
import { THEME_COLORS } from '../../../../shared/constants/theme-colors';

@Component({
  selector: 'app-donations',
  imports: [GenericChartComponent],
  templateUrl: './donations.html',
})
export class Donations implements OnInit, OnChanges {
  @Input() data: DonationData[] = [];

  series!: ApexAxisChartSeries;
  chart!: ApexChart;
  xaxis!: ApexXAxis; // aqui
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartData();
    }
    console.log(this.data);
  }

  private updateChartData(): void {
    if (this.data && this.data.length > 0) {
      const recurringData = this.data.map((d) => d.recurring);
      const oneTimeData = this.data.map((d) => d.oneTime);
      const categories = this.data.map((d) => this.formatPeriod(d.period));
      console.log('Categories:', categories);

      this.series = [
        {
          name: 'Padrinho',
          data: recurringData,
        },
        {
          name: 'Doação Única',
          data: oneTimeData,
        },
      ];

      this.xaxis = {
        ...this.xaxis,
        categories: categories,
      };
    }
  }

  private initializeChart(): void {
    this.series = [
      {
        name: 'Padrinho',
        data: [],
      },
      {
        name: 'Doação Única',
        data: [],
      },
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
          zoom: false,
        },
      },
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    };

    this.stroke = {
      curve: 'smooth',
      width: 2,
    };

    this.xaxis = {
      categories: [],
      title: {
        text: 'Período',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    };

    this.yaxis = {
      title: {
        text: 'Valor (R$)',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      labels: {
        formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`,
      },
    };

    this.legend = {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
    };

    this.grid = {
      borderColor: '#e5e7eb',
      strokeDashArray: 3,
    };

    this.dataLabels = {
      enabled: false,
    };

    this.tooltip = {
      theme: 'light',
      y: {
        formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR')}`,
      },
    };

    this.responsive = [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ];

    // Atualiza os dados se fornecidos
    if (this.data && this.data.length > 0) {
      this.updateChartData();
    }
  }

  private formatPeriod(period: string): string {
    if (period.length === 7) {
      // YYYY-MM
      const [year, month] = period.split('-');
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (period.length === 10) {
      const [_, month, day] = period.split('-');
      console.log('Month:', month, 'Day:', day);
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      return `${day} ${monthNames[parseInt(month) - 1]}`;
    }
    return period;
  }
}
