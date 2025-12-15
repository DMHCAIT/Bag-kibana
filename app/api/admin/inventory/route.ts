import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get inventory status for all products
 */
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  try {
    const { searchParams } = new URL(request.url);
    const lowStockOnly = searchParams.get('low_stock') === 'true';
    const outOfStockOnly = searchParams.get('out_of_stock') === 'true';

    let query = supabaseAdmin
      .from('products')
      .select('id, name, sku, stock_quantity, low_stock_threshold, track_inventory, allow_backorder')
      .eq('track_inventory', true)
      .order('stock_quantity', { ascending: true });

    if (lowStockOnly) {
      query = query.lte('stock_quantity', supabaseAdmin.rpc('products.low_stock_threshold'));
    }

    if (outOfStockOnly) {
      query = query.lte('stock_quantity', 0);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching inventory:', error);
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 }
      );
    }

    // Calculate inventory stats
    const stats = {
      total_products: products?.length || 0,
      low_stock_count: products?.filter((p: any) => p.stock_quantity <= p.low_stock_threshold).length || 0,
      out_of_stock_count: products?.filter((p: any) => p.stock_quantity <= 0).length || 0,
      total_stock_value: products?.reduce((sum: number, p: any) => sum + p.stock_quantity, 0) || 0,
    };

    return NextResponse.json({
      success: true,
      products,
      stats,
    });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

/**
 * Update product stock
 */
export async function POST(request: NextRequest) {
  // Verify admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { product_id, quantity_change, transaction_type, notes } = await request.json();

    if (!product_id || quantity_change === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity change are required' },
        { status: 400 }
      );
    }

    // Call database function to update stock
    const { data, error } = await supabaseAdmin.rpc('update_product_stock', {
      p_product_id: product_id,
      p_quantity_change: quantity_change,
      p_transaction_type: transaction_type || 'adjustment',
      p_reference_type: 'manual_adjustment',
      p_notes: notes,
      p_user_id: authResult.user.id,
    });

    if (error) {
      console.error('Error updating stock:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update stock' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error: any) {
    console.error('Stock update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update stock' },
      { status: 500 }
    );
  }
}
