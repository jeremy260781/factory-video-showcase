import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/oss';

// ============================================
// 视频目录 API:数据存 OSS 上的 videos.json
// GET   - 读取全部视频
// POST  - 新增视频(需 admin 密码)
// PATCH - 切换上架/下架(需 admin 密码)
// DELETE- 删除视频(需 admin 密码)
// ============================================

const VIDEOS_KEY = 'videos.json';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'asd123';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  factory_name: string;
  product_name: string;
  is_published: boolean;
  created_at: string;
}

function checkAuth(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return password === ADMIN_PASSWORD;
}

// ===== 读取视频列表 =====
export async function GET() {
  const videos = (await readJson<Video[]>(VIDEOS_KEY)) || [];
  return NextResponse.json(videos);
}

// ===== 新增视频 =====
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, category, factory_name, product_name, video_url, thumbnail_url } = body;

  if (!title || !factory_name || !product_name || !video_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const videos = (await readJson<Video[]>(VIDEOS_KEY)) || [];

  const video: Video = {
    id: Date.now(),
    title,
    description: description || '',
    video_url,
    thumbnail_url: thumbnail_url || '',
    category: category || 'Uncategorized',
    factory_name,
    product_name,
    is_published: true,
    created_at: new Date().toISOString(),
  };

  videos.push(video);
  const ok = await writeJson(VIDEOS_KEY, videos);
  if (!ok) {
    return NextResponse.json({ error: 'Failed to save videos' }, { status: 500 });
  }

  return NextResponse.json({ success: true, video });
}

// ===== 切换发布状态 =====
export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(request.nextUrl.searchParams.get('id'));
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const videos = (await readJson<Video[]>(VIDEOS_KEY)) || [];
  const updated = videos.map((v) =>
    v.id === id ? { ...v, is_published: !v.is_published } : v
  );

  const ok = await writeJson(VIDEOS_KEY, updated);
  if (!ok) {
    return NextResponse.json({ error: 'Failed to save videos' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ===== 删除视频 =====
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(request.nextUrl.searchParams.get('id'));
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const videos = (await readJson<Video[]>(VIDEOS_KEY)) || [];
  const remaining = videos.filter((v) => v.id !== id);

  const ok = await writeJson(VIDEOS_KEY, remaining);
  if (!ok) {
    return NextResponse.json({ error: 'Failed to save videos' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
