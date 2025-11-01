export interface DonationFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  type?: string;
}
