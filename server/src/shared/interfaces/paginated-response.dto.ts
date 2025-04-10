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
