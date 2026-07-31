import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { video_id, customer_email, customer_name, return_url } = await request.json();

    if (!video_id || !customer_email) {
      return NextResponse.json({ error: 'video_id and customer_email required' }, { status: 400 });
    }

    // Airwallex API 创建 Payment Intent
    const airwallexRes = await fetch('https://api.airwallex.com/v1/api/payment_intents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.AIRWALLEX_API_KEY!,
        'x-client-id': process.env.AIRWALLEX_CLIENT_ID!,
      },
      body: JSON.stringify({
        amount: 1900, // $19.00 in cents
        currency: 'USD',
        merchant_order_id: `video_${video_id}_${Date.now()}`,
        request_id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        order: {
          type: 'physical_goods',
          products: [
            {
              type: 'digital',
              name: 'Factory Video Unlock',
              quantity: 1,
              price: 1900,
              currency: 'USD',
            },
          ],
        },
        metadata: {
          video_id: String(video_id),
          customer_email,
          customer_name: customer_name || '',
        },
      }),
    });

    const paymentIntent = await airwallexRes.json();

    if (!airwallexRes.ok) {
      console.error('Airwallex error:', paymentIntent);
      return NextResponse.json({ error: paymentIntent.message || 'Payment creation failed' }, { status: 500 });
    }

    // 拿到 Hosted Payment Page URL
    const hostedPageUrl = `https://www.airwallex.com/pay/${paymentIntent.id}`;

    return NextResponse.json({
      payment_intent_id: paymentIntent.id,
      hosted_page_url: hostedPageUrl,
      amount: 1900,
      currency: 'USD',
    });
  } catch (error: any) {
    console.error('Payment create error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
