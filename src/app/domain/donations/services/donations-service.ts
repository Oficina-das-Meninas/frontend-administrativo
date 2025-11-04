import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { Donation } from '../models/donation';
import { toLocalDate } from '../../../shared/components/utils/date-utils';
import { DonationFilters } from '../models/donation-filters';

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private readonly API_URL = `${environment.apiUrl}/donations`;
  private httpClient = inject(HttpClient);

  private readonly STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Concluído',
    CANCELED: 'Cancelado',
  };

  private readonly TYPE_LABELS: Record<string, string> = {
    RECURRING: 'Recorrente',
    ONE_TIME: 'Única',
  };

  private readonly SPONSOR_STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Ativa',
    INACTIVE: 'Inativa',
  };

  private mapStatusLabel(status?: string): string {
    if (!status) return '';
    return this.STATUS_LABELS[status] ?? status;
  }

  private mapDonorName(donorName?: string): string {
    if (!donorName || donorName.trim() === '') return 'Anônimo';
    return donorName;
  }

  private mapSponsorStatusLabel(sponsorStatus?: string): string {
    if (!sponsorStatus) return '';
    return this.SPONSOR_STATUS_LABELS[sponsorStatus] ?? sponsorStatus;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  list(page: number, size: number): Observable<DataPage<Donation>> {
    return this.getFilteredDonations({
      page,
      pageSize: size,
    });
  }

  getFilteredDonations(filters: DonationFilters): Observable<DataPage<Donation>> {
    let params = new HttpParams();

    params = params.set('page', (filters.page ?? 0).toString());
    params = params.set('pageSize', (filters.pageSize ?? 10).toString());

    if (filters.searchTerm?.trim()) {
      params = params.set('searchTerm', filters.searchTerm.trim());
    }

    if (filters.startDate) {
      params = params.set('startDate', toLocalDate(filters.startDate));
    }
    if (filters.endDate) {
      params = params.set('endDate', toLocalDate(filters.endDate));
    }

    if ((filters as any).status) {
      params = params.set('status', (filters as any).status);
    }

    if ((filters as any).type) {
      params = params.set('donationType', (filters as any).type);
    }

    if (filters.sortField) {
      params = params.set('sortField', filters.sortField);
    }

    if (filters.sortDirection) {
      params = params.set('sortDirection', filters.sortDirection);
    }

    return this.httpClient.get<any>(this.API_URL, { params }).pipe(
      map((resp: any) => {
        const page = resp?.data ?? {};
        const items = Array.isArray(page.contents) ? page.contents : [];

        const mapped = items.map((donation: any) => {
          const donationTypeRaw = donation.donationType as string | undefined;
          const typeLabel = donationTypeRaw ? (this.TYPE_LABELS[donationTypeRaw] ?? donationTypeRaw) : '';
          const sponsorLabel = this.mapSponsorStatusLabel(donation.sponsorStatus);

          return {
            ...donation,
            donorName: this.mapDonorName(donation.donorName),
            status: this.mapStatusLabel(donation.status),
            value: this.formatCurrency(donation.value),
            donationType: typeLabel,
            sponsorStatusLabel: sponsorLabel,
          } as Donation;
        });

        return {
          data: mapped,
            totalElements: typeof page.totalElements === 'number' ? page.totalElements : mapped.length,
            totalPages: typeof page.totalPages === 'number' ? page.totalPages : 0
        } as DataPage<Donation>;
      })
    );
  }

  getById(donationId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}/${donationId}`).pipe(
      map((donation) => ({
        ...donation
      }))
    );
  }
}
