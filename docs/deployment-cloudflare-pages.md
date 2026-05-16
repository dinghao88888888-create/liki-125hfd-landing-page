# Cloudflare Pages Deployment

## Build Settings

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

## Custom Domain Recommendation

Recommended domain: `125hfd.likisystems.com`

Reason: It matches the product series name, keeps paid traffic intent specific, and leaves broader `ads.likisystems.com` available for future campaigns.

## Notes

- This project is a standalone Astro site deployed on Cloudflare Pages.
- It does not use WordPress, Bricks Builder, SSR, a database, or CMS. Cloudflare Pages Functions are used only for inquiry uploads, private R2 downloads, and Resend email notifications.
- All page images are stored locally in `/public/images/`.
- Canonical URL is currently set to `https://125hfd.likisystems.com/` in `astro.config.mjs` and `src/pages/index.astro`.

## Inquiry System Settings

Cloudflare Pages Functions handle inquiries, file uploads, and email notifications.

Required environment variables:

- `RESEND_API_KEY`
- `INQUIRY_FROM_EMAIL=LIKI Systems <info@likisystems.com>`
- `INQUIRY_TO_EMAIL=info@likisystems.com`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `DOWNLOAD_TOKEN_SECRET`

Required binding:

- R2 binding name: `UPLOAD_BUCKET`
- R2 bucket: `liki-upload`

R2 CORS must allow browser `PUT` requests from the deployed Pages domain and final custom domain. Include `content-type` in allowed headers.
