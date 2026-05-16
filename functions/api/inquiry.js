import { DOWNLOAD_TTL_SECONDS, json, MAX_FILES, validateFile } from "../_lib/config.js";
import { createDownloadToken } from "../_lib/signing.js";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBytes(bytes = 0) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function row(label, value) {
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;width:190px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;">${escapeHtml(value || "-")}</td></tr>`;
}

function getField(body, label, camelKey) {
  const payload = body && typeof body === "object" ? body : {};
  const nestedFields = payload.fields && typeof payload.fields === "object" ? payload.fields : {};
  const value = nestedFields[label] ?? payload[label] ?? payload[camelKey];
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function onRequestPost({ request, env }) {
  try {
    const required = ["RESEND_API_KEY", "DOWNLOAD_TOKEN_SECRET", "INQUIRY_FROM_EMAIL", "INQUIRY_TO_EMAIL"];
    const missing = required.filter((name) => !env[name]);
    if (missing.length) {
      return json({ error: `Missing environment variables: ${missing.join(", ")}` }, { status: 500 });
    }

    const body = await request.json();
    const rawFields = body.fields && typeof body.fields === "object" ? body.fields : {};
    const fields = {
      ...rawFields,
      "Full Name": getField(body, "Full Name", "fullName"),
      "Work Email": getField(body, "Work Email", "workEmail"),
      "Project Location": getField(body, "Project Location", "projectLocation")
    };
    const files = Array.isArray(body.files) ? body.files : [];
    const subject = String(body.subject || "LIKI 125HFD Landing Page Inquiry");

    if (!fields["Full Name"] || !fields["Work Email"] || !fields["Project Location"]) {
      return json({ error: "Full Name, Work Email, and Project Location are required." }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return json({ error: `Upload up to ${MAX_FILES} files per inquiry.` }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const expiresAt = Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS;
    const fileLinks = [];

    for (const file of files) {
      const error = validateFile({ name: file.originalName, size: file.size, type: file.type });
      if (error) return json({ error }, { status: 400 });
      if (!file.key) return json({ error: "Uploaded file metadata is missing an R2 key." }, { status: 400 });

      const token = await createDownloadToken(
        {
          key: file.key,
          name: file.originalName,
          type: file.type,
          exp: expiresAt
        },
        env.DOWNLOAD_TOKEN_SECRET
      );
      fileLinks.push({
        ...file,
        url: `${origin}/api/download?token=${encodeURIComponent(token)}`
      });
    }

    const fileHtml = fileLinks.length
      ? `<ul>${fileLinks
          .map(
            (file) =>
              `<li><a href="${file.url}">${escapeHtml(file.originalName)}</a> (${formatBytes(file.size)})<br><small>R2 key: ${escapeHtml(file.key)}</small></li>`
          )
          .join("")}</ul>`
      : "<p>No files uploaded.</p>";

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
        <h2>${escapeHtml(subject)}</h2>
        <table style="border-collapse:collapse;width:100%;max-width:760px;">
          ${row("Customer name", fields["Full Name"])}
          ${row("Email", fields["Work Email"])}
          ${row("Phone / WhatsApp", fields["Phone / WhatsApp"])}
          ${row("Company", fields["Company Name"])}
          ${row("Project location", fields["Project Location"])}
          ${row("Project type", fields["Project Type"])}
          ${row("Opening size", fields["Opening Size"])}
          ${row("Interested system", fields["Interested System"])}
          ${row("Project stage", fields["Project Stage"])}
        </table>
        <h3>Message / Requirements</h3>
        <p style="white-space:pre-wrap;">${escapeHtml(fields["Message / Requirements"] || "-")}</p>
        <h3>Downloadable file links</h3>
        <p>Links are valid for 30 days.</p>
        ${fileHtml}
        <p><small>Source: ${escapeHtml(body.source || "LIKI 125HFD Landing Page")}</small></p>
      </div>
    `;

    const text = [
      subject,
      "",
      `Customer name: ${fields["Full Name"] || "-"}`,
      `Email: ${fields["Work Email"] || "-"}`,
      `Phone / WhatsApp: ${fields["Phone / WhatsApp"] || "-"}`,
      `Company: ${fields["Company Name"] || "-"}`,
      `Project location: ${fields["Project Location"] || "-"}`,
      `Project type: ${fields["Project Type"] || "-"}`,
      `Opening size: ${fields["Opening Size"] || "-"}`,
      `Interested system: ${fields["Interested System"] || "-"}`,
      `Project stage: ${fields["Project Stage"] || "-"}`,
      "",
      "Message / Requirements:",
      fields["Message / Requirements"] || "-",
      "",
      "Downloadable file links valid for 30 days:",
      ...(fileLinks.length
        ? fileLinks.map((file) => `${file.originalName} (${formatBytes(file.size)}): ${file.url}\nR2 key: ${file.key}`)
        : ["No files uploaded."])
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
        "Idempotency-Key": crypto.randomUUID()
      },
      body: JSON.stringify({
        from: env.INQUIRY_FROM_EMAIL,
        to: [env.INQUIRY_TO_EMAIL],
        reply_to: fields["Work Email"],
        subject,
        html,
        text
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json(
        { error: result.message || "Resend could not send the inquiry email.", details: result },
        { status: 502 }
      );
    }

    return json({ ok: true, emailId: result.id, files: fileLinks.map(({ url, ...file }) => ({ ...file, url })) });
  } catch (error) {
    return json({ error: error.message || "Inquiry submission failed." }, { status: 500 });
  }
}
