import { TemplateRef } from '@angular/core';
import { Observable } from "rxjs";

export interface BadgeColorConfig {
  [key: string]: string;
}

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'image' | 'currency' | 'badge' | 'custom';
  badgeConfig?: BadgeColorConfig;
  cellTemplate?: TemplateRef<any>;
  sortable?: boolean;
  sortField?: string;
}

export interface DataPage<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
}

export interface DeleteService {
  delete(id: string): Observable<any>;
}
