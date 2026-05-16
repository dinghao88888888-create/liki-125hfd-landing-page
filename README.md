# LIKI 125HFD Landing Page

Standalone static Astro landing page for LIKI Systems 125HFD Series heavy-duty folding glass walls.

## Local Commands

```bash
npm install
npm run dev
npm run build
```

Build output: `dist`

## Cloudflare Pages

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

Recommended custom domain: `125hfd.likisystems.com`

## Inquiry Upload System

The inquiry forms use Cloudflare Pages Functions, Cloudflare R2, and Resend.

Required Cloudflare Pages environment variables:

```text
RESEND_API_KEY
INQUIRY_FROM_EMAIL=LIKI Systems <info@likisystems.com>
INQUIRY_TO_EMAIL=info@likisystems.com
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
DOWNLOAD_TOKEN_SECRET
```

Required Cloudflare Pages binding:

```text
UPLOAD_BUCKET -> R2 bucket liki-upload
```

R2 CORS must allow `PUT` uploads from the Pages preview domain and production custom domain.

## Project Notes

- No WordPress dependency.
- No Bricks Builder dependency.
- No header, footer, or navigation menu.
- No SSR, database, or CMS. Cloudflare Pages Functions are used only for inquiry uploads, private R2 downloads, and Resend email notifications.
- All landing page image assets are local in `public/images/`.
- Images were generated with Codex built-in image generation. The generator returned PNG files, and no local WebP converter was available, so the site references PNG assets.
- Contact settings are centralized in `src/data/site.js`.
- The inquiry success state is shown inline and links to `/thank-you/`.
