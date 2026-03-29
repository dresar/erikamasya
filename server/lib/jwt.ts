const encoder = new TextEncoder();

function toBase64Url(input: ArrayBuffer | Uint8Array | string) {
  const buf = typeof input === 'string' ? Buffer.from(input) : Buffer.from(input);
  return buf
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function fromBase64Url(b64url: string) {
  const pad = b64url.length % 4 === 0 ? '' : '='.repeat(4 - (b64url.length % 4));
  const b64 = b64url.replaceAll('-', '+').replaceAll('_', '/') + pad;
  return Buffer.from(b64, 'base64');
}

async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return new Uint8Array(sig);
}

export type JwtPayload = {
  sub: string;
  role?: string | null;
  exp: number;
};

export async function signJwt(payload: JwtPayload, secret: string) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const sig = await hmacSha256(secret, signingInput);
  const encodedSig = toBase64Url(sig);
  return `${signingInput}.${encodedSig}`;
}

export async function verifyJwt(token: string, secret: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const signingInput = `${h}.${p}`;
  const sig = await hmacSha256(secret, signingInput);
  const expected = toBase64Url(sig);
  if (expected !== s) return null;

  const payload = JSON.parse(fromBase64Url(p).toString('utf-8')) as JwtPayload;
  if (!payload?.exp || typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

