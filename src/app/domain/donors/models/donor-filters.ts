export interface DonorFilters {
  page?: number;
  pageSize?: number;
  badge?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}
