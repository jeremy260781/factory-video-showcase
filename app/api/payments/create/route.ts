import { NextRequest, NextResponse } from 'next/server';

// ============================================
// 创建 Stripe Checkout 支付会话
// 客户支付 $19 USD 解锁单个视频(15秒预览后)
// ============================================

const PRICE_USD_CENTS = 1900; // $19.00

export async function POST(request: NextRequest) {
  try {
    const { video_id, customer_email, customer_name, return_url } = await request.json();

    if (!video_id || !customer_email) {
      return NextResponse.json({ error: 'video_id and customer_email required' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    // 构建 Checkout Session 参数
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    // 禁用 Managed Payments(避免产品税码要求)
    params.append('managed_payments[enabled]', 'false');
    params.append('success_url', `${return_url}?unlocked=1`);
    params.append('cancel_url', `${return_url}?cancel=1`);
    params.append('metadata[video_id]', String(video_id));
    params.append('metadata[customer_email]', customer_email);
    if (customer_name) params.append('metadata[customer_name]', customer_name);
    params.append('line_items[0][quantity]', '1');
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', String(PRICE_USD_CENTS));
    params.append('line_items[0][price_data][product_data][name]', 'Factory Video Unlock');

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Stripe create session error:', data);
      return NextResponse.json({ error: data.error?.message || 'Payment creation failed' }, { status: 500 });
    }

    return NextResponse.json({
      payment_intent_id: data.payment_intent || data.id,
      hosted_page_url: data.url,
      amount: PRICE_USD_CENTS,
      currency: 'USD',
    });
  } catch (error: any) {
    console.error('Payment create error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
