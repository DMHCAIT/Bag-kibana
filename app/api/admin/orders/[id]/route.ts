import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, deleteOrder } from '@/lib/orders-store';

// GET - Fetch single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache',
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedOrder = updateOrder(id, data);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: updatedOrder,
      message: 'Order updated successfully',
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = deleteOrder(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Order not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Order deleted successfully',
      id,
      status: 'success'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

