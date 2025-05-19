
import { useState } from "react";

interface PaginationProps<T> {
  items: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>({
  items,
  itemsPerPage: initialItemsPerPage,
  initialPage = 1,
}: PaginationProps<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Reset to first page if current page exceeds total pages
  if (currentPage > totalPages) {
    setCurrentPage(1);
  }
  
  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
  
  // Get the current page items
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  
  // Function to change the page
  const setPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    startIndex,
    endIndex: endIndex < 0 ? 0 : endIndex
  };
}
