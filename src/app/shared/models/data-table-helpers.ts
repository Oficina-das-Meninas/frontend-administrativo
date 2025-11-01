import { Observable } from "rxjs";

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'image' | 'currency' | 'badge' | 'custom';
}

export interface DataPage<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
}

export interface DeleteService {
  delete(id: string): Observable<any>;
}
