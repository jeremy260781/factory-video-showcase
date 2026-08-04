import crypto from 'crypto';

// ============================================
// 阿里云 OSS 工具:签名 URL + JSON 读写
// 替代原 Supabase 存储:视频目录存 videos.json,
// 支付记录存 payments.json,都在 OSS 桶里
// ============================================

const BUCKET = process.env.OSS_BUCKET!;
const REGION = process.env.OSS_REGION!;
const ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID!;
const ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET!;

const ACL_HEADER = 'x-oss-object-acl:public-read\n';

function hmacSha1(key: string, data: string): string {
  return crypto.createHmac('sha1', key).update(data).digest('base64');
}

/**
 * 生成 OSS 签名 URL(查询参数方式鉴权)
 * @param method GET 或 PUT
 * @param objectKey 对象 key
 * @param contentType Content-Type(仅 PUT 需要)
 * @param expiresIn 有效期(秒)
 * @param withPublicAcl 是否签名 x-oss-object-acl:public-read(公开读)
 */
export function signUrl(
  method: 'GET' | 'PUT',
  objectKey: string,
  contentType = '',
  expiresIn = 900,
  withPublicAcl = false
): string {
  const expires = Math.floor(Date.now() / 1000) + expiresIn;
  const ossHeaders = withPublicAcl ? ACL_HEADER : '';
  const resource = `/${BUCKET}/${objectKey}`;
  // StringToSign = VERB\nContent-MD5\nContent-Type\nExpires\nCanonicalizedOSSHeaders\nCanonicalizedResource
  const stringToSign = `${method}\n\n${contentType}\n${expires}\n${ossHeaders}${resource}`;
  const signature = hmacSha1(ACCESS_KEY_SECRET, stringToSign);
  return `https://${BUCKET}.${REGION}.aliyuncs.com/${objectKey}?OSSAccessKeyId=${ACCESS_KEY_ID}&Expires=${expires}&Signature=${encodeURIComponent(signature)}`;
}

/** 从 OSS 读取 JSON 对象;不存在返回 null */
export async function readJson<T>(objectKey: string): Promise<T | null> {
  try {
    const url = signUrl('GET', objectKey);
    const res = await fetch(url, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`OSS GET failed: ${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    console.error('OSS readJson error:', e);
    return null;
  }
}

/** 向 OSS 写入 JSON 对象(公开读) */
export async function writeJson(objectKey: string, data: unknown): Promise<boolean> {
  try {
    const url = signUrl('PUT', objectKey, 'application/json', 900, true);
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-oss-object-acl': 'public-read',
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (e) {
    console.error('OSS writeJson error:', e);
    return false;
  }
}
