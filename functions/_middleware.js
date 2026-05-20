export async function onRequest(context) {
  const response = await context.next();
  const host = context.request.headers.get("host") || "";

  if (!host.endsWith(".pages.dev")) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
