import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first } from 'rxjs';
import { Partner } from '../models/partner';
import { PartnerPage } from '../models/partner-page';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  // private readonly API_URL = `${environment.apiUrl}/events`;
  private readonly API_URL = `https://api-dev.apollomusic.com.br/api/events`;
  private httpClient = inject(HttpClient);

  list(page = 0, pageSize = 10) {
    return this.httpClient
      .get<PartnerPage>(this.API_URL, {
        params: {
          page: page,
          pageSize: pageSize,
        },
      })
      .pipe(first());
  }

  loadById(id: string) {
    return this.httpClient.get<Partner>(`${this.API_URL}/${id}`);
  }

  save(partner: Partner) {
    if (partner.id) {
      return this.update(partner);
    }
    return this.create(partner);
  }

  private create(partner: Partner) {
    return this.httpClient.post<Partner>(this.API_URL, partner);
  }

  private update(partner: Partner) {
    return this.httpClient.put<Partner>(
      `${this.API_URL}/${partner.id}`,
      partner
    );
  }
}
