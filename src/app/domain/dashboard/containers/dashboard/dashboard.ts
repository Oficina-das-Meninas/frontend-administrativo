import { Indicator } from '../../components/indicator/indicator';
import { DonationsTypeDistribution } from '../../components/donations-type-distribution/donations-type-distribution';
import { PeriodPicker, DateRange } from '../../../../shared/components/period-picker/period-picker';
import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { IndicatorData, DonationData, DonationDistribution } from '../../models/indicator-data';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Donations } from '../../components/donations/donations';
import { DashboardService, DonationTimeSeriesData, IndicatorsResponse, DonationTypeDistributionResponse, DonationTimeSeriesResponse } from '../../services/dashboard-service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [Indicator, DonationsTypeDistribution, Donations, PeriodPicker, FormsModule, MatCardModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private destroy$ = new Subject<void>();

  indicators = signal<IndicatorData[]>([]);
  donationDistribution = signal<DonationDistribution | null>(null);
  donationTimeSeries = signal<DonationData[]>([]);

  private indicatorsDateRangeSubject = new Subject<DateRange>();
  private donationDistributionDateRangeSubject = new Subject<DateRange>();
  private donationTimeSeriesDateRangeSubject = new Subject<DateRange>();

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const initialRange: DateRange = {
      startDate: thirtyDaysAgo,
      endDate: today,
      label: 'Últimos 30 dias'
    };

    this.indicatorsDateRangeSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(range => {
        this.loadIndicators(range);
      });

    this.donationDistributionDateRangeSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(range => {
        this.loadDonationTypeDistribution(range);
      });

    this.donationTimeSeriesDateRangeSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(range => {
        this.loadDonationTimeSeries(range);
      });

    this.indicatorsDateRangeSubject.next(initialRange);
    this.donationDistributionDateRangeSubject.next(initialRange);
    this.donationTimeSeriesDateRangeSubject.next(initialRange);

  }

  onIndicatorsDateRangeSelected(range: DateRange) {
    this.indicatorsDateRangeSubject.next(range);
  }

  onDonationsTypeDistributionDateRangeSelected(range: DateRange) {
    this.donationDistributionDateRangeSubject.next(range);
  }

  onDonationsDateRangeSelected(range: DateRange) {
    this.donationTimeSeriesDateRangeSubject.next(range);
  }

  private loadIndicators(range: DateRange): void {
    const startDate = this.formatDateToString(range.startDate);
    const endDate = this.formatDateToString(range.endDate);

    this.dashboardService
      .getIndicators(startDate, endDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IndicatorsResponse) => {
          this.indicators.set([
            {
              title: 'Doações',
              value: response.data.totalDonations,
              valueType: 'currency',
              tooltipText: 'Valor total arrecadado em doações'
            },
            {
              title: 'Média de valor doado',
              value: response.data.averageDonationValue,
              valueType: 'currency',
              tooltipText: 'Indica quanto, em média, cada pessoa doa. Por que isso é importante? É possível estimar quantos doadores serão necessários para alcançar a meta de arrecadação'
            },
            {
              title: 'Qtde. de doadores',
              value: response.data.totalDonors,
              valueType: 'number',
              tooltipText: 'Número total de pessoas que realizaram doações'
            },
            {
              title: 'Padrinhos ativos',
              value: response.data.activeSponsorships,
              valueType: 'number',
              tooltipText: 'Número de doadores que possuem doações recorrentes ativas'
            }
          ]);
        },
        error: (error) => {
          console.error('Erro ao carregar indicadores:', error);
        }
      });
  }

  private loadDonationTypeDistribution(range: DateRange): void {
    const startDate = this.formatDateToString(range.startDate);
    const endDate = this.formatDateToString(range.endDate);

    this.dashboardService
      .getDonationTypeDistribution(startDate, endDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: DonationTypeDistributionResponse) => {
          this.donationDistribution.set({
            oneTime: response.data.oneTimeDonation,
            recurring: response.data.recurringDonation,
            total: response.data.totalDonations
          });
        },
        error: (error) => {
          console.error('Erro ao carregar distribuição de doações:', error);
        }
      });
  }

  private loadDonationTimeSeries(range: DateRange): void {
    const startDate = this.formatDateToString(range.startDate);
    const endDate = this.formatDateToString(range.endDate);
    const groupBy = this.calculateGroupBy(range);

    console.log(startDate, endDate, groupBy);

    this.dashboardService
      .getDonationsByPeriod(startDate, endDate, groupBy)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: DonationTimeSeriesResponse) => {
          this.donationTimeSeries.set(
            this.transformTimeSeriesData(response.data)
          );
        },
        error: (error) => {
          console.error('Erro ao carregar série temporal de doações:', error);
        }
      });
  }

  private transformTimeSeriesData(data: DonationTimeSeriesData): DonationData[] {
    const dataMap = new Map<string, DonationData>();

    data.oneTimeDonations.forEach(item => {
      if (!dataMap.has(item.period)) {
        dataMap.set(item.period, { period: item.period, oneTime: 0, recurring: 0 });
      }
      const current = dataMap.get(item.period)!;
      current.oneTime += item.value;
    });

    data.recurringDonations.forEach(item => {
      if (!dataMap.has(item.period)) {
        dataMap.set(item.period, { period: item.period, oneTime: 0, recurring: 0 });
      }
      const current = dataMap.get(item.period)!;
      current.recurring += item.value;
    });

    return Array.from(dataMap.values()).sort((a, b) => a.period.localeCompare(b.period));
  }

  private calculateGroupBy(range: DateRange): 'month' | 'day' {
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 90 ? 'month' : 'day';
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
