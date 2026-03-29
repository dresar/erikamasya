const encoder = new TextEncoder();

function toBase64(bytes: ArrayBuffer) {
  return Buffer.from(bytes).toString('base64');
}

function fromBase64(b64: string) {
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

function randomBytes(length: number) {
  const b = new Uint8Array(length);
  crypto.getRandomValues(b);
  return b;
}

export async function hashPassword(password: string) {
  const iterations = 210_000;
  const salt = randomBytes(16);

  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    256
  );

  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(bits)}`;
}

export async function verifyPassword(password: string, stored: string) {
  const parts = stored.split('$');
  if (parts.length !== 4) return false;
  const [scheme, iterStr, saltB64, hashB64] = parts;
  if (scheme !== 'pbkdf2') return false;
  const iterations = Number(iterStr);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const salt = fromBase64(saltB64);
  const expected = fromBase64(hashB64);

  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    256
  );

  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i += 1) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

