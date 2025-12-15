'use client';

import { useEffect, useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  allow_backorder: boolean;
}

interface InventoryStats {
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_stock_value: number;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [adjusting, setAdjusting] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === 'low_stock') params.append('low_stock', 'true');
      if (filter === 'out_of_stock') params.append('out_of_stock', 'true');

      const response = await fetch(`/api/admin/inventory?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.products);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (productId: string, change: number, notes: string) => {
    try {
      setAdjusting(productId);
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          quantity_change: change,
          transaction_type: 'adjustment',
          notes,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchInventory();
        alert('Stock updated successfully');
      } else {
        alert('Failed to update stock: ' + result.error);
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Failed to update stock');
    } finally {
      setAdjusting(null);
    }
  };

  const getStockStatus = (product: InventoryItem) => {
    if (product.stock_quantity <= 0) return { label: 'Out of Stock', color: 'text-red-600' };
    if (product.stock_quantity <= product.low_stock_threshold) return { label: 'Low Stock', color: 'text-yellow-600' };
    return { label: 'In Stock', color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('low_stock')}
            className={`px-4 py-2 rounded ${filter === 'low_stock' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            Low Stock ({stats?.low_stock_count || 0})
          </button>
          <button
            onClick={() => setFilter('out_of_stock')}
            className={`px-4 py-2 rounded ${filter === 'out_of_stock' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Out of Stock ({stats?.out_of_stock_count || 0})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{stats.total_products}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.low_stock_count}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{stats.out_of_stock_count}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-600">Total Stock Units</p>
            <p className="text-2xl font-bold">{stats.total_stock_value}</p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">SKU</th>
              <th className="text-center p-4">Stock</th>
              <th className="text-center p-4">Threshold</th>
              <th className="text-center p-4">Status</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getStockStatus(product);
              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.sku || '-'}</td>
                  <td className="p-4 text-center font-semibold">{product.stock_quantity}</td>
                  <td className="p-4 text-center text-gray-600">{product.low_stock_threshold}</td>
                  <td className="p-4 text-center">
                    <span className={`font-semibold ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          const change = prompt('Enter quantity to add (negative to subtract):');
                          if (change !== null) {
                            const notes = prompt('Add notes (optional):') || 'Manual adjustment';
                            adjustStock(product.id, parseInt(change), notes);
                          }
                        }}
                        disabled={adjusting === product.id}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm disabled:opacity-50"
                      >
                        {adjusting === product.id ? 'Adjusting...' : 'Adjust'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
