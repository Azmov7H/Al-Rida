# PRODUCT REQUIREMENTS — Al-Reda Digital Business Platform

**Date:** 2026-11-20  
**Version:** 1.0 (planning baseline — target product spec for the Al-Reda transformation)

Derived from the transformation brief:
> "a premium interactive digital business card and customer engagement platform for Al-Reda
> (الرضا) — door handles (أوكر الأبواب), door locks (الأقفال), door cylinders/lock cores (الكوالين)."

> **Confidentiality note:** This platform intentionally names the company **Al-Reda (الرضا)**. No
> model, provider, maker, or underlying-AI identity is documented anywhere in these plans.

---

## 0. Product Identity (One-liner)

**Al-Reda (الرضا)** — interactive digital business card for the premium door‑hardware brand
(handles, locks, cylinders), serving both the QR/desktop audience and a managed admin dashboard
for Google Maps reviews, InstaPay, cash‑wallet, WhatsApp, and website links.

---

## 1. Definitions & Assumptions (canonical use, see DECISIONS_AND_ASSUMPTIONS.md for conflicts)

- **QR destination:** `https://` public URL of the landing/index route (e.g., `https://alreda.example/` or `/:root`). Landing serves `/`.
- **Landing page:** the only customer-facing public page of the platform (`/`).
- **Company (singleton):** the `Company` DB document — all public business info.
- **LinkItem:** dynamic landing action/nav/footer item stored in MongoDB.
- **Testimonial:** internal, moderated customer quote; distinct from Google Maps reviews.
- **Dashboard:** staff management UI at `/dashboard*` (manager+).
- **Admin:** synonym for manager/admin per `constants/roles.ts`.

---

## 2. Functional Requirements — Public Landing (`/`)

### 2.1 Brand Header (always visible)
- [ ] `Company.name` (Arabic + English allowed, Arabic primary) — Arabic rendered in Arabic primary font.
- [ ] Short professional tagline derived from `Company.description` (auto‑wraps; no horizontal overflow).
- [ ] Optional cover image shown above or beside the header (`Company.coverImageUrl`).
- [ ] CSP‑safe render: server component (SSR/ISR).

### 2.2 Signature Door Opening Animation (Entrance Experience)
- [ ] Page loads → closed door appearance (frame + leaf + hinge detail).
- [ ] Door automatically opens with smooth, realistic rotation (3D perspective transform, CSS).
- [ ] Reveals: brand header + actions area + testimonials + footer ("content").
- [ ] Animation is continuous‑loop free: runs once per page load, guards against re‑play during
  client-side navigation (home URL re-entered).
- [ ] `prefers-reduced-motion: reduce` → animation skipped, direct render (content immediately visible).
- [ ] Mobile + desktop responsive (no horizontal scroll; door centered; clamp widths).
- [ ] No layout shift: page layout fully laid out behind the door (door overlay absolute;
  main content `visibility:hidden` until open — visibility toggles without layout shift).
- [ ] Accessible: `aria-hidden` on the door wrapper; focus target is the first action.
- [ ] Performance: animation uses only `transform`/`opacity`/`visibility` (no layout properties).
      Gate: door must not delay LCP of content.
- [ ] No blocking: content usable if animations fail (no race where door never opens).
- [ ] Fallback low‑perf: same "instant open" path on reduced motion.

### 2.3 Micro‑Animations (Product‑Inspired, Selective)
- [ ] Door handle (أوكر): subtle rotation on hover/tap (CSS, ≤180ms, ease‑out) — on any handle in the page.
- [ ] Lock (القفال): hover → shrink/shift body with light press effect; tap → brief lock/unlock pulse.
- [ ] Cylinder (الكوالين): mechanical‑like gentle slow "key turn" rotation (hover‑triggered only).
- [ ] Security elements: hover → subtle glow/scale on security tiles; focus → outline ring.
- [ ] Global rules: no autoplay loops other than door entrance; under reduced motion → no motion.

### 2.4 Main Action Cards (5 dynamic links from LinkItems)
- [ ] **Google Maps Reviews** — external link (`Company.googleMapsReviewUrl`) with CTA (e.g., "قيّمنا على خرائط جوجل"), icon `badge-check` style, opens new tab `rel="noopener noreferrer"`, reviews site-level link. (No Maps API — see ADR notes.)
- [ ] **InstaPay** — external payment link (`Company.instaPayLink`), icon (bank/card), CTA ("الدفع عبر InstaPay").
- [ ] **Cash Wallet** — wallet details from `Company.cashWalletNumber` + `cashWalletLabel`; CTA ("شراء بالمحفظة"), copy‑to‑clipboard for the number (client component), validated E.164‑style.
- [ ] **WhatsApp** — `Company.whatsappNumber` (configurable, stored E.164) + `Company.whatsappPreMessage` (optional); link `https://wa.me/<number>?text=<urlencoded>`; CTA "راسلنا على واتساب".
- [ ] **Official Website** — `Company.websiteUrl`; CTA "موقع الشركة".
- [ ] All actions: recognizable Lucide icons, clear Arabic labels (English labels if set in LinkItem.title en?), subtle hover+tap feedback, focus rings, `aria-label`s, keyboard‑operable buttons/links, semantic `<a>` tags.

### 2.5 Customer Testimonials Section
- [ ] Displays from `Testimonial` collection (published, sorted): name, rating (1–5, stars), comment,
      optional avatar image, optional date/role.
- [ ] Contrast to Google Maps: separate card style + label ("آراء عملاءنا" vs external Maps block).
- [ ] Google Maps reviews are always external links — NOT duplicated as internal testimonials.

### 2.6 SEO & Social
- [ ] Document metadata: unique Arabic title + description per page (marketing layout).
- [ ] OG: `og:title/description/type/locale(ar-EG)/site_name`, image.
- [ ] Twitter: card, title, description, image.
- [ ] Canonical URL per page.
- [ ] LocalBusiness structured data (LocalBusiness, Organization, WebSite, WebPage) — JSON‑LD.
- [ ] Review structured data for published Testimonials (Schema.org Review w/ rating, aggregate).
- [ ] `<html lang="ar" dir="rtl">`; `viewport` meta; charset.
- [ ] Sitemap: public routes (landing, contact, fonts page if any, etc.) + dynamic docs.
- [ ] robots.txt: allow public, disallow new dashboard/auth paths; link to sitemap.

---

## 3. Functional Requirements — Admin Dashboard (`/dashboard*`)

Access:
- [ ] JWT cookie session; `hasRole(role,'manager')` enforced (layout + API guards).
- [ ] Role: admin/manager only. (Login as before.)
- [ ] 401/403 on unauthenticated/unauthorized API calls.

### 3.1 Company Information
- [ ] Edit: `name`, `description`, `logo` (upload via existing Cloudinary upload route), `coverImage`.
- [ ] Edit: `phone`, `whatsappNumber`, `whatsappPreMessage`, `email`, `address` (street/city/governorate/country).
- [ ] Edit: `googleMapsUrl`, `googleMapsReviewUrl`, `instaPayLink`, `cashWalletNumber/label/instructions`, `websiteUrl`, `currency`.
- [ ] Single save action per page (form → Server Action), Zod validation, server revalidation (30s short cache) + redirect with toast.
- [ ] All URLs validated: `https://` scheme only (http allowed only for localhost dev), `new URL()` parse, no userinfo/password, reasonable length.
- [ ] Link to preview public landing page from dashboard header.

### 3.2 Links Management
- [ ] Add/edit/delete LinkItems: title, description, URL, iconKey (curated), section (main_actions | footer), internalHref?, enabled, displayOrder.
- [ ] Enable/disable toggle.
- [ ] Ordering via drag or reorder inputs (plan: reorder UI with ArrowUp/Down or drag via sorting; pick reorder + duplicate protection on edit).
- [ ] Preview before publish: dashboard preview modal rendering cards (client mirror of public cards).
- [ ] URL validation per §3.1.
- [ ] Duplicate URL/iconKey detection warnings (client + server validation: unique slug per section).
- [ ] Audit log entry per action (add/edit/delete/reorder) via `lib/audit.ts`.

### 3.3 Typography Management
- [ ] Curated Arabic font list (dropdown) — see BRAND_AND_UI_UX.md §4 (e.g., Cairo 400/500/600/700/800 + Readex Pro for display + body/inter).
- [ ] Preview: live preview (client component, changing CSS variable font-family + big sample).
- [ ] Apply → save `Company.primaryArabicFont` (server) + set `:root { --font-arabic: 'Cairo', sans-serif }` via inline style on root? (Better: dynamic class on `html` via `useEffect` on dashboard fonts page — zero CLS acceptable.)
- [ ] Default font on first run: `cairo` (or first list item).
- [ ] Optimization: fonts via `next/font/local` subsets (Arabic + digits); CJK not needed.
- [ ] No layout shift: switching via `font-variation-settings`? — use full metrics via next/font sizeAdjust at build; apply on next load (warn dashboard about FOUT; document).
- [ ] FontPreview includes Arabic + English sample text.

### 3.4 Testimonials Management
- [ ] Add: name, company, rating 1–5 (number input w/ stars preview), comment (textarea, max 500 chars), avatarUrl, isPublished default false, isVerified flag default false.
- [ ] Edit: same fields; validation: rating integer 1–5; comment trimmed, non-empty (Zod server); XSS prevention: React escaping everywhere; NO dangerouslySetInnerHTML; server-sanitize with DOMPurify optional — document; prohibit `javascript:` in avatar URL? (no http(s) only).
- [ ] Publish/Unpublish toggle.
- [ ] Delete (soft delete — set published=false, keep?; decision: hard delete w/ modal confirm + count preview).
- [ ] Moderation: "verified" flag required to display publicly (`isPublished && isVerified`); dashboard shows unverified items flagged for admin review.
- [ ] Google Maps reviews distinguished: never edit/move; link lives in Company.googleMapsReviewUrl; dashboard shows it as an info card (read-only, CTA opens preview) — "Google Maps is managed externally; internal testimonials are moderated here".
- [ ] Audit per testimonial action.

### 3.5 Address & Business Location
- [ ] Edit structured address (street, city, governorate, country, postal code, phone).
- [ ] Edit `googleMapsUrl` (share link) + optional `lat/lng` inputs (number).
- [ ] Update → SSR revalidate.

### 3.6 Email "Verification" gap
- [ ] Plan: optional mock; existing API routes for email auth exist but unused? — audit: register action doesn't send verification (model field `isVerified` unused by design decision). Note: plan accepts current behavior; add optional flag.

---

## 4. Functional Requirements — Authentication & Security (see SECURITY_PLAN.md)

- [ ] All admin-only APIs guarded server-side (requireRole/requireUser + CSRF + Zod).
- [ ] Login form (Arabic), email+password, rate limiting, CSRF.
- [ ] `JWT_SECRET` required (fail hard in production, not just warn).
- [ ] Lockout: 5 failed logins → account lockout 30m? (plan: lockout via failedAttempts + lockoutUntil; audit event).
- [ ] Logout (cookie delete) + invalidation on password change (rotate passwordChangedAt in token; verify against User).
- [ ] CSRF double-submit (existing pattern retained).
- [ ] XSS: React escaping + Zod; CSP tightening (`script-src` reduce `'unsafe-inline'`? — verify dashboard needs; plan in security).
- [ ] Security headers (existing set; audit each).
- [ ] Rate limiting: login (5/15s), register (5/60s), general API (100/min default), brute force.
- [ ] Audit logging: extended coverage — company edits, links edits, testimonial actions (new events in dashboard actions), security events (failed login, rate-limited, forbidden).
- [ ] Database security: index key fields; no secrets in code.
- [ ] URL validation (Zod `.url()` + https-only for external links).
- [ ] `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(self)` kept.
- [ ] SSRF hardening for upload/Cloudinary routes (existing — review).

---

## 5. SEO & Performance Requirements

- [ ] LCP (landing hero image): < 2.5s. Door animation non-blocking.
- [ ] CLS: < 0.1. Door overlay absolute; no content movement; next/font sizeAdjust.
- [ ] INP: < 200ms. Passive scroll listeners; event delegation; transitions on user interaction.
- [ ] FCP/TTFB: HTML SSR; CDN static; ISR/revalidate: landing page `revalidate: 60` w/ dynamic Company data; static assets `Cache-Control: immutable`.
- [ ] Images: local assets where possible (OpenSea style photos replaced by directional brand shots); WebP; `next/image`; product/brand images via Cloudinary; blur placeholders.
- [ ] Fonts: `next/font/local` WOFF2 subsets; `font-display: swap` + sizeAdjust; Arabic font w/ metrics match.
- [ ] Minimal JS: landing SSR; lazy-load WhatsApp validation logic & micro-interactions (dynamic import).
- [ ] No unnecessary deps: (no new runtime deps in plan? — optional `@vercel/og` for OG? → plan static OG image instead; optional `next-themes` removed — theme-provider is a no-op today; decision point.)
- [ ] Structured data: LocalBusiness/Organization/WebSite/Review/AggregateRating.
- [ ] Google indexing: sitemap, robots, canonical, hreflang if EN added (plan: Arabic-first, optional EN mirror `/en/*` — decision point).

---

## 6. Performance Budgets (Defaults)

| Metric | Target | Tool |
|---|---|---|
| LCP | < 2.5s (landing hero) | web-vitals, Lighthouse |
| CLS | < 0.1 | web-vitals |
| INP | < 200ms | web-vitals |
| TTFB | < 400ms (QR card) | Lighthouse |
| Transfer size (landing, cached) | < 150KB | Chrome DevTools |
| JS payload (landing, cold) | < 60KB gz | webpack/vite analysis |
| Door open duration | 0.6–0.9s total | design spec |

---

## 7. Accessibility Requirements

- [ ] Keyboard navigation: tab order = door (aria-hidden) then actions/footer; visible focus indicators.
- [ ] Contrast: ≥ 4.5:1 (AA) for text; ≥ 3:1 for large text; brand palette checked (run axe-core).
- [ ] Reduced motion: full support (all animation gates).
- [ ] ARIA: `aria-label` on all icon-only buttons/links, `role="link"` implicit via `<a>`, `aria-busy` during async actions, `aria-live` announcements on published status.
- [ ] Screen reader: door animation `aria-hidden` (non-essential), content readable linearly, headings sequence (h1 → h2 → h3), unique page titles.
- [ ] Semantic HTML: `<main>`, `<section>`, `<article>` for testimonials, `<time>` for dates, `lang`/`dir` attributes.

---

## 8. Security Requirements (matrix with SECURITY_PLAN.md)

| Area | Current | Plan (Target) |
|---|---|---|
| Auth | JWT httpOnly, bcryptjs 12 | bcryptjs (or switch to Argon2id), sessions rotation, lockout on 5 failures, refresh optional |
| CSRF | double-submit (API + Actions) | retain; add cookie `sameSite=lax`; rotate token on login |
| Headers | CSP/XFO/HSTS/etc. in 2 places | dedupe to `next.config.ts` + dashboard-specific CSP |
| Rate limit | in-memory 5/15s login | DB/Redis-backed shared limiter (recommended) |
| Audit | lib/audit + Activity | extend: company/links/testimonials actions audited |
| URL validation | — | Zod `.url()` + https-only for links, instaPay, whatsapp, website, maps |
| Env security | lib/env.ts `required()` | add `JWT_SECRET` hard-fail in production; optional `NODE_ENV` warnings |
| Secrets | — | none hardcoded (document grep checks; `.env*` gitignored) |
| Logout | destroySession | also invalidate session JTI in DB/cache (plan item) |
| Password change | /api/users/password | guard + confirm; invalidate sessions (plan item) |
| XSS | React escape | no `dangerouslySetInnerHTML` anywhere; add CSP script-src tightening; all DB strings via `String` type; size limits via Zod |
| API auth | guards everywhere | add `REQUIRED` default; 401/403 standardized via `lib/responses.ts` |
| Deploy | Vercel | HSTS/TLS, no robot for dashboard, noindex on auth pages (add robots rule) |
| Testing | none | security checklist with sqlmap/nmap-lite, CVE audit |

---

## 9. Risk Acceptance Criteria (P5 gate)

- [ ] Rate limiter: shared store (Mongo) if multi-instance; DB fallback if store unavailable.
- [ ] JWT invalidation strategy: jti denylist on logout/password change (`Sessions` collection or Cache-Aside).
- [ ] Security headers: reviewed & accepted after P6 (QA w/ headers tool).
- [ ] New CSP after fonts/micro-animations: tested with headless browser (no console errors).

---

## 10. Definition of Success (Planning Phase)

- [ ] All 10 docs in `docs/project-transformation/` consistent with repository audit (§17 in PROJECT_AUDIT.md).
- [ ] Confirmed requirements distinct from recommendations (§0, §15, §17).
- [ ] Unresolved business questions listed in DECISIONS_AND_ASSUMPTIONS.md.
- [ ] Target architecture (SYSTEM_ARCHITECTURE.md) is real-time-consistent with DB/API schemas (DATABASE_DESIGN.md).
- [ ] Another coding agent can implement milestone-by-milestone without guessing.

**End of PRODUCT_REQUIREMENTS.md**
