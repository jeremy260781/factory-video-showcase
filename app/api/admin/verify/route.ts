import { NextRequest, NextResponse } from 'next/server';

// ============================================
// 后台密码验证 API
// 前端不再硬编码密码,统一走这里验证
// ============================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Fty@2026!';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
