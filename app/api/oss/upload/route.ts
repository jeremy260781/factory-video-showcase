import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ============================================
// OSS 上传签名:生成带 x-oss-object-acl: public-read
// 的签名 PUT URL,上传后的视频公开可访问
// ============================================

function hmacSha1(key: string, data: string): string {
  return crypto.createHmac('sha1', key).update(data).digest('base64');
}

function getSignature(bucket: string, objectKey: string, contentType: string, expires: number): string {
  const verb = 'PUT';
  const md5 = '';
  // 关键:上传时设置对象 ACL 为 public-read,视频才能公开播放
  const ossHeaders = 'x-oss-object-acl:public-read\n';
  const resource = `/${bucket}/${objectKey}`;
  const stringToSign = `${verb}\n${md5}\n${contentType}\n${expires}\n${ossHeaders}${resource}`;
  return hmacSha1(process.env.OSS_ACCESS_KEY_SECRET!, stringToSign);
}

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'fileName required' }, { status: 400 });
    }

    const bucket = process.env.OSS_BUCKET!;
    const region = process.env.OSS_REGION!;
    const accessKeyId = process.env.OSS_ACCESS_KEY_ID!;

    // 使用时间戳防止文件名冲突
    const ext = fileName.split('.').pop();
    const key = `videos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const expires = Math.floor(Date.now() / 1000) + 900; // 15分钟有效
    const ctype = contentType || 'application/octet-stream';
    const signature = getSignature(bucket, key, ctype, expires);

    // 构造签名上传 URL(签名包含 public-read ACL)
    const uploadUrl = `https://${bucket}.${region}.aliyuncs.com/${key}?OSSAccessKeyId=${accessKeyId}&Expires=${expires}&Signature=${encodeURIComponent(signature)}`;

    // 文件公开访问 URL
    const publicUrl = `https://${bucket}.${region}.aliyuncs.com/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (error: any) {
    console.error('OSS upload token error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
