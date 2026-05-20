# LIKI 140 / 145 Landing Page - Long-term AI Project Manual

Last updated: 2026-05-20

This document is the long-term working manual for the LIKI folding glass doors advertising landing page. It is intended for future AI assistants, developers, and non-technical collaborators who need to continue the project across multiple chats, deployment stages, and advertising tracking work.

## 1. Project Overview

### Project Name

LIKI 140 / 145 Folding Glass Doors Landing Page

### Current Production Site

```text
https://folding-glass-doors.likisystems.com/
```

### Current Stage

Production live + Google Ads tracking verification stage.

The new LIKI 140 / LIKI 145 landing page is now the production homepage at `/`. The previous `preview-140-145` testing route has been removed. GitHub `main` is synchronized, and Cloudflare Pages automatic deployment is working.

### Project Goal

Maintain a standalone, high-conversion Google Ads landing page for LIKI Systems' ultra-large folding glass door systems, focused on LIKI 140 and LIKI 145.

The page should support North American luxury residential, architectural, builder, and commercial inquiry traffic. It must explain the product clearly, build engineering trust, and convert visitors through inquiry forms, WhatsApp, and direct email follow-up.

### Project Positioning

A premium architectural landing page for custom-built, heavy-duty aluminum folding glass door systems.

LIKI positioning:

- LIKI 140: refined residential luxury folding glass door system.
- LIKI 145: monumental architectural opening system.
- Custom-built around the project opening.
- Architectural-grade aluminum folding glass walls.
- Built for North American luxury homes, architects, builders, and high-end commercial projects.
- Engineering support from drawings to delivery.

### Technical Stack

- Frontend: Astro static site.
- Styling: plain CSS in `src/styles/global.css`.
- Components: Astro components.
- Backend: Cloudflare Pages Functions only.
- Email delivery: Resend API.
- File storage code: Cloudflare R2 bucket `liki-upload`, currently deferred from the live UI.
- Hosting: Cloudflare Pages.
- Production branch: `main`.
- Build output: `dist`.
- No CMS, no database, no WordPress, no Bricks Builder, no traditional server.

## 2. Current Production State

### Completed Production Work

- New LIKI 140 / LIKI 145 landing page has replaced the production homepage `/`.
- `preview-140-145` test route has been deleted.
- Images are unified under optimized production paths: `public/images/optimized/*.webp`.
- Favicon files have been added at root public paths.
- SEO metadata has been corrected for the production domain.
- `canonical`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `image` now use production-ready URLs.
- Floating Navigation has been adjusted for the advertising conversion path.
- Product cards for LIKI 140 / LIKI 145 are linked into the main inquiry form flow.
- Main form and popup form `Interested System` options no longer focus on 125HFD; they now use LIKI 140, LIKI 145, and related project options.
- GA4 has been installed with Measurement ID `G-VTK5YEKDW9`.
- Google Ads Inquiry Form Submission conversion has been set up based on `/thank-you/`.
- Google Ads base AW config has been added with Conversion ID `AW-18111406135`.
- WhatsApp Click conversion has been set up with `send_to: AW-18111406135/RXykCKC36q8cELfAmLxD`.
- WhatsApp click tracking is live and listens for `a[href*="wa.me"]`.
- Email Click conversion has been implemented with `send_to: AW-18111406135/O4Q4CM7skbAcELfAmLxD`, but Google Ads testing has not detected it successfully yet.
- `.gitignore` has been cleaned to reduce local design/source asset noise.
- GitHub `main` has been synchronized, and Cloudflare Pages automatic deployment is normal.

### Production Inquiry Flow

Current live form conversion path:

1. User submits the main or popup inquiry form.
2. Browser sends the request to `/api/inquiry`.
3. Cloudflare Pages Function sends the inquiry email through Resend to `info@likisystems.com`.
4. Browser redirects to `/thank-you/`.
5. Google Ads Inquiry Form Submission conversion is recorded from the `/thank-you/` page.

Important status:

- The live inquiry flow does not require file upload.
- Resend email delivery to `info@likisystems.com` has been verified.
- Required-field handling recognizes `Full Name`, `Work Email`, and `Project Location`.
- Visitors can still send drawings directly by email to `info@likisystems.com`.

### WhatsApp Conversion Flow

Current live WhatsApp conversion path:

1. User clicks a WhatsApp link containing `wa.me`.
2. `src/components/GoogleAnalytics.astro` detects the click with a global `a[href*="wa.me"]` listener.
3. It fires:

```js
gtag("event", "conversion", {
  send_to: "AW-18111406135/RXykCKC36q8cELfAmLxD",
  value: 100.0,
  currency: "USD"
});
```

4. The WhatsApp link continues to open normally.

Compatibility notes:

- If `gtag` is unavailable, the WhatsApp link still opens.
- Middle-click, new-window behavior, and existing `target="_blank"` behavior are preserved.
- No duplicate Google tag base script should be added.

### Email Click Conversion Flow

Current Email Click conversion path:

1. User clicks a direct email link matching `a[href^="mailto:info@likisystems.com"]`.
2. `src/components/GoogleAnalytics.astro` detects the click.
3. For ordinary left-clicks, the script briefly prevents the default mailto navigation, fires the Google Ads conversion event, then opens the original `mailto:` link through `event_callback` or an approximately 800ms fallback timeout.
4. For Ctrl, Meta, Shift, Alt, middle-click, or other non-left-click behavior, the script does not intercept and browser defaults remain untouched.

Current implementation:

```js
gtag("event", "conversion", {
  send_to: "AW-18111406135/O4Q4CM7skbAcELfAmLxD",
  value: 50.0,
  currency: "USD",
  event_callback: openMailto
});
```

Important status:

- The `mailto:info@likisystems.com` link opens the user's mail client normally.
- The code includes `event_callback` and a fallback timeout to avoid losing the conversion request during immediate `mailto:` handoff.
- As of 2026-05-20, Google Ads testing still did not successfully detect the Email Click conversion.
- Do not treat Email Click as verified until Google Ads records it successfully.
- Future troubleshooting should focus on Google Ads / tag diagnostics for this specific conversion action, not on changing form logic, Cloudflare Functions, Resend, R2, or page layout.

### Google Analytics and Ads Tracking

GA4 base tracking:

- File: `src/components/GoogleAnalytics.astro`
- Measurement ID: `G-VTK5YEKDW9`
- Google Ads Conversion ID: `AW-18111406135`
- Installed through page head injection on the current Astro pages.

Google Ads conversions:

- Inquiry Form Submission: based on successful redirect to `/thank-you/`.
- WhatsApp Click: fired from `GoogleAnalytics.astro` when users click links matching `a[href*="wa.me"]`.
- Email Click: fired from `GoogleAnalytics.astro` when users click links matching `a[href^="mailto:info@likisystems.com"]`, but not yet verified by Google Ads.

Current verification stage:

- Google Ads Inquiry Form Submission conversion is effective.
- WhatsApp Click conversion is effective.
- Email Click conversion is implemented but currently not detected successfully by Google Ads.
- Continue GA4 event system refinement later.

## 3. Current Architecture

### Frontend

Primary page:

- `src/pages/index.astro`

Secondary conversion page:

- `src/pages/thank-you.astro`

The site uses reusable Astro components for CTAs, images, navigation, WhatsApp, inquiry forms, popup forms, and tracking.

### Backend

There is no traditional backend server.

Cloudflare Pages Functions are used for first-party inquiry infrastructure:

- `POST /api/inquiry`
- `POST /api/uploads/sign`
- `GET /api/download`

Live production uses `/api/inquiry`. Upload signing and download proxy code remain in the project but are not part of the current advertising conversion path.

### Hosting

Cloudflare Pages.

Expected Pages settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Production custom domain: `https://folding-glass-doors.likisystems.com/`

### Third-party Services

- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare R2, deferred for live upload UI
- Resend
- GitHub
- Google Analytics 4
- Google Ads

Removed service:

- Web3Forms has been fully removed and should not be reintroduced unless the user explicitly reverses the architecture.

## 4. Key Files

### Production Pages

- `src/pages/index.astro`
  - Main production homepage and conversion page.
  - Contains page sections, SEO metadata, product cards, form anchors, visual sections, and conversion routing.
- `src/pages/thank-you.astro`
  - Post-inquiry thank-you page.
  - Used for Google Ads Inquiry Form Submission conversion.

### Tracking

- `src/components/GoogleAnalytics.astro`
  - Contains the GA4 base Google tag.
  - Contains Google Ads AW config for `AW-18111406135`.
  - Contains `/thank-you/` Inquiry Form Submission conversion tracking.
  - Contains WhatsApp Click Google Ads conversion tracking.
  - Contains Email Click Google Ads conversion tracking for `mailto:info@likisystems.com`.
  - Do not duplicate Google tag code elsewhere.

### Components

- `src/components/CTAButton.astro`
  - Shared CTA button behavior.
- `src/components/FloatingNav.astro`
  - Advertising conversion path navigation.
- `src/components/InquiryForm.astro`
  - Main quote form.
  - Current `Interested System` options should stay aligned with LIKI 140 / LIKI 145.
- `src/components/PopupInquiryForm.astro`
  - Popup quote form.
  - Current `Interested System` options should stay aligned with LIKI 140 / LIKI 145.
- `src/components/InquiryClientScript.astro`
  - Client-side inquiry submission behavior.
  - Handles form submission, success redirect, and error states.
- `src/components/WhatsAppButton.astro`
  - Floating WhatsApp CTA using `wa.me`.
  - Do not change number or text unless explicitly requested.
- `src/components/ImageBlock.astro`
  - Shared image presentation component.

### Data and Styles

- `src/data/sections.js`
  - Section content and image references.
- `src/data/site.js`
  - Central contact configuration.
  - Email: `info@likisystems.com`
  - WhatsApp number: `8615806631151`
  - WhatsApp message: project inquiry template.
- `src/styles/global.css`
  - Global visual system and component styling.
  - Avoid broad edits.

### Assets and Repo Hygiene

- `public/images/optimized/`
  - Current production image directory.
  - The homepage uses optimized `.webp` files from this directory for major visual assets.
- `public/favicon.ico`
- `public/favicon.png`
- `public/apple-touch-icon.png`
  - Current favicon files referenced from the homepage head.
- `.gitignore`
  - Cleaned to reduce noise from local source assets.

### Deferred Upload Infrastructure

- `functions/api/uploads/sign.js`
- `functions/api/download.js`
- `functions/_lib/config.js`
- `functions/_lib/signing.js`

These files exist for future upload work. Do not restore file upload UI or make R2 upload a current task unless the user explicitly asks.

## 5. Design and UX Rules

### Design Direction

- Premium North American architectural look.
- No traditional header or footer.
- No generic catalog or Alibaba-style product page.
- High-end visual hierarchy, strong imagery, restrained UI.
- Mobile-first, fast, accessible, and static-first.
- Images should remain local production assets.
- Conversion UI should be professional, not aggressive or cheap.

### Component and Layout Rules

- Keep CSS centralized in `src/styles/global.css` unless there is a strong reason to split.
- Prefer semantic class names already in use.
- Do not introduce large UI libraries.
- Do not add a CMS.
- Do not refactor the project broadly.
- Keep existing forms, popup, WhatsApp, and floating navigation unless the user specifically asks to change them.

## 6. Git and Deployment Workflow

### Git Rules

This project uses a clean Git directory named `.git-clean`. Continue using this workflow:

```powershell
git --git-dir=.git-clean --work-tree=. status
git --git-dir=.git-clean --work-tree=. add <files>
git --git-dir=.git-clean --work-tree=. commit -m "Message"
git --git-dir=.git-clean --work-tree=. push
```

Do not use ordinary `git` commands for project state unless the user explicitly asks.

Important:

- Current `main` has been pushed to GitHub.
- Cloudflare Pages automatically deploys from GitHub `main`.
- Do not push unless the user explicitly asks.
- Before committing, stage only files related to the current task.
- Local source assets may remain untracked; do not delete local design source assets unless explicitly requested.

### Build Rules

- Run `npm.cmd run build` after code changes.
- Do not run build for documentation-only updates unless requested.
- Confirm production routing when page files change.

## 7. Stability Rules and Forbidden Changes

Keep these rules unless the user explicitly reverses them:

- Do not restore Web3Forms.
- Do not restore file upload UI.
- Do not modify Cloudflare secrets or API keys.
- Do not hardcode API keys into source files.
- Do not refactor the project broadly.
- Do not introduce large libraries.
- Do not delete local design source assets.
- Do not use public R2 links in emails if upload work is resumed later.
- Do not re-enable R2 upload without a dedicated upload task and production retest.
- Do not make aggressive competitor claims such as "cheaper than NanaWall."
- Do not claim universal certifications. Use project-dependent wording.

## 8. Known Deferred Work

### R2 Upload Deferred

Direct browser-to-R2 upload remains intentionally deferred.

Current judgment:

- Main inquiry submission and Resend notification flow are working.
- File upload is not a current launch blocker.
- Visitors should email drawings directly to `info@likisystems.com`.
- R2 file upload should not be restored as part of normal advertising tracking tasks.

If upload is resumed later, investigate:

- `/api/uploads/sign`
- AWS SDK v3 presigned PUT URL behavior with Cloudflare R2
- Cloudflare Pages R2 binding
- Browser `PUT` upload to R2
- MIME validation
- R2 CORS

### No Turnstile Yet

There is no Cloudflare Turnstile or anti-spam challenge in v1.

Current controls:

- Submit button disable state.
- Server-side validation.
- Popup anti-annoyance behavior.

Future:

- Consider Turnstile only if spam appears or ad traffic quality requires it.

## 9. Current Priorities and TODO

Priority order:

1. Troubleshoot Email Click conversion until Google Ads detects it successfully.
2. Monitor Google Ads Inquiry Form Submission and WhatsApp Click conversion health.
3. Monitor production inquiry submissions and Resend delivery.
4. Keep GA4 and Google Ads base tracking stable.
5. Add a more complete GA4 custom event system later if useful.

TODO:

- Diagnose why Google Ads still does not detect Email Click conversion.
- Keep Email Click `event_callback` + fallback timeout behavior unless a verified better approach is chosen.
- Continue monitoring Google Ads Inquiry conversion.
- Continue monitoring WhatsApp Click conversion.
- Later improve GA4 custom events.
- Later consider Enhanced Conversions.
- Later consider Cloudflare Turnstile for spam protection.
- Keep R2 file upload deferred; do not resume it as a current task.

## 10. Handoff Summary

Current state:

- Production URL: `https://folding-glass-doors.likisystems.com/`
- Current stage: Production live + Google Ads tracking verification stage.
- The LIKI 140 / 145 page is live at `/`.
- `preview-140-145` has been removed.
- Optimized `.webp` images are in use.
- Favicon is present and referenced from root public paths.
- SEO metadata and production social image URLs have been corrected.
- Inquiry form submissions redirect to `/thank-you/`.
- GA4 is installed with `G-VTK5YEKDW9`.
- Google Ads AW config is installed with `AW-18111406135`.
- Google Ads Inquiry Form Submission conversion is based on `/thank-you/` and has tested effective.
- WhatsApp Click conversion is implemented in `GoogleAnalytics.astro` and has tested effective.
- Email Click conversion is implemented in `GoogleAnalytics.astro`, uses `event_callback` plus a fallback timeout, but Google Ads testing has not succeeded yet.
- GitHub `main` and Cloudflare Pages deployment are synchronized.

GitHub repository:

```text
https://github.com/dinghao88888888-create/liki-125hfd-landing-page.git
```

Notes for future AI continuation:

- Treat the production inquiry flow as working unless new evidence shows otherwise.
- Treat Inquiry Form Submission and WhatsApp Click conversions as implemented and effective.
- Treat Email Click conversion as implemented but not yet Google Ads verified.
- Treat file upload as intentionally disabled and separate from the current launch path.
- Do not re-enable upload UI unless the user explicitly asks to resume R2 upload work.
- Keep using `.git-clean` for all Git operations.
