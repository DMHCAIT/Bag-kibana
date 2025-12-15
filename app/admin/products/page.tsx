"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  RefreshCcw,
} from "lucide-react";
import type { Product } from "@/lib/products-data";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS } from "@/lib/types/product";

interface ProductWithExtras extends Product {
  salePrice?: number;
  stock?: number;
  status?: 'published' | 'draft';
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });

      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      if (sectionFilter !== 'all') {
        params.append('section', sectionFilter);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      console.log('Fetching products with params:', params.toString());
      const response = await fetch(`/api/admin/products?${params}`);
      
      if (!response.ok) {
        console.error('Failed to fetch products:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products fetched:', data.products?.length || 0, 'products');

      if (response.ok && data.products) {
        setProducts(data.products);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalProducts(data.pagination?.total || 0);
      } else {
        console.error('Failed to fetch products:', data.error);
        alert('Failed to load products: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryFilter, sectionFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    fetchProducts();
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Failed to delete product: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('No products selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products?ids=${selectedProducts.join(',')}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(`${selectedProducts.length} product(s) deleted successfully`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Failed to delete products: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete products');
    }
  };

  // Toggle product selection
  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
  }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog ({totalProducts} total)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchProducts}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/products/new">
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
            Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="w-4 h-4" />
                </Button>
            </div>
            </form>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
            >
              <option value="all">All Categories</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>

            {/* Section Filter */}
            <div>
              <select
                value={sectionFilter}
                onChange={(e) => {
                  setSectionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white"
              >
                <option value="all">All Sections</option>
                {PRODUCT_SECTIONS.map(section => (
                  <option key={section.id} value={section.id}>{section.name}</option>
                ))}
              </select>
        </div>
      </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedProducts.length} product(s) selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProducts([])}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p>Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <p className="text-xl mb-2">No products found</p>
              <p className="text-sm">Try adjusting your filters or create a new product</p>
          </div>
        ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </TableHead>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.dbId?.toString() || product.id)}
                          onChange={() => toggleProductSelection(product.dbId?.toString() || product.id)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative w-16 h-16 bg-gray-100 rounded">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.color}</p>
                          <p className="text-xs text-gray-400">ID: {product.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{product.price.toLocaleString()}</p>
                          {(product as ProductWithExtras).salePrice && (
                            <p className="text-sm text-green-600">
                              Sale: ₹{(product as ProductWithExtras).salePrice.toLocaleString()}
                          </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ((product as ProductWithExtras).stock || 100) > 10
                            ? 'bg-green-100 text-green-800'
                            : ((product as ProductWithExtras).stock || 100) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(product as ProductWithExtras).stock || 100}
                      </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ((product as ProductWithExtras).status || 'published') === 'published'
                            ? 'bg-green-100 text-green-800'
                            : ((product as ProductWithExtras).status || 'published') === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(product as ProductWithExtras).status || 'published'}
                      </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.slug || product.id}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                View Product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.dbId || product.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                        </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.dbId?.toString() || product.id)}
                              className="text-red-600"
                        >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t p-4">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({totalProducts} total products)
            </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
          </div>
        </div>
      )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
