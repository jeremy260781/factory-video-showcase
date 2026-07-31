import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Airwallex webhook received:', JSON.stringify(body).slice(0, 500));

    // 验证 webhook 签名（生产环境建议验签）
    // const signature = request.headers.get('x-signature');
    // ...

    const eventType = body.event_type || body.type;

    // 只处理支付成功事件
    if (eventType !== 'payment_intent.succeeded') {
      return NextResponse.json({ received: true });
    }

    const paymentIntent = body.data?.object || body.data || body;
    const paymentIntentId = paymentIntent.id;
    const metadata = paymentIntent.metadata || {};
    const videoId = metadata.video_id;
    const customerEmail = metadata.customer_email;
    const customerName = metadata.customer_name || '';

    if (!paymentIntentId || !videoId) {
      console.error('Missing payment_intent_id or video_id in webhook');
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 用服务角色 key 操作 Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 记录支付到 Supabase
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        video_id: parseInt(videoId),
        customer_email: customerEmail,
        customer_name: customerName,
        amount: 1900,
        currency: 'USD',
        airwallex_payment_intent_id: paymentIntentId,
        status: 'succeeded',
      });

    if (insertError) {
      // 可能是重复通知，忽略
      if (insertError.code === '23505') {
        console.log('Duplicate webhook, ignoring');
      } else {
        console.error('Failed to save payment:', insertError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
