import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

function createR2Client(env) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY
    }
  });
}

export async function createR2PresignedPutUrl({ env, bucket, key, contentType, expiresIn = 3600 }) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(contentType ? { ContentType: contentType } : {})
  });

  return getSignedUrl(createR2Client(env), command, { expiresIn });
}
