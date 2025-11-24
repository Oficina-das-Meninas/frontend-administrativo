import { Admin } from './admin';

export interface AdminListResponse {
  contents: Admin[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}