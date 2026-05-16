export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 500 * 1024 * 1024;
export const DOWNLOAD_TTL_SECONDS = 30 * 24 * 60 * 60;
export const ALLOWED_EXTENSIONS = new Set([
  "dwg",
  "pdf",
  "zip",
  "step",
  "stp",
  "jpg",
  "jpeg",
  "png"
]);

export const ALLOWED_MIME_TYPES = new Set([
  "",
  "application/acad",
  "application/autocad",
  "application/octet-stream",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
  "image/png",
  "model/step",
  "model/step+xml"
]);

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {})
    }
  });
}

export function getExtension(filename = "") {
  const clean = filename.toLowerCase().split("?")[0].split("#")[0];
  const index = clean.lastIndexOf(".");
  return index >= 0 ? clean.slice(index + 1) : "";
}

export function sanitizeFilename(filename = "drawing") {
  return filename
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 120) || "drawing";
}

export function validateFile(file) {
  if (!file || typeof file !== "object") return "Invalid file metadata.";
  const name = String(file.name || "");
  const size = Number(file.size || 0);
  const type = String(file.type || "");
  const ext = getExtension(name);

  if (!name) return "File name is required.";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return `Unsupported file type .${ext || "unknown"}. Please upload DWG, PDF, ZIP, STEP, JPG, or PNG files.`;
  }
  if (!Number.isFinite(size) || size <= 0) return "File size is invalid.";
  if (size > MAX_FILE_SIZE) return "Each uploaded file must be 500MB or smaller.";
  if (!ALLOWED_MIME_TYPES.has(type)) {
    return `Unsupported file MIME type ${type}.`;
  }
  return null;
}
