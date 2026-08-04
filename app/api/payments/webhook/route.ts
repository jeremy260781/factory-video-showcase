import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/oss';
import crypto from 'crypto';

// ============================================
// Airwallex 支付成功回调:记录到 OSS 上的 payments.json
// (验签逻辑不变,存储从 Supabase 换成 OSS)
// ============================================

const PAYMENTS_KEY = 'payments.json';

interface Payment {
  video_id: number;
  customer_email: string;
  customer_name: string;
  amount: number;
  currency: string;
  airwallex_payment_intent_id: string;
  status: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    // 读取原始 body（验签必须用原始字符串）
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    console.log('Airwallex webhook received:', JSON.stringify(body).slice(0, 500));

    // ===== Webhook 签名验证 =====
    // Airwallex 规范：x-signature = HMAC-SHA256(secret, rawBody) 的 hex；x-timestamp = Unix 毫秒
    const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-signature');
      const timestamp = request.headers.get('x-timestamp');

      if (!signature || !timestamp) {
        console.error('Missing webhook signature headers');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      // 防重放攻击：时间戳偏差超过 5 分钟拒绝
      const ts = parseInt(timestamp, 10);
      if (isNaN(ts) || Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
        console.error('Webhook timestamp outside valid window');
        return NextResponse.json({ error: 'Timestamp expired' }, { status: 401 });
      }

      // 计算期望签名并比对（常量时间比较）
      const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
      const received = String(signature);
      const valid =
        expected.length === received.length &&
        crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));

      if (!valid) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      console.warn('AIRWALLEX_WEBHOOK_SECRET 未配置，跳过验签（生产环境必须配置）');
    }

    // 事件名：新版 API 用 name 字段，兼容旧字段
    const eventType = body.name || body.event_type || body.type;

    // 只处理支付成功事件（兼容不同版本的事件名）
    const successEvents = ['payment_intent.succeeded', 'payment_attempt.authorized'];
    if (!successEvents.includes(eventType)) {
      return NextResponse.json({ received: true });
    }

    // 新版 payload：data 直接是事件对象；兼容 data.object / 平铺结构
    const paymentIntent = body.data?.object || body.data || body;
    const paymentIntentId = paymentIntent.id || paymentIntent.payment_intent_id;
    const metadata = paymentIntent.metadata || {};
    const videoId = metadata.video_id;
    const customerEmail = metadata.customer_email;
    const customerName = metadata.customer_name || '';

    if (!paymentIntentId || !videoId) {
      console.error('Missing payment_intent_id or video_id in webhook');
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // ===== 记录支付到 OSS payments.json（去重） =====
    const payments = (await readJson<Payment[]>(PAYMENTS_KEY)) || [];

    const exists = payments.some((p) => p.airwallex_payment_intent_id === paymentIntentId);
    if (exists) {
      console.log('Duplicate webhook, ignoring');
    } else {
      payments.push({
        video_id: parseInt(videoId),
        customer_email: customerEmail,
        customer_name: customerName,
        amount: 1900,
        currency: 'USD',
        airwallex_payment_intent_id: paymentIntentId,
        status: 'succeeded',
        created_at: new Date().toISOString(),
      });
      const ok = await writeJson(PAYMENTS_KEY, payments);
      if (!ok) {
        console.error('Failed to save payment to OSS');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
