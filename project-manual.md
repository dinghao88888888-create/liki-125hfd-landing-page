# LIKI 125HFD Landing Page - Long-term AI Project Manual

Last updated: 2026-05-17

This document is the long-term working manual for the LIKI 125HFD landing page project. It is intended for future AI assistants, developers, and non-technical collaborators who need to continue the project across multiple chats and deployment stages.

## 1. Project Overview

### Project Name

LIKI 125HFD Landing Page

### Project Goal

Create and maintain a standalone, high-conversion Google Ads landing page for LIKI Systems' 125HFD Series heavy-duty folding glass wall system.

The page should support North American luxury residential, architectural, builder, and commercial inquiry traffic. It must explain the product clearly, build engineering trust, and convert visitors through quote forms, WhatsApp, and project-specific file uploads.

### Current Stage

Deployment and production verification stage.

The Astro landing page is built. Local image assets are present. Floating navigation, WhatsApp CTA, main inquiry form, popup inquiry form, thank-you page, Cloudflare Pages Functions, R2 upload logic, and Resend email logic have been implemented.

Current production testing confirms that the main inquiry form can submit successfully without files. Required-field validation has been fixed, and the backend now correctly recognizes `Full Name`, `Work Email`, and `Project Location` from the submitted payload. Resend email delivery to `info@likisystems.com` has been verified for the main inquiry flow.

The remaining known production issue is file upload failure. Image and `.xlsx` upload tests currently show `Upload failed`, so the next focused task should isolate the R2 upload path.

### Project Positioning

A premium architectural landing page for a custom-built, heavy-duty aluminum folding glass wall system.

LIKI positioning:

- Custom-built around the project opening.
- Architectural-grade aluminum folding glass walls.
- Heavy-duty system for demanding openings.
- Built for North American luxury homes, architects, builders, and high-end commercial projects.
- Engineering support from drawings to delivery.

### Target Users

- Luxury homeowners researching folding glass walls.
- Architects and design studios specifying large openings.
- Builders and contractors looking for project-specific systems.
- Developers and hospitality owners.
- Google Ads visitors comparing alternatives such as NanaWall, LaCantina, and other folding glass wall systems.

### Technical Stack

- Frontend: Astro static site.
- Styling: Plain CSS in `src/styles/global.css`.
- Components: Astro components.
- Backend: Cloudflare Pages Functions only.
- File storage: Cloudflare R2 bucket `liki-upload`.
- Email delivery: Resend API.
- Hosting: Cloudflare Pages.
- Build output: `dist`.
- No CMS, no database, no WordPress, no Bricks Builder, no traditional server.

### Core Design Principles

- Premium North American architectural look.
- No traditional header or footer.
- No generic catalog or Alibaba-style product page.
- High-end visual hierarchy, strong imagery, restrained UI.
- Mobile-first, fast, accessible, and static-first.
- Images must remain local; no hotlinked external images.
- Conversion UI should be professional, not aggressive or cheap.

## 2. Current Architecture

### Frontend

The frontend is an Astro static site.

Primary page:

- `src/pages/index.astro`

Secondary page:

- `src/pages/thank-you.astro`

The site uses reusable Astro components for CTAs, images, navigation, WhatsApp, inquiry forms, popup forms, and upload client logic.

### Backend

There is no traditional backend server.

Cloudflare Pages Functions are used for first-party inquiry infrastructure:

- `POST /api/uploads/sign`
- `POST /api/inquiry`
- `GET /api/download`

These Functions handle upload signing, inquiry email sending, and private download proxying.

### CMS

No CMS is used.

All content is currently managed in:

- `src/pages/index.astro`
- `src/data/sections.js`
- `src/data/site.js`
- Component files

### Hosting

Cloudflare Pages.

Expected Pages settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

Recommended custom domain:

- `125hfd.likisystems.com`

Alternative domains:

- `ads.likisystems.com`
- `folding.likisystems.com`

### CDN

Cloudflare CDN through Cloudflare Pages.

### Database

No database.

R2 stores uploaded files, but it is object storage, not an application database.

### Third-party Services

- Cloudflare Pages
- Cloudflare R2
- Resend
- GitHub

Removed service:

- Web3Forms has been fully removed and should not be reintroduced unless the user explicitly reverses the architecture.

### API

Current first-party API endpoints:

#### `POST /api/uploads/sign`

Purpose:

- Validate upload file metadata.
- Generate random R2 object keys.
- Return presigned R2 `PUT` URLs.

Allowed files:

- `.dwg`
- `.pdf`
- `.zip`
- `.step`
- `.stp`
- `.jpg`
- `.jpeg`
- `.png`
- `.doc`
- `.docx`
- `.xls`
- `.xlsx`

Limits:

- Up to 5 files.
- Max 500MB each.

#### `POST /api/inquiry`

Purpose:

- Receive inquiry JSON.
- Include form fields and uploaded file metadata.
- Send email through Resend to `info@likisystems.com`.
- Generate 30-day private download links through `/api/download`.

#### `GET /api/download`

Purpose:

- Validate signed download token.
- Stream the private R2 object through Cloudflare Pages Function.
- Avoid public R2 file links in email.

### Automation Flow

Current flow:

1. Visitor fills main or popup inquiry form.
2. Browser validates file count, file size, and extension.
3. Browser calls `/api/uploads/sign`.
4. Browser uploads files directly to R2 using presigned `PUT` URLs.
5. Browser calls `/api/inquiry`.
6. Pages Function sends Resend email to LIKI.
7. User sees inline success message with link to `/thank-you/`.
8. Email contains customer details and private download links valid for 30 days.

## 3. Workspace Rules

These rules should guide all future work.

### Development Rules

- Do not rebuild the project from scratch.
- Do not change the Astro stack unless explicitly requested.
- Prefer small, targeted edits over large rewrites.
- Analyze current files before editing.
- Keep existing visual direction stable.
- Keep existing forms, popup, WhatsApp, and floating navigation unless the user specifically asks to change them.
- Do not delete generated images or regenerate them unless explicitly requested.
- Do not introduce large UI libraries.
- Do not add analytics, chat widgets, tracking scripts, or third-party marketing plugins without explicit approval.
- Keep Cloudflare Pages static-first; use Functions only for the inquiry workflow.
- One chat should ideally solve one concrete goal.

### Git Rules

This project has used a clean Git directory named `.git-clean` because the ordinary `.git` state was previously unreliable.

Use this command pattern for Git work:

```powershell
git --git-dir=.git-clean --work-tree=. status
git --git-dir=.git-clean --work-tree=. add <files>
git --git-dir=.git-clean --work-tree=. commit -m "Message"
git --git-dir=.git-clean --work-tree=. push
```

Do not assume normal `git status` uses the correct repository state.

### Stability Rules

- Run `npm.cmd run build` after code changes.
- Confirm no Web3Forms strings return if editing form logic.
- Confirm no external image hotlinks are introduced.
- Do not modify Cloudflare secret values in source files.
- Do not commit API keys.

## 4. Design System

### UI Style

High-end North American architectural landing page.

Style references:

- NanaWall-style category education, but not copied.
- Reynaers, Schüco, Cortizo, premium architectural portfolio sites.

Do not use:

- Alibaba catalog styling.
- Cheap contact forms.
- SaaS dashboard navigation.
- Traditional header/footer.
- Overly aggressive popups.

### Color System

Current palette direction:

- Deep charcoal / near black.
- Warm off-white.
- Stone gray.
- Muted bronze / champagne accent.

The champagne accent is used for active states, CTA emphasis, and subtle premium highlights.

### Font

The project currently uses CSS-level font styling in `src/styles/global.css`.

Future changes should keep typography restrained, premium, and readable. Do not add decorative fonts unless the whole brand system is intentionally updated.

### Spacing

The page uses generous architectural spacing:

- Large section padding on desktop.
- Tighter but readable spacing on mobile.
- Form fields use clear vertical rhythm and large touch targets.

### Container Width

Use the existing CSS container rules in `src/styles/global.css`.

Do not introduce random full-width content blocks unless the section is intentionally immersive, such as hero or image-forward bands.

### Responsive Rules

- Mobile-first behavior matters.
- Floating navigation is hidden on mobile.
- Forms become single-column on mobile.
- Popup must fit inside mobile viewport and allow internal scrolling.
- WhatsApp button remains visible on mobile and desktop.

### CSS Rules

- Keep CSS centralized in `src/styles/global.css` unless a strong reason exists to split.
- Prefer semantic class names already in use.
- Do not add inline styles for normal layout.
- Keep hover/focus states accessible.
- Maintain readable select, option, input, textarea, and file input styles on dark backgrounds.

### Component Rules

Reusable components should remain simple Astro components.

Important components:

- `CTAButton.astro`
- `ImageBlock.astro`
- `FloatingNav.astro`
- `WhatsAppButton.astro`
- `InquiryForm.astro`
- `PopupInquiryForm.astro`
- `InquiryClientScript.astro`

## 5. File & Structure Notes

### Key Directories

```text
src/pages/
src/components/
src/data/
src/styles/
public/images/
functions/
docs/
```

### Key Files

#### `src/pages/index.astro`

Main landing page. It assembles the page sections, forms, floating UI, popup, and client script.

Modify carefully because this is the main conversion page.

#### `src/pages/thank-you.astro`

Post-inquiry thank-you page.

Keep simple and consistent with the landing page.

#### `src/data/site.js`

Central contact configuration.

Current values:

- Email: `info@likisystems.com`
- WhatsApp number: `8615806631151`
- WhatsApp message: project inquiry template

Do not add secrets here.

#### `src/data/sections.js`

Content and image references for major page sections.

Do not change image paths casually.

#### `src/styles/global.css`

Global visual system and component styling.

This is powerful and easy to break; avoid broad edits.

#### `src/components/InquiryClientScript.astro`

Client-side upload and inquiry submission logic.

Important behavior:

- File validation.
- Upload progress.
- Duplicate submit prevention.
- Calls first-party APIs.

Modify carefully and test both main and popup forms.

#### `functions/_lib/config.js`

Server-side upload limits and allowed file validation.

If changing allowed file types, update this file and `InquiryClientScript.astro` together.

#### `functions/_lib/signing.js`

Manual R2 SigV4 upload signing and download token signing.

This file is security-sensitive. Do not edit casually.

#### `functions/api/uploads/sign.js`

Creates R2 upload URLs.

Requires R2 S3 API environment variables.

#### `functions/api/inquiry.js`

Sends Resend inquiry email.

Requires Resend and download token environment variables.

#### `functions/api/download.js`

Streams private R2 files through signed token links.

Requires `UPLOAD_BUCKET` binding and `DOWNLOAD_TOKEN_SECRET`.

### Files Not to Modify Lightly

- `functions/_lib/signing.js`
- `functions/api/download.js`
- `functions/api/uploads/sign.js`
- `public/images/*`
- `package-lock.json`
- generated `dist/*`

### Reusable Components

- Use `CTAButton.astro` for consistent CTA style.
- Use `ImageBlock.astro` for image presentation.
- Use `InquiryForm.astro` for the main quote form.
- Use `PopupInquiryForm.astro` for delayed popup inquiry.
- Use `FloatingNav.astro` for lightweight section navigation.
- Use `WhatsAppButton.astro` for WhatsApp conversion.

## 6. Current Features

### Landing Page

- High-end static Astro landing page.
- No traditional header.
- No traditional footer.
- SEO meta title and description.
- JSON-LD schema.
- Local generated PNG image assets.
- Premium architectural page narrative.
- Sections for overview, open living, features, customization, engineering, delivery, FAQ, and quote.

### Floating Navigation

- Desktop-only lightweight floating section navigation.
- Includes FAQ and Top anchor.
- Hidden on mobile.

### WhatsApp Button

- Floating WhatsApp CTA.
- Uses centralized phone number and message from `src/data/site.js`.

### Main Inquiry Form

- First-party inquiry submission.
- Uploads files to R2.
- Sends email through Resend.
- Inline success and error messages.
- Upload progress UI.
- Multiple files supported.
- Online test without files has succeeded.
- Required-field validation now correctly recognizes `Full Name`, `Work Email`, and `Project Location`.
- Verified Resend email delivery to `info@likisystems.com`.
- Verified inquiry email subject: `LIKI 125HFD Landing Page Inquiry`.
- Verified inquiry email content includes customer name, email, phone, company, project location, project type, interested system, project stage, and message fields.

### Popup Inquiry Form

- Delayed trigger popup.
- Uses localStorage anti-annoyance rules.
- Supports file uploads.
- Uses the same first-party upload and inquiry system.
- Does not use Web3Forms.

### Thank-you Page

- `/thank-you/`
- Simple confirmation page.

### R2 + Resend Inquiry System

- Direct browser-to-R2 upload with progress.
- Private 30-day download links through Cloudflare Function proxy.
- Email includes customer details and file links.
- Web3Forms fully removed.

## 7. Known Issues

### File Upload To R2 Still Fails

The main inquiry flow is now working in production, but file upload is still failing.

Confirmed upload symptoms:

- Image upload tests show `Upload failed`.
- `.xlsx` upload tests show `Upload failed`.
- This issue is intentionally deferred for a separate upload-focused debugging task.

Current judgment:

- Main inquiry submission and Resend notification flow are working.
- The remaining failure is concentrated in the upload chain:
  - `/api/uploads/sign`
  - Cloudflare Pages R2 binding
  - Browser `PUT` upload to R2
  - MIME validation
  - R2 CORS

### Deployment Configuration Partially Verified

Cloudflare Pages deployment is online, and the main inquiry email flow has been verified. R2 upload variables, R2 binding, and R2 CORS still need focused verification before file uploads can be considered production-ready.

Required environment variables:

```text
RESEND_API_KEY
INQUIRY_FROM_EMAIL
INQUIRY_TO_EMAIL
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
DOWNLOAD_TOKEN_SECRET
```

Required R2 binding:

```text
UPLOAD_BUCKET -> liki-upload
```

### R2 CORS Still Needs Production Confirmation

R2 CORS must allow browser `PUT` uploads from:

- Cloudflare Pages preview domain
- Production custom domain

TODO: Confirm exact final Pages URL and custom domain, then set CORS.

### Local Testing Limitation

Local form upload tests may fail with missing environment variable errors unless Cloudflare-like environment variables and bindings are provided.

### Browser Upload Error Messaging

The current error messages are detailed enough for testing, but production UX may later need friendlier versions.

### No Turnstile Yet

There is no Cloudflare Turnstile or anti-spam challenge in v1.

Current abuse controls:

- File count limit.
- File size limit.
- File extension validation.
- Random R2 object keys.
- Submit button disable state.
- Server-side validation.

TODO: Consider Turnstile if spam appears.

### Image Format

The initial requirement preferred WebP, but generated assets are PNG because the available generation/conversion path produced PNG assets. The site references PNG assets.

TODO: Consider converting images to WebP later for better performance.

## 8. Current Priorities

Priority order:

1. Open a new task dedicated to file upload failure.
2. Check `/api/uploads/sign`.
3. Check Cloudflare Pages R2 binding.
4. Check that the bucket binding name matches the code.
5. Check MIME type allowlist and R2 CORS.
6. Retest image upload.
7. Retest `.xlsx` upload.
8. Confirm private download links work after upload succeeds.
9. Bind final custom domain if not already complete.
10. Update this manual after the upload flow is fixed.

## 9. Handoff Section

### Current State Summary

The landing page code is implemented and builds successfully. Web3Forms has been replaced with a Cloudflare R2 + Resend inquiry system.

The main inquiry flow has been verified online:

- The main inquiry form can submit successfully without files.
- Required-field validation has been fixed.
- `Full Name`, `Work Email`, and `Project Location` are correctly recognized by the backend.
- Resend successfully sends inquiry email to `info@likisystems.com`.
- The verified inquiry email subject is `LIKI 125HFD Landing Page Inquiry`.
- The verified inquiry email content includes customer name, email, phone, company, project location, project type, interested system, project stage, and message fields.

Git and deployment state:

- The inquiry validation fix has been pushed to GitHub `main`.
- Cloudflare Pages has automatically deployed the pushed `main` branch.
- Online testing confirms the inquiry email can be received.

Remaining issue:

- File upload to R2 still fails.
- Image and `.xlsx` upload tests currently show `Upload failed`.
- This should be handled in a separate upload-focused debugging task.

The GitHub repository exists:

```text
https://github.com/dinghao88888888-create/liki-125hfd-landing-page.git
```

The latest local workflow uses `.git-clean` for Git commands.

### Recent Modifications

Recent completed work:

- Replaced Web3Forms with first-party Cloudflare Pages Functions.
- Added R2 upload signing.
- Added Resend inquiry email sending.
- Added private signed download proxy.
- Added upload progress and status UI.
- Fixed backend required-field validation compatibility for inquiry payloads.
- Verified online main inquiry form submission without files.
- Verified Resend delivery to `info@likisystems.com`.
- Pushed the validation fix to GitHub `main`.
- Confirmed Cloudflare Pages automatic deployment.
- Extended allowed file types to include Office documents:
  - `.doc`
  - `.docx`
  - `.xls`
  - `.xlsx`
- Confirmed `npm.cmd run build` succeeds.

### Next Step Suggestions

1. Open a new task dedicated to file upload failure.
2. Check `/api/uploads/sign`.
3. Check Cloudflare Pages R2 binding.
4. Check that the bucket binding name matches the code.
5. Check MIME type allowlist.
6. Check R2 CORS for browser `PUT` uploads.
7. Retest image upload and `.xlsx` upload after each likely fix.

### Current Blockers

- File upload to R2 is still failing in production.
- Image and `.xlsx` upload tests show `Upload failed`.
- Main inquiry submission without files is no longer blocked.
- The likely remaining upload investigation areas are:
  - `/api/uploads/sign`
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - Cloudflare Pages R2 binding
  - `UPLOAD_BUCKET` binding name versus code expectations
  - MIME type allowlist
  - R2 CORS for browser `PUT`
- Production custom domain is not yet confirmed in this manual.

### Notes for Future Continuation

- Treat the main inquiry flow as working unless new evidence shows otherwise.
- Treat file upload as a separate unresolved R2 upload-flow issue.
- If uploads show `Missing environment variables`, check Pages environment variables first.
- If `/api/uploads/sign` succeeds but browser upload fails, check R2 CORS and presigned `PUT` behavior.
- If uploads fail after signing, check R2 CORS.
- If uploads work but emails fail, check `RESEND_API_KEY`, verified sender domain, and `INQUIRY_FROM_EMAIL`.
- If email links fail, check `DOWNLOAD_TOKEN_SECRET` and `UPLOAD_BUCKET` binding.

## 10. AI Collaboration Notes

### Current Project Decisions

- Astro is the chosen frontend framework.
- Cloudflare Pages is the hosting platform.
- Cloudflare Pages Functions are used only for inquiry upload/email/download functionality.
- Cloudflare R2 is used for uploaded files.
- Resend is used for sending inquiry emails.
- Web3Forms is removed and should not be used.
- R2 public bucket URL is not used in emails because private 30-day download links are required.

### Confirmed Do Not Modify

Do not modify unless explicitly requested:

- Existing generated images.
- Core page content strategy.
- WhatsApp number.
- Main Web3Forms replacement architecture.
- Popup anti-annoyance behavior.
- Cloudflare Function endpoint names.
- R2 bucket name `liki-upload`.
- Inquiry recipient `info@likisystems.com`.

### User Preferences

- The user prefers direct implementation over abstract planning.
- The user is comfortable with guided deployment steps but is not asking for deeply technical explanations unless needed.
- The user wants practical, production-oriented solutions.
- The user values high-end visual quality and dislikes cheap-looking marketing UI.
- The user wants long-term AI continuity and clear handoff notes.

### Style Preferences

- Premium architectural.
- Understated, professional, conversion-focused.
- Clean English copy for the live page.
- Chinese explanations are acceptable and preferred in collaboration.
- Avoid exaggerated marketing claims.

### Forbidden / Avoid

- Do not reintroduce WordPress.
- Do not use Bricks Builder.
- Do not add a traditional header/footer.
- Do not use Web3Forms.
- Do not hardcode API keys into source files.
- Do not add large frontend libraries.
- Do not add external image hotlinks.
- Do not regenerate images casually.
- Do not make aggressive competitor claims such as "cheaper than NanaWall."
- Do not claim universal certifications. Use "available upon request" or "project-dependent."

### Common Mistakes to Avoid

- Updating only frontend file accept rules but forgetting server validation.
- Updating allowed file types in `functions/_lib/config.js` but forgetting `InquiryClientScript.astro`.
- Forgetting Cloudflare R2 binding `UPLOAD_BUCKET`.
- Using public R2 links instead of private `/api/download` links.
- Pushing with normal Git commands instead of `.git-clean` workflow.
- Assuming local upload tests work without Cloudflare environment variables.
- Editing `functions/_lib/signing.js` without understanding SigV4 and token signing.

### TODO Items

- TODO: Confirm final Cloudflare Pages production URL.
- TODO: Confirm final custom domain.
- TODO: Open a new task dedicated to file upload failure.
- TODO: Check `/api/uploads/sign`.
- TODO: Check Cloudflare Pages R2 binding and `UPLOAD_BUCKET` binding name.
- TODO: Check MIME type allowlist.
- TODO: Confirm R2 CORS settings for browser `PUT` uploads.
- TODO: Retest image and `.xlsx` uploads.
- TODO: Consider image WebP conversion later.
- TODO: Consider Turnstile later if spam appears.
