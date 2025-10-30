import { Partner } from "./partner";

export interface PartnerPage {
  data: Partner[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
