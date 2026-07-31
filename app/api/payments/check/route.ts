import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('video_id');
  const email = searchParams.get('email');

  if (!videoId || !email) {
    return NextResponse.json({ unlocked: false, error: 'Missing video_id or email' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabase
      .from('payments')
      .select('id, status, created_at')
      .eq('video_id', parseInt(videoId))
      .eq('customer_email', email)
      .eq('status', 'succeeded')
      .limit(1);

    if (error) {
      console.error('Payment check error:', error);
      return NextResponse.json({ unlocked: false });
    }

    return NextResponse.json({
      unlocked: data && data.length > 0,
    });
  } catch (error) {
    console.error('Payment check error:', error);
    return NextResponse.json({ unlocked: false });
  }
}
