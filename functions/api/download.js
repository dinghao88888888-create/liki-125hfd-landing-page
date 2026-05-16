import { json } from "../_lib/config.js";
import { verifyDownloadToken } from "../_lib/signing.js";

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DOWNLOAD_TOKEN_SECRET) {
      return json({ error: "Missing DOWNLOAD_TOKEN_SECRET." }, { status: 500 });
    }
    if (!env.UPLOAD_BUCKET) {
      return json({ error: "Missing UPLOAD_BUCKET R2 binding." }, { status: 500 });
    }

    const url = new URL(request.url);
    const payload = await verifyDownloadToken(url.searchParams.get("token"), env.DOWNLOAD_TOKEN_SECRET);
    const object = await env.UPLOAD_BUCKET.get(payload.key);
    if (!object) return json({ error: "File not found." }, { status: 404 });

    const filename = String(payload.name || "download").replace(/["\\]/g, "");
    return new Response(object.body, {
      headers: {
        "content-type": payload.type || object.httpMetadata?.contentType || "application/octet-stream",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "private, no-store"
      }
    });
  } catch (error) {
    return json({ error: error.message || "Download link is invalid." }, { status: 403 });
  }
}
