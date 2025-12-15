import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch single order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format shipping address for display
    let shippingAddressDisplay = 'N/A';
    if (order.shipping_address) {
      if (typeof order.shipping_address === 'string') {
        shippingAddressDisplay = order.shipping_address;
      } else if (typeof order.shipping_address === 'object') {
        const addr = order.shipping_address as any;
        shippingAddressDisplay = [
          addr.full_name,
          addr.address_line1,
          addr.city,
          addr.state,
          addr.postal_code,
          addr.country
        ].filter(Boolean).join(', ');
      }
    }

    return NextResponse.json({
      order: {
        ...order,
        shipping_address: shippingAddressDisplay,
      }
    }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    interface UpdateData {
      updated_at: string;
      order_status?: string;
      payment_status?: string;
      tracking_number?: string;
      notes?: string;
    }

    const updateData: UpdateData = {
      updated_at: new Date().toISOString(),
    };

    if (body.order_status) {
      updateData.order_status = body.order_status;
    }
    if (body.payment_status) {
      updateData.payment_status = body.payment_status;
    }
    if (body.tracking_number) {
      updateData.tracking_number = body.tracking_number;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Format shipping address for display
    let shippingAddressDisplay = 'N/A';
    if (order.shipping_address) {
      if (typeof order.shipping_address === 'string') {
        shippingAddressDisplay = order.shipping_address;
      } else if (typeof order.shipping_address === 'object') {
        const addr = order.shipping_address as any;
        shippingAddressDisplay = [
          addr.full_name,
          addr.address_line1,
          addr.city,
          addr.state,
          addr.postal_code,
          addr.country
        ].filter(Boolean).join(', ');
      }
    }

    return NextResponse.json({
      order: {
        ...order,
        shipping_address: shippingAddressDisplay,
      },
      message: 'Order updated successfully'
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
