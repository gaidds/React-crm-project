export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    recordsPerPage: number;
    handlePageChange: (page: number) => void;
    handleSelectChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  }
  