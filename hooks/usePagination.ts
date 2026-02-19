import { useState, useCallback, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  [key: string]: unknown;
}

interface UsePaginationOptions {
  initialPage?: number;
  limit?: number;
  category?: string;
  search?: string;
}

interface PaginationData {
  products: Product[];
  currentPage: number;
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: 'newest' | 'price-asc' | 'price-desc' | 'popular') => void;
}

export const usePagination = ({
  initialPage = 1,
  limit = 20,
  category = 'all',
  search = '',
}: UsePaginationOptions = {}): PaginationData => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');

  const fetchProducts = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });

      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/products/paginated?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Add revalidation for better caching
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setProducts(result.data || []);
      setCurrentPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);

      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `⚡ Fetched ${result.data?.length} products in ${result.meta.responseTime}ms`
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Pagination error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, selectedCategory, searchTerm, sortBy]);

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const goToPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(async () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(async () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleSetSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleSetCategory = useCallback((cat: string) => {
    setSelectedCategory(cat);
  }, []);

  const handleSetSort = useCallback((sort: 'newest' | 'price-asc' | 'price-desc' | 'popular') => {
    setSortBy(sort);
  }, []);

  return {
    products,
    currentPage,
    totalPages,
    total,
    loading,
    error,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    setSearch: handleSetSearch,
    setCategory: handleSetCategory,
    setSort: handleSetSort,
  };
};
