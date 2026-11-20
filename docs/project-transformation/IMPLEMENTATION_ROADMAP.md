# IMPLEMENTATION ROADMAP — Al-Reda Digital Business Platform

**Date:** 2026-11-20  
**Version:** 1.0  
**Estimated effort:** ~16–18 person-weeks (1 senior dev) + QA.  
**Baseline:** `P0` MUST be done before P1. `P2` before `P3`. `P3` before `P4`. `P5` after `P4` (hardening after). `P6` after `P1+P2` (needs brand/animation). `P7` last.

---

## 📋 Summary Table

| Milestone | Title | Time | Complexity | Key Deliverables |
|---|---|---|---|---|
| **P0** | Audit & Baseline | 1–2wk | Small | Baseline captured, dirty-tree review (PROJECT_AUDIT.md §17) |
| **P1** | Brand Identity & Design System | 3–4wk | Medium | Palette, typography, icons, brand guidelines, components v0 |
| **P2** | Database & Backend | 3–4wk | Medium | Mongoose models (Company, LinkItem, Testimonial, BrandSettings), repos, services, public APIs, seed script |
| **P3** | Landing Page Transformation | 3–4wk | Large | New landing (brand header, door animation, 5 action cards, testimonials view) |
| **P4** | Admin Dashboard | 3–4wk | Large | Company/links/testimonials/fonts/address/settings management + moderation UI |
| **P5** | Security Hardening | 2–3wk | Medium | Login lockout, argon2 (optional), CSRF + headers, audit extensions, CSP |
| **P6** | SEO & Performance | 2–3wk | Small/Medium | Structured data, sitemap/robots update, fonts, local images, Lighthouse pass |
| **P7** | Testing & Production Readiness | 3–4wk | Medium | QA suite, security testing, deploy runbook, health checks, docs |

**Total:** ~19–24 person-weeks.

---

## 0. Ground Rules for Implementation

- **Read `AGENTS.md` + `node_modules/next/dist/docs/` before implementation of any Next 16 changes** (Readiness baseline — file count tracked).
- **No code for DB changes** (`DATABASE_DESIGN.md` is source of truth — migration scripts approved).
- **Run baseline:** `git stash list`, `git diff HEAD`, `git log` (§ P0/0.3).
- **No new deps** unless explicitly approved (PROJECT_AUDIT.md §15).
- **Every commit:** `feat:`/`fix:`/`refactor:` with scope; push + run `lint`, `typecheck` in CI.
- **PR rules:** Fix review before merge; run Lighthouse + `pnpm audit`; no direct pushes to `main`.
- **Deploy:** gated by P7 — manual approval; smoke test before GO.

---

## 1. P0 — Existing Project Audit (1–2wk)

### 1.1 Objectives
- Baseline solid, identified blockers (§11 audit blockers), verified tree.

### 1.2 Tasks
- [ ] Review dirty-tree diffs (`git diff HEAD` + `git stash list`) — **BLOCKER**: stop if unresolved.
- [ ] Read Next 16 docs (`node_modules/next/dist/docs/`) — understand changes to `proxy` (middleware rename), Server Actions, Image, Font, `unstable_cache`, `searchParams` → `await` migration.
- [ ] Create `docs/project-transformation/` project notes? (README?).
- [ ] Setup dev env: `pnpm install`, `cp .env.example apps/web/.env.example` (plan — for env validation + security doc §8), ensure MongoDB running for dev, connect to test.
- [ ] Run `pnpm -w typecheck` (baseline health record).
- [ ] Run `pnpm -w build`? — careful, long — but do once to get TTFB/robustness baseline (optional).
- [ ] Run `pnpm -w lint` + `pnpm -w format` baseline.

### 1.3 Dependencies
- Baseline: MongoDB running on localhost (dev). Env vars: `MONGODB_URI`, `JWT_SECRET` (+ create `.env.local.example` plan-doc).

### 1.4 Files/Modules affected
- `AGENTS.md` (top), `README.md`? (root), new `.env.local.example`.

### 1.5 Expected Deliverables
- Baseline health report + P0 audit findings doc (add to `PROJECT_AUDIT.md`).

### 1.6 Acceptance Criteria
- No blockers identified. Env vars validate. TypeScript passes baseline. |

### 1.7 Testing Requirements
- `pnpm -w typecheck` + `pnpm -w build` (if feasible).

### 1.8 Risks
- Dirty-tree discovered blockers → delay. Env vars missing → fix via sample env.

---

## 2. P1 — Brand Identity & Design System (3–4wk)

### 2.1 Objectives
- Final visual identity; dark theme of design (colors, typography, icons, motion tokens); reuse of components (no rewrite, additions).

### 2.2 Tasks
- [ ] `apps/web/public/brand/` — create logos/icons/favicons (SVG + 16× PNG + apple-touch).
- [ ] Colors: CSS variables from `BRAND_AND_UI_UX.md §1.3` — use `apps/web/app/styles/`? — plan: extend `styles/globals.css` (or Tailwind 4 via `@theme` token config — DECIDE §4 A3) — **color tokens via Tailwind 4 `@theme` + `CSS variables` in `globals.css`** — decision point (formal A3 in DECISIONS).
- [ ] Fonts: create `apps/web/fonts/`? — Plan: `next/font/google` only (no local, per SEO doc §2.4). (`.env.example`: font vars?)
- [ ] `components/landing/` — update existing components to new styles (Button, CTA, cards) — **only refinements; preserve functional behavior** (except legacy sections marked for removal — Section 3).
- [ ] New: `components/ui/` — create atomic primitives per design system (if reused across app) — minimal, from audit: `Button` (same + refinements), `Card`, `Badge`, `IconTile`, `StatCard`, `Input`, `FormField` — new `components/ui/*` — reuse everywhere.
- [ ] `components/icons/` — new custom icons (DoorFrame, KeySlot, HandleHinge, CylinderGears, DoorOpenSVG) — design.
- [ ] `components/landing/section.tsx` — kept (vertical rhythm system).
- [ ] Write `docs/project-transformation/BRAND_AND_UI_UX.md` — final § (design system summary).
- [ ] Storybook-style guide `app/(marketing)/__guide/__layout.tsx`? — optional — DEFER.

### 2.3 Dependencies
- P0 (baseline green, team aligned).
- Brand decisions (DECISIONS A1–A4; resolved by end of P1).
- Design freeze (stakeholder review of color/typography — plan-driven, speed by user).

### 2.4 Files/Modules affected
- `app/styles/globals.css` or Tailwind `@theme` (new), `components/ui/*` (new/updated), `components/landing/*` (updated), `components/icons/*` (new), `components/auth/login-form.tsx` (update), `components/contact/contact-form.tsx` (update), `app/layout.tsx` (font swap + html attrs), `public/brand/*`.

### 2.5 Expected Deliverables
- 🎨 Production CSS variables + Tailwind tokens + fonts + Logo assets.
- Atomic UI component set (Button/Card/IconTile etc.).

### 2.6 Acceptance Criteria
- Palette used consistently across all landing pages.
- Arabic display + UI both look right.
- Palette + colors consistent on landing; brand marks (logo, icon) consistent; dark mode support planned via themes.
- New components do not break existing flows.

### 2.7 Testing Requirements
- Visual regression: desktop/tablet/phone (Chrome DevTools emulation).
- Contrast ratios: check with Lighthouse (a11y audit on landing pages, P2).
- A11y: basic axe-core scan of the new landing. |

### 2.8 Risks
- Stakeholder disagreement → default on colors (current hex, NAVY #0F3B73 + AMBER #F58220) — **documented as Plan B**.
- Design systems overuse — keep it lean; stick to tokens.

---

## 3. P2 — Database & Backend (3–4wk)

### 3.1 Objectives
- Mongoose models (Company singleton, LinkItem, Testimonial, BrandSettings), repositories, services, SSR queries (landing + dashboard), public GET APIs, seed script.

### 3.2 Tasks
- [ ] `models/company.ts` — singleton (getOrCreateDefaultCompany) — validators (URL/phone/address/font).
- [ ] `models/link-item.ts` — CRUD model.
- [ ] `models/testimonial.ts` — moderated landing testimonials.
- [ ] `models/brand-settings.ts` — font settings singleton.
- [ ] `models/user.ts` — enhance (plan: `lastLoginAt`, `failedAttempts`, `lockoutUntil`, `passwordChangedAt` — deferred to P5).
- [ ] Repos: `company.repository.ts`, `link.repository.ts`, `testimonial.repository.ts`, `brand-settings.repository.ts` (+ user.repository).
- [ ] Services: `company.service.ts`, `links.service.ts`, `testimonial.service.ts`.
- [ ] Public GETs: `app/api/company/route.ts`, `app/api/links/route.ts`, `app/api/testimonials/route.ts` (safe projections, rate-limited).
- [ ] `lib/seo/structured-data.ts` — LocalBusiness/Organization/WebSite/Review/AggregateRating builders (P6-lite).
- [ ] `scripts/migrate-to-reda.ts` — seed script (Company from Content+FALLBACK, LinkItems, Testimonials, BrandSettings + indexes).
- [ ] `proxy.ts` — extend PUBLIC_PATHS with `/api/company`, `/api/links`, `/api/testimonials`.
- [ ] Zod validators: `validators/company.ts`, `validators/link.ts`.

### 3.3 Dependencies
- P1 (design system) done.
- MONGODB_URI valid (dev running, Atlas).

### 3.4 Files/Modules affected
- `models/*` (new), `repositories/*` (new), `services/*` (new), `app/api/*` (new GETs), `lib/seo/structured-data.ts` (new), `scripts/migrate-to-reda.ts` (new), `proxy.ts` (extended).

### 3.5 Expected Deliverables
- 📦 Company + LinkItem + Testimonial + BrandSettings documents after migrate.
- SSR helpers (company/links/testimonials) for SSR.
- Public GET /api/company, /api/links, /api/testimonials.

### 3.6 Acceptance Criteria
- `scripts/migrate-to-reda.ts` seeds all 4 collections; APIs return shapes match DATABASE_DESIGN.md.
- `pnpm -w typecheck` passes.

### 3.7 Testing Requirements
- API smoke tests: GET /api/company, /api/links, /api/testimonials.
- `scripts/migrate-to-reda.ts` dry-run mode (--dry-run).

---

## 4. P3 — Landing Page Transformation (3–4wk)

### 4.1 Objectives
- New public landing: brand header + 5 action cards + testimonials; door animation; only door runs JS (door component + micro-anims).

### 4.2 Tasks
- [ ] **New landing page** — restructure `app/(marketing)/page.tsx`: BrandHeader + ActionsCards (DB) + Testimonials + WhyUs/Trust + ContactTiles + Footer.
- [ ] **Testimonials from DB** (`components/landing/testimonials-dynamic.tsx` or reuse `testimonials.tsx`).
- [ ] **Door animation** — already built in P1 (door.css + door-animation.tsx) — integrate + verify visually (no replay).
- [ ] **Product-specific micro-anims** — `components/landing/*-interaction.tsx` (handle/lock/cylinder/security hover effects).
- [ ] **Dynamic Links** — ActionsCards consumes DB links (fallback = static defaults).
- [ ] **Landing SEO** — metadata (`lib/seo/metadata.ts`), OG (P6-lite), canonical.
- [ ] **Old pages decision implementation** — A6: remove legacy pages (per A6); A7: freeze dashboard.
- [ ] Remove legacy landing components (except kept ones — decision).

### 4.3 Dependencies
- P2 (Database & Backend) ready. P1 ready.

### 4.4 Files/Modules affected
- `app/(marketing)/page.tsx` (rewrite).
- `components/landing/*` (restructured).
- Legacy: removed pages (per A6) — `app/(marketing)/products/**`, `app/(marketing)/checkout/**`, `app/(marketing)/cart/**`, `app/(marketing)/wishlist/**`, `app/(marketing)/orders/**`, `components/landing/{hero,brands,categories,featured-products,why-us,projects,testimonials,cta,statistics,company-numbers*}`.

### 4.5 Expected Deliverables
- 🔓 Landing v1: brand header + door animation + 5 DB-driven action cards + dynamic testimonials.

### 4.6 Acceptance Criteria
- Door opens exactly once on load; content reveals after; no replay on client-side navigation.
- 5 actions work (links open, wallet copy, WhatsApp opens, maps link).
- Testimonials display dynamic (published+verified).
- Legacy landing pages (e-commerce) removed per A6 — 404s work.
- Page passes: LCP, CLS, INP targets (P6).

### 4.7 Testing Requirements
- Playwright/Manual: door animation, actions, wallet copy, reduced motion.
- Lighthouse: LCP, CLS, INP (baseline).
- axe accessibility (mandatory — basic scan).

---

## 5. P4 — Admin Dashboard (3–4wk)

### 5.1 Objectives
- Dashboard: company/links/testimonials/fonts/address/settings management; moderation UI; audit logging for all actions.

### 5.2 Tasks
- [ ] Dashboard pages: `dashboard/company/page.tsx`, `dashboard/links/page.tsx`, `dashboard/testimonials/page.tsx`, `dashboard/fonts/page.tsx`, `dashboard/address/page.tsx` (new), update `dashboard/settings/page.tsx`.
- [ ] Server Actions (all 8 files listed in `SYSTEM_ARCHITECTURE.md §2.5`): rate-limit-pass + CSRF-pass + Zod-parse + guarded → mutation → audit/revalidate.
- [ ] Dashboard overview (`/dashboard`) — company stats + recent testimonials + link counts.
- [ ] Testimonial moderation — "unverified" queue, accept/reject flows.
- [ ] Preview modal (links manager — renders landing cards).
- [ ] Update `dashboard/actions.ts` — logoutAction retains.
- [ ] Update `app/(marketing)/layout.tsx` — brand from DB (Company singleton).

### 5.3 Dependencies
- P3 (data layer) ready.
- P2 (static defaults) — dashboard can work with or without, but integration full at end.
- Accessibility + design (P1).

### 5.4 Files/Modules affected
- `app/(dashboard)/dashboard/*` (all new pages + actions).
- `components/dashboard/*` (updated/new components).
- `lib/audit.ts`, `lib/activity.ts` (extended — test format).
- `components/landing/*` — update `brand` source to DB (Company).
- `app/api/auth/forgot-password`, `api/users/password` (harden — see §5.8).

### 5.5 Expected Deliverables
- ✅ Full dashboard v1: Company, Links, Testimonials, Fonts, Address, Settings, Overview.
- Moderation UI (verified/publish states).
- URL validation in UI + server.

### 5.6 Acceptance Criteria
- Admin login → can CRUD company, links, testimonials, fonts, address — changes appear on public landing (with revalidate).
- Guest (customer role) → dashboard → 403/redirect (per `proxy`).
- Unauthenticated GET public APIs (`/api/company`, `/api/links`, `/api/testimonials`) → 200 JSON; **safe projections: verify no private fields** (§5.6).
- Rate-limited actions — 429 after threshold.
- New dashboard looks good on mobile.

### 5.7 Testing Requirements
- E2E: add company → visible on public page. Publish testimonial → visible on landing. Edit link → landing updates. Change font → landing font changes.
- Security: guest login, guest API, invalid URLs in forms rejected, spam protection not tripped.
- Unit tests for Zod validators.

### 5.8 Risks
- **Password change flow broken** — test login after password change (`api/users/password` — review for security improvements).
- **Stale caches** — ISR 60s; verify updates appear within ~1 min.

---

## 6. P5 — Security Hardening (2–3wk)

### 6.1 Objectives
- Full hardening per `SECURITY_PLAN.md`.

### 6.2 Tasks
- [ ] Login lockout (failedAttempts + lockoutUntil, verified in `authService.verifyCredentials`).
- [ ] JWT: add `jti` to payload; `iat` exists; verify on logout (cookie delete + optional denylist).
- [ ] Session rotation: on password change, `iat` updated + old JWT rejected (via `passwordChangedAt`).
- [ ] `lib/env.ts` — hard-fail on missing required vars in production (JWT_SECRET, MONGODB_URI).
- [ ] Rate limiter: **Redis-backed** (or DB-backed) — new `lib/security/rate-limit.ts` (shared store).
- [ ] New rate limits: `/api/auth/login` (5/15s + lockout), `/api/auth/forgot` (5/min), `/api/auth/reset` (5/min), `/api/auth/revoke` (5/min).
- [ ] CSRF — keep double-submit; extend to new actions (login/logout — verify).
- [ ] Headers: dedupe `next.config.ts` + `proxy.ts`; add dashboard CSP specifics.
- [ ] New CSP: final version (Font allow-list after migration: `font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com`).
- [ ] Argon2id switch (pending — separate issue #1 from argon2 dep).
- [ ] `lib/audit.ts` — extend events: `password.change`, `company.edit`, `link.upsert`, `testimonial.*`, `font.save`, `address.edit`, `profile.update`, `settings.update`, `csrf_failure`, `rate_limit_exceeded`, `auth_forbidden`.
- [ ] Security scripts: `scripts/scan.sh` (grep for secrets, logout flows) — plan-only docs (`docs/SECURITY_BASELINE.md`).

### 6.3 Dependencies
- P4 (admin dashboard + actions) — security items integrate with new actions.
- P3 (backend) ready.

### 6.4 Files/Modules affected
- `lib/auth/session.ts`, `lib/auth/guard.ts`, `lib/security/csrf.ts`, `lib/security/rate-limit.ts` (extended), `lib/env.ts`, `lib/audit.ts` (extended), `lib/logger.ts`, `lib/responses.ts`, `next.config.ts`, `proxy.ts`, `components/ui/button.tsx` (refined focus states + a11y).

### 6.5 Expected Deliverables
- 🔒 Full hardened stack.

### 6.6 Acceptance Criteria
- Login lockout: 5 failed logins in 15s window → rate limit + lockout (§6.2). Verify: login failure → after 5 attempts, login form shows lockout message; restore after lockout expires (decision §4).
- Password change → old session invalid (manual test).
- Rate limit test (5+ attempts → 429).
- CSP test (no violations in console).
- `pnpm audit` clean (0 high-severity).

### 6.7 Testing Requirements
- Security test plan: manual + automated manual checks; SSH-like check (see `SECURITY_PLAN.md`).

### 6.8 Risks
- Session invalidation on logout/password change (old tokens rejected) — accepted tradeoff for security.

---

## 7. P6 — SEO & Performance (2–3wk)

### 7.1 Objectives
- Structured data, sitemap, robots, images, fonts, WCAG, Lighthouse pass.

### 7.2 Tasks
- [ ] `lib/seo/structured-data.ts` — LocalBusiness, Organization, WebSite, Review, AggregateRating — new.
- [ ] Metadata — final versions per page (`lib/seo/metadata.ts` — finish, use everywhere).
- [ ] `app/robots.ts` — update for new routes + legacy pages.
- [ ] `app/sitemap.ts` — update (`revalidate = 60`? — yes).
- [ ] Local assets migration: `public/images/*` — migrate from Unsplash URLs.
- [ ] Optimize hero image (WebP, add blur, `sizes`).
- [ ] Fonts: final `next/font/google` usage; `sizeAdjust` metrics; `font-display: swap`.
- [ ] Lighthouse — fix all P0 issues (LCP, CLS, INP).
- [ ] Web Audit — `axe-core` full scan.
- [ ] Mobile check: iPhone SE/iPad/Cloud phone — no horizontal scroll.

### 7.3 Dependencies
- P3 (landing live), P2 (public data) — can run parallel-ish after P2.
- P1 (fonts) done.

### 7.4 Files/Modules affected
- `lib/seo/metadata.ts` (finalized), `lib/seo/structured-data.ts` (new), `app/robots.ts`, `app/sitemap.ts`, `app/(marketing)/page.tsx` + `layout.tsx` + `footer.tsx` (metadata), `components/landing/*` (minor updates), `app/layout.tsx` (fonts final).

### 7.5 Expected Deliverables
- 🚀 SEO: structured data, sitemap, robots, clean Lighthouse (P0: all pass, no violations in axe).
- 🚀 Perf: Lighthouse (90+ all), WCAG full pass, mobile UX.

### 7.6 Acceptance Criteria
- Lighthouse: LCP < 2.5s, CLS < 0.1, INP < 200ms, FCP < 1.0s, score ≥ 90 (desktop + mobile).
- axe-core: 0 critical violations.
- `pageSpeed.dev`: A.
- Structured data: Google Structured Data Testing Tool — errors = 0.

### 7.7 Testing Requirements
- Lighthouse, axe, Manual: Media queries, keyboard nav, focus trap.

### 7.8 Risks
- **SEO regressions** — audit legacy SEO (existing metadata, robots, sitemap, URLs, canonicals).

---

## 8. P7 — Testing & Production Readiness (3–4wk)

### 8.1 Objectives
- Full QA suite + docs + production readiness + deploy runbook + security testing.

### 8.2 Tasks
- [ ] **Automated unit tests** — framework & triggers: vitest (lib, zod, validators), Playwright (E2E). |
- [ ] **Automated unit tests** (extended) — triggers: screen resolutions, edge cases (iPad, desktop, mobile).
- [ ] **Playwright E2E tests** — flow: landing load → door → actions; admin CRUD flows.
- [ ] **Security tests** — See `SECURITY_PLAN.md` P7 checklist; OWASP manual scan.
- [ ] **A11y tests** — See `PRODUCT_REQUIREMENTS.md` §7 checklist.
- [ ] **Stress tests** — Production-level: 2× (rare).
- [ ] **Production deploy runbook** — DNS change (cutover), smoke tests, monitoring, alerts, known-issues list.
- [ ] **End-of-cycle QA manual pass** — full regressive review (performance, mobile, security, compat, translation, fonts).
- [ ] **Site health check after launch** — `curl -v https://alreda.../` — status 200, no leaks, headers good.

### 8.3 Dependencies
- All P0–P6 done.

### 8.4 Files/Modules affected
- `test/` directory (new), `scripts/` (security scan), `docs/` (deployment runbook + security audit log), `README.md` (project docs).

### 8.5 Expected Deliverables
- ✅ Test suite green (unit, E2E).
- ✅ Lighthouse all green + axe 0 violations.
- ✅ Security audit complete (no open issues).
- ✅ Deploy runbook + launch.

### 8.6 Acceptance Criteria
- `pnpm test` passes; Lighthouse 90+; axe 0 violations; no 5xx in production after 2h.
- `pnpm audit` — 0 high-severity.
- No secrets in production (verified by scan).
- HTTPS/HSTS ready; SSR-enabled in dashboard routes (cache misses? — 404 status verified).
- Site-wide: `view-source:https://alreda.../` — no scripts from untrusted domains.

### 8.7 Testing Requirements
- Full suite + production smoke.

### 8.8 Risks
- **Build issues in production** — test now (staging), not after launch.
- **User data migration issue** — test with clone of DB.

---

## 9. Cross-Cutting Implementation Notes

- **Type safety:** Zod validation at boundaries + Pydantic-ish `interface` for DB schemas (Mongoose — will validate when building).
- **No todo comments** — all planned work encoded in this file.
- **Style guide:** tabs (like existing), no trailing whitespace, prettier + prettier-plugin-tailwind — auto-fix at end of each P.
- **ESLint:** `components/*` should be annotated (Prettier + Prettier-plugin-tailwind in `apps/web/package.json` — auto-fix on save).
- **Onboarding:** add a `README.md` + `docs/` — see P7.

---

## 10. Complexity Estimates (Classification)

| Milestone | Complexity | Notes |
|---|---|---|
| P0 Audit | Small | Read-only + planning docs |
| P1 Brand/Design | Medium | Visual — standards follow existing patterns |
| P2 Landing + Animation | Large | Custom CSS animation + new UI — the trickiest part |
| P3 DB & Backend | Medium | Data layer + queries — well-understood patterns |
| P4 Dashboard | Large | Lots of forms, CRUD — mechanical but time-consuming |
| P5 Security | Medium | Harden existing systems, add features |
| P6 SEO & Perf | Small/Medium | SEO tools + optimization — high ROI, low risk |
| P7 Testing | Medium | QA-heavy — automation + manual + deploy |

**Total estimated effort:** ~19–24 person-weeks.

---

## 11. Dependencies Summary

### 11.1 Technical
- MongoDB (Atlas) running — baseline (P0).
- Node/pnpm installed — P0.
- Local dev setup (Mongoose, TS, Next 16) — P0.
- `node_modules` — P0.

### 11.2 Business
- Final Arabic copy (logos, taglines, testimonial text, room descriptions) — by P1–P2 review.
- Company business data: name (Arabic+English), phone, WhatsApp, InstaPay link, cash wallet info, address, coordinates, Google Maps review link, website URL — by P3 (for migration) + P4 (for management).
- Contact person for backup launch — P7.

### 11.3 External
- Google Search Console (SEO — after deploy).
- Vercel domain — P7.

---

## 12. Cross-Ref (Doc Links)

- Baseline Audit: `PROJECT_AUDIT.md`
- Product Requirements: `PRODUCT_REQUIREMENTS.md`
- Brand/UI: `BRAND_AND_UI_UX.md`
- Architecture: `SYSTEM_ARCHITECTURE.md`
- DB: `DATABASE_DESIGN.md`
- Security: `SECURITY_PLAN.md`
- SEO/Perf: `SEO_AND_PERFORMANCE.md`
- Roadmap: `IMPLEMENTATION_ROADMAP.md`
- Risks/Migration: `RISKS_AND_MIGRATION.md`
- Decisions: `DECISIONS_AND_ASSUMPTIONS.md`

---

**End of IMPLEMENTATION_ROADMAP.md**
