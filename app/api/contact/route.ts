import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/oss';

// ============================================
// 联系表单 API:留言存 OSS 上的 contact-messages.json
// POST - 提交留言(公开)
// GET  - 读取留言列表(需 admin 密码,供后台查看)
// ============================================

const MESSAGES_KEY = 'contact-messages.json';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Fty@2026!';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email and message are required' }, { status: 400 });
    }

    const messages = (await readJson<ContactMessage[]>(MESSAGES_KEY)) || [];

    const newMessage: ContactMessage = {
      id: Date.now(),
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 150),
      company: String(company || '').slice(0, 150),
      message: String(message).slice(0, 3000),
      created_at: new Date().toISOString(),
    };

    messages.push(newMessage);
    await writeJson(MESSAGES_KEY, messages);

    return NextResponse.json({ ok: true, id: newMessage.id });
  } catch (e: any) {
    console.error('Contact save error:', e);
    return NextResponse.json({ error: e.message || 'Failed to save message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = (await readJson<ContactMessage[]>(MESSAGES_KEY)) || [];
  // 最新的排前面
  return NextResponse.json(messages.reverse());
}
