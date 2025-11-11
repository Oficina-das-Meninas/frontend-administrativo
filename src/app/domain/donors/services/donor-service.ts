import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPage } from '../../../shared/models/data-table-helpers';
import { Donor } from '../models/donor';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  private donors: Donor[] = [
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      document: '123.456.789-00',
      phone: '(11) 91234-5678',
      badge: 'semente',
    },
    {
      id: '2',
      name: 'João Souza',
      email: 'joao@email.com',
      document: '987.654.321-00',
      phone: '(11) 99876-5432',
      badge: 'broto',
    },
    {
      id: '3',
      name: 'Ana Costa',
      email: 'ana@email.com',
      document: '111.222.333-44',
      phone: '(11) 93456-7890',
      badge: 'margarida',
    },
  ];

  getDonors(
    searchTerm: string = '',
    page: number = 0,
    pageSize: number = 10
  ): Observable<DataPage<Donor>> {
    let filtered = this.donors;
    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const start = page * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    return of({
      data: paged,
      totalElements,
      totalPages,
    });
  }
}
