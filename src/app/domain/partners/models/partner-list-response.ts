import { Partner } from './partner';

export interface PartnerListResponse {
  data: Partner[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
