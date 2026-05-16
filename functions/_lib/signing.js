const encoder = new TextEncoder();

function base64UrlFromBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncode(text) {
  return base64UrlFromBytes(encoder.encode(text));
}

function base64UrlDecode(text) {
  const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

async function hmacBytes(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    typeof secret === "string" ? encoder.encode(secret) : secret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

export async function createDownloadToken(payload, secret) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlFromBytes(await hmacBytes(secret, body));
  return `${body}.${signature}`;
}

export async function verifyDownloadToken(token, secret) {
  if (!token || !token.includes(".")) throw new Error("Missing download token.");
  const [body, signature] = token.split(".");
  const expected = base64UrlFromBytes(await hmacBytes(secret, body));
  if (signature !== expected) throw new Error("Invalid download token.");
  const payload = JSON.parse(base64UrlDecode(body));
  if (!payload.exp || Date.now() / 1000 > payload.exp) throw new Error("Download link expired.");
  if (!payload.key) throw new Error("Invalid download payload.");
  return payload;
}

function awsEncode(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacRaw(keyBytes, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function getSigningKey(secretAccessKey, dateStamp) {
  const kDate = await hmacRaw(encoder.encode(`AWS4${secretAccessKey}`), dateStamp);
  const kRegion = await hmacRaw(kDate, "auto");
  const kService = await hmacRaw(kRegion, "s3");
  return hmacRaw(kService, "aws4_request");
}

export async function createR2PresignedPutUrl({ env, bucket, key, expiresIn = 3600 }) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const credential = `${env.R2_ACCESS_KEY_ID}/${credentialScope}`;
  const canonicalUri = `/${awsEncode(bucket)}/${key.split("/").map(awsEncode).join("/")}`;
  const params = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", credential],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(expiresIn)],
    ["X-Amz-SignedHeaders", "host"]
  ];
  const canonicalQueryString = params
    .map(([name, value]) => `${awsEncode(name)}=${awsEncode(value)}`)
    .join("&");
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQueryString,
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD"
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest)
  ].join("\n");
  const signingKey = await getSigningKey(env.R2_SECRET_ACCESS_KEY, dateStamp);
  const signatureBytes = await hmacRaw(signingKey, stringToSign);
  const signature = [...signatureBytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}
