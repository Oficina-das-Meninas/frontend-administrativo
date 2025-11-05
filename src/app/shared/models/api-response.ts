export interface ApiPagedResponse<T> {
  data: {
    contents: T[];
    totalElements: number;
    totalPages: number;
  };
  date: string;
}

export interface ApiResponse<T> {
  data: T;
  date: string;
}
