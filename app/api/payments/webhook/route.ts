import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/oss';
import crypto from 'crypto';

// ============================================
// Stripe 支付成功回调:记录到 OSS 上的 payments.json
// 验签:Stripe 标准(stripe-signature header, HMAC-SHA256)
// ============================================

const PAYMENTS_KEY = '***';

interface Payment {
  video_id: number;
  customer_email: string;
  customer_name: string;
  amount: number;
  currency: string;
  airwallex_payment_intent_id: string; // 兼容旧字段名,存 Stripe session id
  status: string;
  created_at: string;
}

function verifyStripeSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  // 格式:t=timestamp,v1=signature
  const parts = signatureHeader.split(',').reduce((acc: Record<string, string>, item) => {
    const [k, v] = item.split('=');
    acc[k.trim()] = (v || '').trim();
    return acc;
  }, {});

  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;

  // 防重放:时间戳偏差超过 5 分钟拒绝
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(Date.now() / 1000 - ts) > 5 * 60) {
    console.error('Stripe webhook timestamp outside valid window');
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  const received = String(signature);

  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'))
  );
}

export async function POST(request: NextRequest) {
  try {
    // 读取原始 body（验签必须用原始字符串）
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    console.log('Stripe webhook received:', JSON.stringify(body).slice(0, 500));

    // ===== Webhook 签名验证 =====
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signatureHeader = request.headers.get('stripe-signature');
      const valid = verifyStripeSignature(rawBody, signatureHeader, webhookSecret);
      if (!valid) {
        console.error('Invalid Stripe signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      console.warn('STRIPE_WEBHOOK_SECRET 未配置，跳过验签（生产环境必须配置）');
    }

    // 只处理支付成功事件
    const eventType = body.type || '';
    if (!['checkout.session.completed', 'payment_intent.succeeded'].includes(eventType)) {
      return NextResponse.json({ received: true });
    }

    const session = body.data?.object || body.data || body;
    const sessionId = session.id || session.payment_intent || '';
    const metadata = session.metadata || {};
    const videoId = metadata.video_id;
    const customerEmail = metadata.customer_email;
    const customerName = metadata.customer_name || '';

    if (!sessionId || !videoId) {
      console.error('Missing session_id or video_id in webhook');
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // ===== 记录支付到 OSS payments.json（去重） =====
    const payments = (await readJson<Payment[]>(PAYMENTS_KEY)) || [];

    const exists = payments.some((p) => p.airwallex_payment_intent_id === sessionId);
    if (exists) {
      console.log('Duplicate webhook, ignoring');
    } else {
      payments.push({
        video_id: parseInt(videoId),
        customer_email: customerEmail,
        customer_name: customerName,
        amount: 100,
        currency: 'USD',
        airwallex_payment_intent_id: sessionId,
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
