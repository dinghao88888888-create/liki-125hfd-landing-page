import { json, MAX_FILES, sanitizeFilename, validateFile } from "../../_lib/config.js";
import { createR2PresignedPutUrl } from "../../_lib/signing.js";

export async function onRequestPost({ request, env }) {
  try {
    const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"];
    const missing = required.filter((name) => !env[name]);
    if (missing.length) {
      return json({ error: `Missing environment variables: ${missing.join(", ")}` }, { status: 500 });
    }

    const body = await request.json();
    const files = Array.isArray(body.files) ? body.files : [];
    if (files.length > MAX_FILES) {
      return json({ error: `Upload up to ${MAX_FILES} files per inquiry.` }, { status: 400 });
    }

    const signed = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) return json({ error }, { status: 400 });

      const id = crypto.randomUUID();
      const safeName = sanitizeFilename(file.name);
      const date = new Date().toISOString().slice(0, 10);
      const key = `inquiries/${date}/${id}-${safeName}`;
      const uploadUrl = await createR2PresignedPutUrl({
        env,
        bucket: "liki-upload",
        key,
        contentType: file.type || "application/octet-stream",
        expiresIn: 3600
      });

      signed.push({
        uploadUrl,
        key,
        originalName: file.name,
        size: file.size,
        type: file.type || "application/octet-stream"
      });
    }

    return json({ uploads: signed });
  } catch (error) {
    return json({ error: error.message || "Could not prepare file upload." }, { status: 500 });
  }
}
