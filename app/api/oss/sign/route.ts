import { NextRequest, NextResponse } from 'next/server';
import { signUrl } from '@/lib/oss';

// ============================================
// 生成 OSS 对象临时签名链接(7天有效)
// 用于首页背景视频等硬编码场景
// ============================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'key required' }, { status: 400 });
  }

  // 只允许签名 videos/ 目录下的对象,防止任意签名
  if (!key.startsWith('videos/')) {
    return NextResponse.json({ error: 'invalid key' }, { status: 400 });
  }

  const url = signUrl('GET', key, '', 604800); // 7天
  return NextResponse.json({ url });
}
