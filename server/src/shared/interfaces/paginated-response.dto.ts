export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface PaginatedResponseWithGrouping<T> extends PaginatedResponse<T> {
  groupedData: {
    [key: string]: number;
  };
}

export interface PaginatedResponseWithGroupings<T> extends PaginatedResponse<T> {
  groupedByDescription?: {
    [key: string]: number;
  };
  groupedByTheme?: {
    [key: string]: number;
  };
  groupedByIncident?: {
    [key: string]: number;
  };
  groupedByNotifyingService?: {
    [key: string]: number;
  };
}