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

## Project Notes

- No WordPress dependency.
- No Bricks Builder dependency.
- No header, footer, or navigation menu.
- No SSR, backend, database, CMS, or serverless functions.
- All landing page image assets are local in `public/images/`.
- Images were generated with Codex built-in image generation. The generator returned PNG files, and no local WebP converter was available, so the site references PNG assets.
- Contact settings are centralized in `src/data/site.js`.
- The Web3Forms redirect is currently set to `/thank-you/` so it works on the deployed Pages domain and the final custom domain. If Web3Forms requires an absolute URL for your account settings, update the redirect to the production domain, such as `https://125hfd.likisystems.com/thank-you/`, before launching paid traffic.
