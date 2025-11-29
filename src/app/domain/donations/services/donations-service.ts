import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { Donation } from '../models/donation';
import { toLocalDate } from '../../../shared/components/utils/date-utils';
import { DonationFilters } from '../models/donation-filters';
import { ApiPagedResponse } from '../../../shared/models/api-response';

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

    if ((filters).status) {
      params = params.set('status', (filters).status);
    }

    if ((filters).type) {
      params = params.set('donationType', (filters).type);
    }

    if (filters.sortField) {
      params = params.set('sortField', filters.sortField);
    }

    if (filters.sortDirection) {
      params = params.set('sortDirection', filters.sortDirection);
    }

    return this.httpClient.get<ApiPagedResponse<Donation>>(this.API_URL, { params, withCredentials: true }).pipe(
      map((resp) => {
        const contents = resp.data?.contents ?? [];

        const mapped = contents.map((donation) => {
          const donationTypeRaw = donation.donationType;
          const typeLabel = donationTypeRaw ? (this.TYPE_LABELS[donationTypeRaw] ?? donationTypeRaw) : '';
          const sponsorLabel = this.mapSponsorStatusLabel(donation.sponsorStatus ?? undefined);

          return {
            ...donation,
            status: this.mapStatusLabel(donation.status),
            donationType: typeLabel,
            donorName: this.mapDonorName(donation.donorName ?? undefined),
            sponsorStatusLabel: sponsorLabel,
          } as Donation;
        });

        return {
          data: mapped,
          totalElements: resp.data?.totalElements ?? 0,
          totalPages: resp.data?.totalPages ?? 0
        } as DataPage<Donation>;
      })
    );
  }

  getById(donationId: string): Observable<Donation> {
    return this.httpClient.get<ApiPagedResponse<Donation>>(`${this.API_URL}/${donationId}`, { withCredentials: true }).pipe(
      map((resp) => {
        const donation = resp.data?.contents?.[0] ?? resp.data as unknown as Donation;
        return {
          ...donation,
          status: this.mapStatusLabel(donation.status),
          donationType: donation.donationType,
          donorName: this.mapDonorName(donation.donorName ?? undefined),
        } as Donation;
      })
    );
  }
}
