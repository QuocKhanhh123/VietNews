// libs/verify-jwt-edge.ts

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function verifyJwtEdge(token: string) {
  const [header, payload, signature] = token.split('.');

  if (!header || !payload || !signature) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = `${header}.${payload}`;
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToUint8Array(signature),
    encoder.encode(data)
  );

  if (!isValid) return null;

  try {
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch {
    return null;
  }
}

function base64UrlToUint8Array(base64Url: string) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Padded = base64 + pad;
  const rawData = atob(base64Padded);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
