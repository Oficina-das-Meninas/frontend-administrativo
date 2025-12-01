import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { THEME_COLORS } from '../../../../shared/constants/theme-colors';
import { DonationData } from '../../models/indicator-data';
import { GenericChartComponent } from '../generic-chart/generic-chart.component';
import { FlowerSpinner } from '../../../../shared/components/flower-spinner/flower-spinner';

@Component({
  selector: 'app-donations',
  imports: [GenericChartComponent, FlowerSpinner],
  templateUrl: './donations.html',
})
export class Donations {
  @Input() data: DonationData[] = [];
  @Input() viewMode: 'valueLiquid' | 'value' = 'valueLiquid';

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

  private chartInitialized = false;
  private monthNames = [
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

  ngOnInit(): void {
    if (this.data && this.data.length > 0) {
      this.initializeChart();
      this.chartInitialized = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chartInitialized && this.data && this.data.length > 0) {
      this.initializeChart();
      this.chartInitialized = true;
      return;
    }

    if (changes['viewMode'] && !changes['data'] && this.chartInitialized) {
      this.updateChartData();
      return;
    }

    if (changes['data'] && this.chartInitialized) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (this.data && this.data.length > 0) {
      const { recurringData, oneTimeData, categories } = this.buildChartData();

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
    const { recurringData, oneTimeData, categories } = this.buildChartData();

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
      categories: categories,
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
  }

  private buildChartData(): { recurringData: number[]; oneTimeData: number[]; categories: string[] } {
    if (!this.data || this.data.length === 0) {
      return { recurringData: [], oneTimeData: [], categories: [] };
    }

    const recurringData = this.data.map((d) =>
      this.viewMode === 'valueLiquid' ? d.recurringLiquid : d.recurring
    );
    const oneTimeData = this.data.map((d) =>
      this.viewMode === 'valueLiquid' ? d.oneTimeLiquid : d.oneTime
    );
    const categories = this.data.map((d) => this.formatPeriod(d.period));

    return { recurringData, oneTimeData, categories };
  }

  private formatPeriod(period: string): string {
    if (period.length === 7) {
      // YYYY-MM
      const [year, month] = period.split('-');
      return `${this.monthNames[parseInt(month) - 1]} ${year}`;
    } else if (period.length === 10) {
      const [_, month, day] = period.split('-');
      return `${day} ${this.monthNames[parseInt(month) - 1]}`;
    }
    return period;
  }
}
