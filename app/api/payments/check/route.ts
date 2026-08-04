import { NextRequest, NextResponse } from 'next/server';
import { readJson } from '@/lib/oss';

// ============================================
// 检查视频是否已解锁:读取 OSS 上的 payments.json
// ============================================

const PAYMENTS_KEY = 'payments.json';

interface Payment {
  video_id: number;
  customer_email: string;
  status: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('video_id');
  const email = searchParams.get('email');

  if (!videoId || !email) {
    return NextResponse.json({ unlocked: false, error: 'Missing video_id or email' });
  }

  try {
    const payments = (await readJson<Payment[]>(PAYMENTS_KEY)) || [];
    const unlocked = payments.some(
      (p) =>
        String(p.video_id) === videoId &&
        p.customer_email?.toLowerCase() === email.toLowerCase() &&
        p.status === 'succeeded'
    );
    return NextResponse.json({ unlocked });
  } catch (error) {
    console.error('Payment check error:', error);
    return NextResponse.json({ unlocked: false });
  }
}
