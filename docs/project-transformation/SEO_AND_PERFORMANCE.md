# SEO & PERFORMANCE — Al-Reda Digital Business Platform

**Date:** 2026-11-20  
**Version:** 1.0  
**Summary:** SEO audit of existing implementation + gap analysis (LocalBusiness JSON-LD missing, no hreflang, no Web Vitals, Unsplash hot-linking, font optimization needed). Plus targets and implementation plans.

---

## 1. SEO — Gaps & Fixes (P6)

### 1.1 Existing Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Metadata (title/desc/og/twitter/canonical) | ✅ Partially (landing layout uses raw objects; profile etc. some) | Custom helper `lib/seo/metadata.ts` DEAD CODE — finish (§3). |
| Sitemap | ✅ `app/sitemap.ts` | Legacy products/categories/brands — update for new routes + removal (§4). |
| Robots.txt | ✅ `app/robots.ts` | Update for new routes + removal. |
| Structured data | ❌ None | Add (§3). |
| LocalBusiness schema | ❌ Missing | Add. |
| Reviews JSON-LD | ❌ Missing | Add (published+verified Testimonials). |
| Arabic metadata | ✅ partially | Ensure `lang="ar"`, Arabic titles/descriptions, OG locale `ar-EG`. |
| RTL | ✅ (`dir="rtl"`) | Keep. |
| Images | ⚠️ Unsplash hot-links | Migrate to local assets (§2.2). |
| Mobile-first | ✅ (Tailwind w/ responsiveness) | Verify (§4.8). |
| Canonical | ✅ partially | Verify home `/` canonical `https://alreda.../`. |
|OG/image cards | ✅ legacy og | Improve (§3). |
| URLs | ⚠️ Polish | `/categories/cylinders` etc. — decide legacy pages (§12). |

### 1.2 SEO Improvements (New — completes P6)

1. **Robots.txt** — update (allow `/`, `/login`, `/register`, `/fonts`, `/api/company`, `/api/links`, `/api/testimonials`). Disallow `/dashboard`, `/api` (other), `/products`, `/checkout`, `/cart`, `/wishlist`, `/api/users`, etc.
2. **Sitemap** — update to landing, `/contact`, `/login`, `/register`, `/fonts`, + legacy products/categories/brands routes if kept (if removed, drop from sitemap). Update `lastModified`.
3. **Metadata** — finalize per page:
   - `/` — Arabic title + description; og; twitter; local business.
   - `/contact` — form + "تواصل معنا" meta.
   - `/login` — SEO: noindex? (probably — not critical; audit recommends disallow login from robots).
   - `/fonts` — noindex (dev tool) — decision (§12).
4. **Structured data (JSON-LD)** — new `lib/seo/structured-data.ts` (§3):
   - `LocalBusiness` (Al-Reda: name, telephone, address, url, geoLocation, openingHours?) — **priority item**.
   - `Organization` (Logo, Email, Url, founder? no) — extends LocalBusiness.
   - `WebSite` (with `sitemap`) — add `WebApplication`? no (it's not an app).
   - `WebPage` (home).
   - `Review` for each published+verified Testimonial (person: name, rating, review, datePublished).
   - `AggregateRating` — optional: avg rating on home ("rating": {average: 4.9, count: 12}) — conservative compute server-side.
5. **OG image** — unify: `og-card.png` at 1200×630 (per Google best practice), plus variant sizes (`1200x630`, `800x600`) — generate during P1:
   - Branded, Arabic-first PNG (logo + tagline + hero) at 1200×630.
6. **Semantic HTML audit** — refine `<main>`, `<article>` for testimonials, `<time>` elements, headings sequence, `alt` on all images.
7. **Client Hints JSON** — for `/api/company`, `/api/links`, `/api/testimonials` — content-negotiation optional (already JSON).
8. **URL Optimization** — WP: keep `/contact`; legacy: migrate `/offers` → `/contact`? — decision point (§12).

### 1.3 SEO & Accessibility (P6 + P7)

| Aspect | Plan |
|---|---|
| Mobile-first | Keep Tailwind classes mobile-first (`sm:`-based); test with Chrome DevTools Device Mode (iPhone SE, iPad). |
| Responsive | ✅ existing (2xl desktop). |
| LCP (landing) | ✅ via door animation (door = pure CSS transforms, not LCP). |
| CLS | Door overlays absolute — no CLS. Footer/sections use `mb-*` — set explicit heights. Test via web.dev/measure. |
| INP | ✅ (no JS except door + micro-anims on interaction). |
| Google indexing | `robots.txt` correct; verify via Google Search Console. |
| Arabic SEO | Arabic titles (extensive RTL), Arabic-first URLs. (EN versions — decision point (§12).) |

---

## 2. Performance — Architecture & Targets

### 2.1 Targets (TTFB, LCP, CLS, INP)

| Metric | Target | Tool |
|---|---|---|
| LCP (landing) | < 2.5s | web.dev, Lighthouse (manual — no Chrome in env; `npx lighthouse` locally) |
| CLS | < 0.1 | web.dev, Lighthouse |
| INP | < 200ms | web.dev, Lighthouse |
| TTFB (QR card) | < 400ms | Lighthouse |
| Transfer size (cold) | < 150KB | DevTools |
| JS payload (landing) | < 60KB gzipped | DevTools |
| First Contentful Paint | < 1.0s | Lighthouse |

### 2.2 Architecture Plan

| Area | Status (today) | Plan |
|---|---|---|
| Framework | Next.js SSR (`force-dynamic` on landing) | Use **ISR + cache revalidation** (`revalidate = 60` for landing; static for most pages; ISR: `cacheTag`/`updateTag` on reads via API route actions). |
| Server Components | Default | Keep; landing SSR (a few db queries, ~2) |
| Client JS | Loading (door component + micro-anims + clipboard) | Minimal; lazy-load heavy stuff (micro-anims, fonts preview). |
| Images | Unsplash hot-links (external) | Migrate to **local optimized assets** in `public/images/` (WebP, ~60-80KB each). Also optimize alt text + sizes. |
| Fonts | Google Fonts via `next/font/google` | Replace with `next/font/google` (Cairo, Readex Pro, Inter, JetBrains Mono) — CLS-safe by default. |
| Font weights | Full set loaded (Cairo: 400,500,600,700,800) | Only load **used weights** on landing (Cairo 400/500/700; Readex Pro 400/500/700). |
| Cache Headers | Next.js defaults | Add `Cache-Control` (ISR-based) via headers; allow CDN. |
| Static assets (brand/icons) | Public, served from Vercel | Minify SVG; `public/brand/`, `public/icons/`, `public/images/` — assets. |
| Images optimization | next/image | Keep; optimize legacy product images (compress). |
| Build output | `next build` (Turbopack — existing) | Verify build output in CI (P7). |
| Database queries | 3-4 on landing (company, links, testimonials, BrandSettings) | OK — tiny; but add caching via `unstable_cache`? (optional). |
| Network | — | CDN-edge serving of `/`, `sitemap.xml`, `robots.txt`. |

### 2.3 Images (for legacy media + hero)

- Hero background: local asset (`public/images/hero-*.webp` or via next/image w/ External-URL allowlist).
- Optimize size: 1200×800 max, WebP, < 80KB; add blur placeholder (optional — P7 quality pass).
- Door-open flat illustration SVG (`public/images/door-open.svg`) — replace Unsplash hero for speed + SEO (removes external dependency + improves LCP).

### 2.4 Fonts (next/font)

- Plan:
  ```ts
  import { Cairo, ReadexPro, Inter, JetBrainsMono } from "next/font/google";

  export const ArPrimary = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-arabic",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
    fallback: ["system-ui", "sans-serif"],
  });
  ```
- Cairo is static — fine. `sizeAdjust`-based fallbacks avoid CLS (§3).

---

## 3. Structured Data (JSON-LD) Implementation

### 3.1 `lib/seo/structured-data.ts` — builders (new, plan)

- `LocalBusinessJsonLd({ company })` — `organizationName`, `description`, `address`, `geoLocation`, `telephone`, `url`, `openingHours` (future), `sameAs` (socials — links from company? — add socialLinks field? — optional, skip for v1).
- `WebSiteJsonLd({ company })` — `url`, `logo`, `name`.
- `ReviewJsonLd(testimonial)` — `name`, `description` (comment), `ratingValue`, `reviewDate`? (createdAt — use ISO or date), `additionalType: ["ReservationRequest"]`? — no. (`@id` optional).

### 3.2 Placement (Landing page)

- `<LocalBusinessJsonLd />` + `<WebSiteJsonLd />` + `<OrganizationJsonLd />` in MarketingLayout head (SSR, invisible, just JSON).
- `<ReviewJsonLd />` per published+verified Testimonial in Home (home page).
- `AggregateRatingJsonLd` in Home (avg over 5-scale).

### 3.3 Testing

- `https://search.google.com/test/richresults` (Google Rich Results Tool) — iterate.
- Schema validator (Google Structured Data Testing).

---

## 4. Performance Testing & Measurement (P7)

### 4.1 Test Matrix

| Metric | Target | Target Tool |
|---|---|---|
| LCP | < 2.5s | web.dev, Lighthouse, GTmetrix |
| CLS | < 0.1 | web.dev, Lighthouse |
| INP | < 200ms | web.dev (Interaction to Next Paint) |
| TTFB | < 400ms | web.dev |
| FCP | < 1.0s | Lighthouse |
| Bundled JS | < 60KB gz | DevTools |
| Mobile | ≥ 90% Lighthouse | Chrome DevTools (simulated iPhone SE) |
| Web Standard | 200s responses only, no 500s | Chrome DevTools (network) |
| CSP compliance | no console violations | DevTools |

### 4.2 CI / Local Validation

- Lighthouse in CI (automatic on push? — GitHub Actions? — no CI today — plan: add lightweight GH Actions? — decision point — keep minimal: add lint + build + typecheck in CI; optional Lighthouse manual).
- Web Vitals script: optional — add `lib/analytics.ts` + `lib/telemetry.ts` (reporting to `/api/analytics/web-vitals` or GA4) — plan for P7 (optional, off by default — ADR-6).

### 4.3 Optimization Levers (Priority)

1. Migrate legacy images to local optimized (P6).
2. Switch fonts to `next/font/google` (P6).
3. Adddoor animation (P2) — measure LCP not impacted.
4. ISR for `/` (P3).
5. Compress JS bundles (analyze: dynamic import heavy components — e.g., fonts preview, walk-through).
6. Enable `next/dynamic` for non-critical sections on landing (micro-animations loading).

---

## 5. Mobile Usability (§6 "Mobile Usability")

- [ ] Viewport `meta` — present (Next.js) ✓.
- [ ] Touch targets ≥ 44×44 — verify hero buttons, action tiles, testimonials.
- [ ] Mobile stackable: sections → 1 column (Tailwind responsive).
- [ ] Horizontal scrolling: none — `overflow-x: hidden` on body; overflow checks.
- [ ] Font sizes: min 16px body — review mobile.

---

## 6. Legacy Page URLs (Decision Point, Formal — see DECISIONS)

**Formal options for legacy `/about`, `/brands`, `/categories`, `/offers`, `/projects`, `/products`, `/products/[slug]`, `/checkout`, `/cart`, `/wishlist`:**

- **Option A (recommended):** Remove pages; update robots.txt + sitemap; legacy users are redirected from deep links via DNS/404 (optional server redirect from old paths to `/` or new equivalents — decision).
- **Option B:** Keep legacy paths as-is (e-commerce preserved); new landing is additive. (But vision shift — decision point, informal only — see DECISIONS for formal answer.)

---

## 7. Web Vitals Telemetry (Optional — ADR-6)

- Library: built-in `web-vitals` script or `next/web-vitals` — plan in P7 as opt-in:
  - `lib/telemetry.ts` — browser script: `getCLS`, `getLCP`, `getFCP`, `getTTFB`, `getINP`, `report` → `/api/analytics/web-vitals`.
  - Guarded by `NEXT_PUBLIC_TELEMETRY_ENABLED` (default false).
  - Optional: GA4 pageviews.

---

## 8. Docs & Tools References (Fast Links)

- Lighthouse: `https://developer.chrome.com/docs/lighthouse/overview/`
- Google Structured Data Testing: `https://search.google.com/structured-data/testing-tool`
- Google Search Console: `https://search.google.com/search-console`
- PageSpeed Insights: `https://pagespeed.web.dev`
- SEO checklist:
  - meta/title/desc ✔
  - OG/Twitter ✔
  - Canonical ✔
  - LocalBusiness ✔ (plan)
  - Robots/sitemap ✔ (update)
  - Mobile indexing ✔
  - HTTPS + HSTS ✔ (HTTPS on Vercel default; decisions, see DECISIONS_AND_ASSUMPTIONS.md A4)

---

**End of SEO_AND_PERFORMANCE.md**
