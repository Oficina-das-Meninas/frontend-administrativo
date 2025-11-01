import { Partner } from './partner';

export interface PartnerListResponse {
  contents: Partner[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
