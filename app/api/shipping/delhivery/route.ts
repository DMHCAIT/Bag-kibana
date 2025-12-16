import { NextRequest, NextResponse } from 'next/server';
import { createShipment, trackShipment, checkServiceability } from '@/lib/delhivery-service';

/**
 * POST - Create a new shipment
 * Body: { orderId, customerName, customerPhone, shippingAddress, items, subtotal, totalAmount, paymentMode }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      orderId,
      customerName,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      totalAmount,
      paymentMode,
    } = body;

    // Validate required fields
    if (!orderId || !customerName || !customerPhone || !shippingAddress || !items || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create shipment
    const result = await createShipment({
      orderId,
      customerName,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      totalAmount,
      paymentMode: paymentMode || 'prepaid',
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create shipment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      waybill: result.waybill,
      message: 'Shipment created successfully',
    });
  } catch (error: any) {
    console.error('Error in Delhivery API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET - Track shipment or check serviceability
 * Query params: ?waybill=XXX or ?pincode=XXX
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get('waybill');
    const pincode = searchParams.get('pincode');

    if (waybill) {
      // Track shipment
      const result = await trackShipment(waybill);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to track shipment' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        trackingData: result.trackingData,
      });
    } else if (pincode) {
      // Check serviceability
      const result = await checkServiceability(pincode);
      
      return NextResponse.json({
        serviceable: result.serviceable,
        error: result.error,
      });
    } else {
      return NextResponse.json(
        { error: 'Please provide waybill or pincode parameter' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in Delhivery API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
