# PROJECT AUDIT — Existing Repository State

**Date:** 2026-11-20  
**Repo:** `apps/` + `packages/` pnpm monorepo ("Al-Rida", شركة الرضا)  
**Audit status:** COMPLETE — read-only audit. No application code was modified.

> Note: the project exists today with the original purpose: a premium door‑hardware e‑commerce app
> (products, brands, categories, checkout, orders, admin dashboard). The new vision replaces that
> with a premium interactive digital business card + customer engagement platform. Findings below
> describe *today's* state, to be compared against the target in `SYSTEM_ARCHITECTURE.md` and the
> transformation plan in `IMPLEMENTATION_ROADMAP.md`.

---

## 1. Repository Structure

```
El-Reda/
├── apps/web/                       # Next.js 16 App (the only app in the monorepo)
│   ├── app/
│   │   ├── layout.tsx              # root layout: RTL html, font links
│   │   ├── (marketing)/            # public pages: page, about, brands, categories,
│   │   │                           #   checkout, contact, login, offers, products,
│   │   │                           #   projects, register (old e‑commerce "marketing" set)
│   │   ├── (dashboard)/dashboard/  # staff admin panel (settings, marketing, inventory, …)
│   │   ├── api/                    # Route Handlers (auth, products, orders, analytics, …)
│   │   ├── robots.ts, sitemap.ts   # static SEO assets
│   │   └── error/global-error/not-found
│   ├── components/
│   │   ├── auth/, checkout/, contact/, dashboard/, products/, security/
│   │   ├── landing/                # public landing sections (hero, navbar, footer, …)
│   │   └── ui/button.tsx           # one custom button variant (rounded-lg, #0F3B73)
│   ├── config/site.ts              # siteConfig (name, url, locale…)
│   ├── constants/{roles,navigation}.ts
│   ├── lib/                        # auth, db, env, security, seo, activity, audit, logger
│   ├── models/                     # 13 mongoose models (see §4)
│   ├── repositories/               # repository layer per model
│   ├── services/                   # auth, product, order, content services
│   ├── scripts/                    # seed.ts, seed-admin.ts, seed-content.ts
│   └── validators/, types/, store/ (cart redux), hooks/
├── packages/ui/                    # shadcn/ui scaffold (styles + empty components)
├── packages/eslint-config/, packages/typescript-config/
├── docs/                           # ← target planning dir; currently absent
└── turbo.json, pnpm-workspace.yaml, .turbo/, node_modules/
```

Notable: `README.md` at repo root says "Al-Rida" (shadcn/ui monorepo template) — the README is stale
relative to reality; it documents adding shadcn components that were never added to `packages/ui`
(components dir contains only `.gitkeep`).

## 2. Framework & Versions

- **Next.js 16.2.6** (App Router), **React 19.2.4**, **TypeScript** (strict).
  - `AGENTS.md` (root): "This version has breaking changes — APIs, conventions, and file structure
    may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/`."
    Planning-only task → recommend implementation phase reads Next 16 docs for `proxy` (renamed
    from middleware), Server Actions, Image/Font changes, `next-env.d.ts`.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), hardcoded hex colors in the existing
  landing components (`#0F3B73` navy, `#F58220` orange, `#E2E8F0`, `#F8FAFC`, `#1E293B`).
- **UI:** `lucide-react` ^1.24.0 icons, `clsx`, `tailwind-merge`. `packages/ui` holds only global
  styles — components live in `apps/web/components/`.

## 3. Routing Architecture

- `app/(marketing)/*` — public: `/` (old landing w/ e‑commerce sections), `/about`, `/brands`,
  `/categories`, `/offers`, `/projects`, `/contact`, `/login`, `/register`, `/checkout`, `/products`,
  `/products/[slug]`, plus old customer pages (cart/wishlist are unrouted now, see §10).
- `app/(dashboard)/dashboard/*` — staff admin: `settings`, `marketing/*`, `products/*`,
  `orders/*`, `users/*`, `customers`, `inventory/*`, `brands`, `categories`, `contact`, `analytics`,
  `activity`, `reports`, `reviews`, `roles`, `media`, `dashboard` (home).
- `app/api/**` — Route Handlers for auth (login/logout/refresh/session/forgot/reset/verify),
  products/categories/brands/inventory/orders/wishlist/cart/contact/reviews/settings/upload/webhooks/search/dashboard.
- **Server Actions** (files under `actions.ts` with `"use server"`) — the dashboard pattern;
  e.g. `(dashboard)/dashboard/actions.ts` (logoutAction).
- `proxy.ts` — Next 16 naming for middleware (read/write audit confirmed: `proxy.ts` exists with
  `export function proxy(...)`).
- SEO assets: `app/sitemap.ts`, `app/robots.ts`, `app/robots.ts` (×2, same), root `app/favicon.ico`,
  and a Google Search Console verification file `apps/web/public/google465111a5cdd76198.html`.

## 4. Database Models (MongoDB via Mongoose ^9.7.4)

Reusable — keep:

| Model | Notes |
|---|---|
| `User` | email (unique, indexed), name, passwordHash, role (`customer`\|`manager`\|`admin`), avatar |
| `Product`, `Brand`, `Category`, `Order`, `Address`, `Cart`, `Wishlist` | existing e‑commerce stack |
| `Review` | product review w/ rating 1–5, title, comment |
| `Coupon`, `Content` (sections: hero/footer/company/stats/trust — legacy fallbacks in `services/content.service.ts`) | |
| `Activity`, `AuditLog` | dashboard feeds + security audit |

Refactor:

- `Content` — old generic sections (hero/footer/company/…). Landing redesign uses the new models
  below; **Content kept as legacy compatibility + migration path**; consider freezing/archiving it
  later. Its `getBySection` used by old landing components (navLinks static in `lib/landing-data.ts`).

New models to create (§5–§7 of DATABASE_DESIGN.md — full schemas):

| Model (new) | Purpose |
|---|---|
| `Company` — sing­leton settings: name, description, websiteUrl, whatsappNumber, googleMapsReviewUrl, instaPayLink, cashWalletNumber/label/instructions, logoImageUrl, coverImageUrl, phone, email, address{…}, googleMapsUrl, coordinates{lat,lng}, primaryArabicFont |
| `LinkItem` — dynamic landing action/nav/footer links (section, title, description, iconKey, url, internalHref?, enabled, displayOrder) |
| `Testimonial` — new: name, company/role, rating 1–5, comment, avatarUrl?, isPublished, isVerified, sortOrder |
| `BrandSettings` — singleton: primaryArabicFont, preview helpers |
| `BrandSettings.fonts` — cf. BRAND_AND_UI_UX.md §4 |

Existing `Content` doc for `company` (`services/content.service.ts` FALLBACK + Content doc) — replace
with `Company` singleton in plan P3; keep FALLBACK values as seed data.

## 5. API Endpoints (Existing)

Public: `GET /api/search/*`, `/api/search/suggestions`, `/api/search/popular`; marketing/contact POST;
auth GET session/logout/refresh; product listing.
Staff: products/orders/customers/inventory/brands/categories CRUD; analytics (sales/products/customers/inventory/revenue/stats); dashboard stats; reviews/[id]; webhooks (erp, paymob, paytabs); settings; upload/image+document; users (addresses/avatar/me/password).
New endpoints planned (all Server Actions + a few Route Handlers): company CRUD, links CRUD+preview, testimonials CRUD+publish, font config CRUD, address CRUD, public GETs for company/links/testimonials (SSR or API), `wa.me` link builder.

## 6. Authentication & Security (Existing)

- JWT bearer cookie `session` (`httpOnly`, `sameSite=lax`, 7d). `lib/auth/session.ts`.
- Roles: `customer` < `manager` < `admin` (`constants/roles.ts`), `hasRole`.
- Guards: `proxy.ts` route map; `lib/auth/guard.ts` (`requireUser/requireRole/requireSelfOrRole`).
- CSRF double-submit (`lib/security/csrf.ts`) for Server Actions + Route Handlers; `components/security/csrf-token.tsx`.
- In-memory rate limiter (`lib/security/rate-limit.ts`) — login 5/15s, register 5/60s; documented as
  single-instance (see §8 risks).
- Security headers: `next.config.ts` `headers()` + `proxy.ts` — CSP (`script-src 'self' 'unsafe-inline'`),
  XFO DENY, HSTS, Referrer-Policy, Permissions-Policy, nosniff. (CSP may need loosening as fonts
  are added — plan item.)
- Password hashing: bcryptjs v3.0.3, salt 12 (`services/auth.service.ts`) — Argon2id discussed as alternative.
- Audit: `lib/audit.ts` + `repositories/audit-log.repository.ts` + Activity feed.

## 7. Dependencies (apps/web/package.json)

Production: next@16.2.6, react@19.2.4, react-dom@19.2.4, @workspace/ui, mongoose@9.7.4, jsonwebtoken@9.0.3,
bcryptjs@3.0.3, zod@4.4.3, lucide-react@1.24.0, clsx, tailwind-merge.
Dev: typescript, eslint, prettier, tsx, @tailwindcss/postcss.
Notes:
- `lib/env.ts` — validates MONGODB_URI + JWT_SECRET (throws at runtime if missing).
- Fonts currently: Google Fonts preconnect links + `IBM Plex Sans Arabic` + `Inter` via `<link>`.
- Zod v4 already in stack — use it everywhere; **no changes to package.json allowed** (per §12).

## 8. Deployment & CI/CD

- Vercel-style hosting (`next dev/build/start`, `.vercel` gitignored). MongoDB Atlas via `MONGODB_URI`
  in `apps/web/.env.local`; `JWT_SECRET` (currently default `change-me` — logged warning in prod).
- **No CI/CD configs found** (`no .github/`), no tests (`find` for `*.test.*`/`*.spec.*` → none),
  no lint-staged, no prettier CI.
- `turbo.json` — build/typecheck/lint/format pipeline; no caching tests; `pnpm-lock.yaml` immutable (do not touch).

## 9. SEO Implementation (Existing)

- `app/sitemap.ts` (static pages + dynamic products/categories/brands), `app/robots.txt` → `/sitemap.xml`, disallows `/dashboard`, `/api`, `/login`, `/register`, `/checkout`, `/cart`, `/profile`.
- `lib/seo/metadata.ts` helpers (`buildTitle/buildOpenGraph/…`) — **dead code** (not imported anywhere; verified by grep).
- Page metadata objects scattered in old pages (e.g., marketing layout, contact, about) — Arabic titles.
- Google verification file present.
- No LocalBusiness JSON-LD found (grep for LocalBusiness → 0 hits). Existing SEO is mostly "good basics".

## 10. Performance & Accessibility (Existing Observations)

Performance:
- Images from Unsplash (external, cached) via `next/image`; prioritized `priority` on hero image.
- Google Fonts preconnect + two font files.
- Old landing is mostly server-rendered SSR with `force-dynamic`; sitemap `force-dynamic`.
- No Web Vitals reporting, no monitoring.
Risks:
- Unsplash hot-linking depends on third party; new plan: local assets.
- Images not fully optimized (need ImageOptim pass) and no blur placeholders.
- Root layout hardcodes hex colors (tokenization pending in brand system).
Accessibility:
- Root layout `lang="ar" dir="rtl"` + suppressHydrationWarning (good).
- ARIA labels exist in navbar/footer/contact; contrast looks decent (#1E293B on #F8FAFC) but not formally audited.
- New plan: axe-core audits, keyboard nav tests, reduced-motion support.

## 11. Git History (20 commits, recent)

Landing marketing pages added (about/brands/categories/offers/projects), marketing dashboard modules
(coupons/promotions/banners/campaigns/notifications/featured), QR-scanner + category codes, product
image upload via Cloudinary, activity logging, content management system, role management, analytic
enhancements. Root commit deleted outdated docs; final commit: "Delete outdated documentation…" +
"add logout action". Working tree has 24 modified files (uncommitted) — investigate before reuse!

**⚠️ Modified, uncommitted files (dirty state) — audit stoppoints:**
`git status` shows modifications in actions files, proxy.ts, next.config.ts, models/index.ts, etc.
Recommendation: **do not start transformation until those diffs are reviewed** (they change route
protection, CSRF flows, security headers — they are live-code changes that affect the baseline).

## 12. Components Worth Reusing (Landing Design Language)

- `components/ui/button.tsx` — rounded-lg, h-12, semibold, focus-visible rings.
- `components/landing/section.tsx` (Section/SectionTitle) — consistent vertical rhythm.
- `components/landing/navbar.tsx`, `footer.tsx`, `cta.tsx`, `company-numbers.server.tsx` — RTL, Arabic copy.
- `components/contact/contact-form.tsx`, `checkout/checkout-form.tsx`.
- CSS token hex palette (neutral + blue #0F3B73 + amber #F58220).
- `lib/activity.ts`, `lib/audit.ts`, `lib/responses.ts`, `lib/utils.ts` (cn), `lib/logger.ts`.
- Rate-limit/CSRF libs (already see as above).
- Repository pattern (`repositories/*.ts`).

## 13. Components Requiring Refactor or Removal

| Item | Decision |
|---|---|
| Old e‑commerce pages: `products`, `categories/*` (product detail), `checkout*`, `cart`, `wishlist`, `offers`, `projects`, `brands`(marketing), `company-numbers`, `featured-products`, `Brands/WhyUs/Categories` landing sections | **Option A (recommended):** Replace with new QR‑card landing. **Option B:** Keep as secondary site sections. Decision required (see §15 DECISIONS). |
| `app/(marketing)/page.tsx` (old landing) | Redesign as new landing (door animation + actions). |
| `Content` model + `services/content.service.ts` FALLBACKs | Legacy; reuse as seed values, freeze for removal in P3+ |
| `components/landing/testimonials.tsx` + `lib/landing-data.testimonials` | Replace with dynamic `Testimonial` model data (moderated). |
| `components/landing/cta.tsx` | Reuse style as public "contact" CTA variants. |
| `app/(marketing)/login`, `register`, `api/auth/*` | Keep & harden (existing auth). |
| `lib/seo/metadata.ts` | Dead helpers — revive/finish in SEO phase. |
| `repositories/review.repository.ts` + `models/review.ts` | Keep for product reviews (unchanged). |
| Uncommitted dirty files (§11) | Review first — block transformation until settled. |

## 14. Database Migration Notes

- No DB migration tools today (no @grafana-style migration system; mongoose indexes run at runtime).
- Plan: migration script (`apps/web/scripts/migrate-to-reda.ts`) that: (1) creates `Company` singleton
  from old Content "company" + seed defaults; (2) seeds `LinkItem`s for the 5 new actions + footer
  links; (3) creates `Testimonial` docs from old hardcoded testimonials (published+verified);
  (4) seeds `BrandSettings.primaryArabicFont` with the default Arabic font key. No unique index on
  `LinkItem.url` (duplicate detection is a dashboard validation concern, not a DB constraint).
- Safe: old collections remain untouched; new site ignores e‑commerce pages until decision.

## 15. Tech Risks & Security Debt Found

1. **Dirty working tree** (§11) — must be reviewed before any plan executes.
2. **JWT_SECRET default `change-me`** — logged in prod only; plan to fail fast in P5.
3. **In-memory rate limiter** — not multi-instance safe; recommend Redis or DB-backed later.
4. **bcryptjs ^3** — still strong (pbkdf2; fine), plan migration to Argon2id optional.
5. **Unsplash hot-linking** — external dependency; plan local assets.
6. **Dead `lib/seo/metadata.ts`** — finish in SEO phase.
7. **CSP `script-src 'unsafe-inline'`** — plan tightening after fonts migration (dashboard uses shadcn
   inline styles; adjust directives + add dashboard route-specific CSP if needed).
8. **Roles ambiguity**: customer can log into dashboard root today via proxy's AUTHENTICATED_PREFIXES,
   but dashboard layout redirects to /login for non-manager. Plan: unify semantics (see SYSTEM_ARCHITECTURE).
9. **No canonical + hreflang** (SEO gap), **no LocalBusiness JSON-LD** (SEO gap), **no Web Vitals telemetry**.
10. **`Content` legacy duplication** — two sources of truth during transition (seed both, then freeze).
11. **`next.config.ts` vs `proxy.ts` duplication of headers** — dedupe in plan.
12. **Cookie flags**: dashboard login uses `secure: true` only in prod — fine; recommend `domain` isolation
    none (same host), `rotation` on password change — plan item.
13. **Next.js 16 breaking changes** — apply docs from `node_modules/next/dist/docs/`.

## 16. Reusable Content Mapping (Old → New)

| Old landing data | New model/page |
|---|---|
| `lib/landing-data.ts:brands` | static list OK; new footer links → `LinkItem` |
| `categories` (name+href) | static OK; keep old pages as optional route `/categories` |
| `featuredProducts`, `CompanyNumbers` | — remove or keep for e‑commerce path (decision P) |
| `whyUs`, `statistics`, `footerColumns`, `contactInfo` | seed `Company` + optional static "about" copy |
| `testimonials` (hardcoded) | seed `Testimonial` docs (published, verified) |
| hero badge/title/subtitle/CTAs | `Company` fields (name, description, websiteUrl) |
| navLinks (navbar) | static config OR `LinkItem` (recommended: static — nav links are UX chrome, not dynamic content) |

## 17. Baseline Verification (P0 — completed 2026-11-20)

**Status:** Dirty tree REVIEWED (§11 blocker) — coherent hardening. Baseline health after fixes:

- **Git:** HEAD = `c0fe55a` on branch `intg/dashboard/activity`; local `main` (e78a82d) is an ancestor; origin/main ahead. Work branched as `alreda-transform`.
- **Dirty-tree diffs (review):** `proxy.ts` (security headers on all responses, route map: PUBLIC/STAFF/AUTHENTICATED, session id+role, security headers), `next.config.ts` (security headers duplication), `session.ts` (JWT_SECRET production warning), `guard.ts` (+requireSelfOrRole), auth flows (rate-limit+CSRF on login/register), `models/index.ts` (+audit-log), new: `error/global-error/not-found`, `lib/audit.ts`, `lib/auth/redirect.ts`, `lib/errors.ts`, `lib/logger.ts`, `models/audit-log.ts`, `repositories/audit-log.repository.ts`, `packages/ui/tsconfig.json` tweaks, footer/navbar dynamic brand.
- **Baseline typecheck (before fixes):** FAIL — 10 TS errors in dirty tree (sync `headers()`/`cookies()` usage — Next 16 breaks; `RateLimitKey` signature misuse in upload route; `decodeURIComponent(match[1])` possibly-undefined; possible undefined chains in audit/rate-limit/redirect).
- **Baseline typecheck (after fixes):** PASS (2/2 packages).
- **Baseline lint (after quick fixes):** 0 errors, 1 warning (csrf-token setState-in-effect — intentional behavior, to improve in P2).
- **P0 cleanup applied:** async `headers()` in 3 dirty action files; `clientKey` fix in upload route; csrf-token undefined guards; audit/rate-limit optional chaining; removed dead `AUTHENTICATED_PREFIXES`; turbo `LOG_LEVEL` in globalEnv; unused vars in qr-scanner + unused eslint-disable in error pages; `clientIp()` made async (callers awaited).
- **New file (P0):** `apps/web/.env.local.example`.
- **Note:** `pnpm -w build` not run at baseline (expensive; will run in P2/P7).

---
**Next step (after this plan):** Human review of dirty-state diffs (§11, §15.1) — then P0.
**Output artifact:** all planning docs under `docs/project-transformation/`.
