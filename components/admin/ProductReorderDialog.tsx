"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, GripVertical, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface Product {
  id: string | number;
  name: string;
  images?: string[];
  displayOrder?: number;
  display_order?: number;
}

interface ProductReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSave: (reordered: Product[]) => Promise<void>;
}

export function ProductReorderDialog({
  open,
  onOpenChange,
  products: initialProducts,
  onSave,
}: ProductReorderDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize products sorted by display order
    const sorted = [...initialProducts].sort(
      (a, b) =>
        ((a.displayOrder || a.display_order) as number) -
        ((b.displayOrder || b.display_order) as number)
    );
    setProducts(sorted);
  }, [initialProducts, open]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newProducts = [...products];
    [newProducts[index - 1], newProducts[index]] = [
      newProducts[index],
      newProducts[index - 1],
    ];
    setProducts(newProducts);
  };

  const moveDown = (index: number) => {
    if (index === products.length - 1) return;
    const newProducts = [...products];
    [newProducts[index], newProducts[index + 1]] = [
      newProducts[index + 1],
      newProducts[index],
    ];
    setProducts(newProducts);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Add display order to products
      const reordered = products.map((product, index) => ({
        ...product,
        displayOrder: index,
        display_order: index,
      }));

      await onSave(reordered);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reorder Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
            >
              {/* Drag Handle */}
              <GripVertical className="w-4 h-4 text-gray-400" />

              {/* Product Image */}
              {product.images && product.images[0] && (
                <div className="relative w-12 h-12 rounded bg-gray-100 flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-gray-500">Order: {index + 1}</p>
              </div>

              {/* Controls */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveDown(index)}
                  disabled={index === products.length - 1}
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Order'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
