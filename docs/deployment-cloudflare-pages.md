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

- This project is a standalone static Astro site.
- It does not use WordPress, Bricks Builder, SSR, a backend, a database, CMS, or serverless functions.
- All page images are stored locally in `/public/images/`.
- Canonical URL is currently set to `https://125hfd.likisystems.com/` in `astro.config.mjs` and `src/pages/index.astro`.
