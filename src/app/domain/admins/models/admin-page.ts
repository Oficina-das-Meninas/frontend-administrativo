import { Admin } from "./admin";

export interface AdminPage {
  data: Admin[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
