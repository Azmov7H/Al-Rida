# RISKS & MIGRATION — Breaking Changes, Migration, Rollback

**Date:** 2026-11-20  
**Summary:** Breakdown of breaking changes (Next 16), legacy page decisions, migration plan (DB + cutover), rollback steps, tech debt, decision exit strategies.

---

## 1. Breaking Changes (Current → Target)

| # | Area | Change | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Next.js 16 (middleware → proxy)** | `proxy.ts` is required (or optional) name — kept. Middleware → proxy rename **required** in Next 16. | High (route protection) | Audit confirmed `proxy.ts` already used. Testing proxy before launch. |
| 2 | **Search Params → `await`** | `params`, `searchParams` from page components are now awaited in some APIs. | Medium | Audit — no changes needed if using awaits. |
| 3 | **Node.js 20+ (Next 15+)** | Next 16 requires `engines.node >= 20` — already set. | Low | Vercel auto-updated. |
| 4 | **Image API stability** | `<Image>` behavior changes: `sizes` requirement, `placeholder` changes. | Low | Audit — compat. |
| 5 | **Font API (next/font/google)** | Next 16: `next/font/google` kept (audit verified). No import changes. | Low | — |
| 6 | **Turbopack** | Turbopack for builds — changed behavior — build changes OK. | Medium | Audit — changed to use all rules: `next build` — can toggle `--turbopack`? — plan to test. |
| 7 | **SSG/SSR defaults** | Same (App Router). | Low | — |
| 8 | **Cookie behavior** | JWT cookie — same. | Low | — |

---

## 2. Legacy Page Decisions

### 2.1 Formal Options for Old E‑Commerce Pages

**Opinion from audit (Pro/Con):**
- **Option A (recommended):** Remove pages; update robots/sitemap; fallback redirects (404 → `/` or `/contact`).
- **Option B:** Keep legacy paths as secondary landing; new design is additive. (Backward-compatible, less churn.)

### 2.2 Decision (Required — see DECISIONS §A6/A7)

Options with time estimates (1 week before implementation):

- **A: Remove pages** (recommended): remove old e‑commerce routes, update robots/sitemap.
- **B: Keep legacy** — (no extra work; new design is additive) — old pages remain (with old landing).

**Decision (formal, in DECISIONS):** Option A (Remove + new landing) for P2+.
- **A (Remove):** delete `(marketing)/products/**` (incl. `[slug]/`), `(marketing)/cart`, `(marketing)/checkout/**`, `(marketing)/orders/**`, `(marketing)/wishlist/**`, `app/api/{cart,wishlist,orders,checkout,products}/**` — plus `services/product.service.ts` + e‑commerce repos/services used by them; rework `components/landing/*` reuse texts.
- **B:** no deletes, legacy pages stay (old landing).
- **Note (A):** freeze `Product`, `Brand`, `Category` DB models (legacy dashboards — §2.2 `A7` — keep legacy dashboards working).

### 2.3 Route Mapping (for redirects or legacy pages)

| Legacy URL | New URL | Notes |
|---|---|---|
| `/products` | `/` (new landing) | or keep `/products` as removed — decision (§A6/A7). |
| `/about` | `/` (new landing) | or keep — decision. |
| `/offers` | `/` (new landing) | or keep — decision. |
| `/projects` | `/` (new landing) | or keep — decision. |
| `/brands` | `/` (new landing) | or keep — decision. |
| `/categories` | `/` (new landing) | or keep — decision. |
| `/contact` | `/` (new landing) | or keep — decision. |
| `/products/[slug]` | `/` (new landing) | or keep — decision. |
| `/offers` | `/` (new landing) | or keep — decision. |
| `/login` | `/login` | keep. |
| `/register` | `/register` | keep. |

---

## 3. Migration Plan (DB + DNS + Legacy)

### 3.1 Database Migration Script (`apps/web/scripts/migrate-to-reda.ts` — new)

Steps:
1. Connect DB.
2. **Backup**: dump Atlas DB snapshot to local file.
3. Validate all `Content` docs (`getBySection(...)`): 
   - For `company`: `name`, `phone`, `email`, `address` (validate via Zod).
4. Seed `Company` singleton (from Content + `config/site.ts` + `lib/landing-data.ts:contactInfo` + `FALLBACK.company`).
5. Seed `BrandSettings` singleton (defaults).
6. Create Testimonials (from `landing-data.ts:testimonials` + sort).
7. Create LinkItems (main_actions + footer sections, enabled=true).
8. Create indexes (Company, LinkItem, Testimonial).
9. **Verify:** 
   - Public APIs (`/api/company`, `/api/links`, `/api/testimonials`) return expected data (manual test).
10. Log summary (counts: company, links, testimonials).
11. **Confirm prompt:** "Ready to continue? (Y/n)"

### 3.2 DNS / Cutover (P7)

Steps (with rollback notes):
1. Stage DNS change: switch A record / CNAME from Vercel old to Vercel new (plan live = same).
2. Smoke test on new domain after switch.
3. Vercel preview deployment — test all pages.
4. **Canary:** set new preview as production traffic — gradual rollout (if available) — else direct.
5. **Monitoring:** Add `/health` endpoint (200 when DB reachable; §8.3).

### 3.3 Cookie Invalidation (Forces Logouts)

Since session secret (`JWT_SECRET`) remains the same — old tokens remain valid. Plan:
- Optionally rotate `JWT_SECRET` before launch → all staff sessions invalidated (old cookies dead — safe). — **Decision (§A5): consider rotating (default: no, minimal disruption).**
- Better: add `iat`/`lastIssued` to payload — since we keep `JWT_SECRET`, no forced logout needed.

### 3.4 DNS / Cutover — Backup Domain (Optional)

- Optionally keep old domain (e.g., `alreda-old.example`) alive → redirect to `/`? — decision.

---

## 4. Rollback Strategy

### 4.1 DB Rollback

- Snapshot of DB before migration (via Atlas). Restore if needed.
- For destructive changes (page removal): `git revert <commit>` — restore old files.

### 4.2 Code Rollback

- For production:
  1. `git stash` (uncommitted changes).
  2. `git checkout [prev-release-tag]` — restore old code.
  3. Deploy rollback via Vercel.
  4. Restore DB snapshot (if destructive changes).
  5. Restore old DNS.
- For staff sessions — since sessions are JWTs (independent of code), rollback works (with same `JWT_SECRET`).

### 4.3 Steps for Rollback

```
1. git checkout [prev-tag] && git reset --hard  # back to last good commit
2. Atlas: snapshot.restore(db, [target-date]) # snapshot saved during migration
3. Vercel: rollback (revert preview)
4. DNS: revert A record / CNAME
5. Smoke test: site works, staff can login
```

### 4.4 Decision exit strategies

- **For removing legacy pages (Option A):** Old → New URL fallback: add `notFound` → `/` mapping? (No need — decide; if Option B, no fallback.)

---

## 5. Technical Debt

| Item | Status | Plan |
|---|---|---|
| Legacy e-commerce (`products`, `checkout`, `cart`, `wishlist`, `orders`) | Deprecated in vision | Plan removal (§2.1 A); if keeping (B), mark legacy and freeze |
| `Content` model legacy (hero, footer, company) | Frozen, used as migration source | Keep for migration, then freeze. (Remove in P8+ — optional.) |
| Old `lib/landing-data.ts` components (Brands, Categories, WhyUs, Projects) | Legacy | Remove in P2 or repurpose; audit at P2 completion. |
| `role` ambiguity | Noted | Plan: resolve in P4; make all roles manager+. |
| Old JSON metadata (legacy pages) | Replaced by `lib/seo/metadata.ts` | Revive in P6. |
| Unused `Web-Vitals` telemetry | Not enabled | Defer (§7). |

---

## 6. Risk Acceptance Criteria (Go/No-Go)

### 6.1 General Criteria

| Criteria | Threshold |
|---|---|
| Lighthouse scores (P2, P6) | Score ≥ 90 (desktop + mobile) — all metrics in `SEO_AND_PERFORMANCE.md` §2.1 |
| axe-core (P2, P6) | 0 critical violations |
| Security findings (P5) | 0 high-severity — OWASP-lite |
| Build health (P0-P7) | `pnpm -w typecheck` passes on all milestones |
| DB migration (P3) | Complete + verified (all routes work) |
| Cookie rotation (P5) | Decision (§A5) — rotation off by default |
| Cutover (P7) | All previous metrics — none degraded |

### 6.2 Per-Milestone (Go/No-Go)

| Milestone | Go Criteria | No-Go Criteria |
|---|---|---|
| P2 | Lighthouse 90+ desktop, door opens correctly, actions work | Any door issues, actions broken, LCP > 3s |
| P3 | SSR page loads (no errors), public APIs work, migrate done | Public API broken, migration errors |
| P4 | Guest gets 403, user CRUD works, old pages still exist | Guest can edit, CRUD broken |
| P5 | Rate limit 429 works, lockout tested, `pnpm audit` 0-high | Lockout broken, security holes found |
| P6 | Lighthouse 90+, axe 0 violations, all structured data valid | Lighthouse dropped, axe violations found |
| P7 | Production launch (30 min), no immediate issues | Any broken flow, critical SEO issues |

---

## 7. Decision Exit Strategies (Key Decisions)

| Decision | Exit (How to Revert) |
|---|---|
| **A: Remove legacy pages** | `git revert` on removal commit; restore legacy files from git history; update robots/sitemap. |
| **B: Keep legacy pages** | No action needed. |
| **Cookie rotation (P5)** | If disabled, no action. If enabled, JWT_SECRET rotation invalidates all sessions (safe). |
| **Argon2id migration** | Revert bcryptjs (no DB migration — password hashes change format; audit password hashes — old hashes invalid → users can't login → plan migration or keep bcrypt). |
| **Google Maps API** | No migration needed — external links. |
| **Multi-language (EN) version** | Stop deployment (site reverts to Arabic). |
| **Web Vitals telemetry (P7)** | Turn off via env; no data loss. |
| **Redis rate limiting** | Fallback to in-memory rate limiter (files in `lib/security/rate-limit.ts`). |

---

## 8. Cutover Timeline & Launch Checklist

### 8.1 Pre-Launch (P7)

| # | Item |
|---|---|
| 1 | Staging (Vercel preview): deploy, smoke test. |
| 2 | Production smoke test plan (check 200s on key pages: `/`, `/contact`, `/login`, `/dashboard`). |
| 3 | Database backup (Atlas snapshot) — final. |
| 4 | DNS change on registrar (TTL 0 or 1 min). |
| 5 | Post-launch: new promo announcement? (copy — optional). |
| 6 | Post-launch SEO check: Index verification (Search Console), Mobile usability, Core Web Vitals. |
| 7 | Post-launch security: Scan, re-test lockouts. |
| 8 | Post-launch monitoring: site health, performance, support tickets. |

### 8.2 Launch Day Sequence

```
1. git push → CI/CD builds (P0-P6 green).
2. Trigger Vercel preview deploy (manual gate).
3. Smoke test on preview (console, network tab, Lighthouse).
4. Approve → DNS change to new host.
5. Smoke test on live (curl, public pages).
6. Verify no regressions: logs, metrics, health checks.
7. Public announcement (team + channels) — optional.
8. UAT-testing window (1-2 days): fix issues in staging.
```

### 8.3 Post-Launch (2 weeks)

| # | Item |
|---|---|
| 1 | Monitor 5xx errors (⚠️ alert if >5%). |
| 2 | Check SEO signals (GSC, Bing). |
| 3 | Check site speed (Lighthouse weekly). |
| 4 | Check security alerts. |
| 5 | Release notes: completed — P0-P7 done — summary. |
| 6 | Retrospective: what worked, what to improve. (Plan: 30min retro after P7 — find action items — track in backlog.) |

---

## 9. Known Migration Risks (Timeline + Mitigations)

| Risk | When | Mitigation |
|---|---|---|
| Stale DNS after rollout | P7 | TTL set to 0, run, verify. |
| Cookie invalidation | P5 | Decisions (§A5) — can be rolled back, but old sessions. |
| DB migration errors | P3 | Verify, snapshot, rollback to prev DB snapshot. |
| Legacy page removal breaking old links | P2 | Implement fallback redirects (`/offers` → `/`) — decision (§A6/A7). |
| SEO regression | P6 | GSC verification, 404s, canonical audit before launch. |
| Performance degradation | P6 | Lighthouse tests before launch. |
| Staff access lost | P7 | Backup: find root admin (`scripts/seed-admin.ts`), have SSO (none) — document login procedure. |
| New feature bugs | P7 | Smoke test, E2E tests in P7, early user access — share login info early. |

---

## 10. Decision exit strategies (already in §7)

*(See §7 above — decisions are repeatable; capture here too: options with timelines + rollback notes — for quick reference during P5+ review.)*

---

## 11. Other (Uncategorized) — Decisions (Also see DECISIONS_AND_ASSUMPTIONS.md)

| # | Decision | Status |
|---|---|---|
| 0 | **Old code access** — Should staff be migrated? | **Formal: Keep — legacy dashboards frozen (Decisions §A7).** |
| 0.1 | **Legacy pages removal scope** | **Formal: Remove products/checkout/cart/wishlist/orders (A6), keep contact (as public).** |
| 0.2 | **Legacy Product pages/products/categories (marketing)** | **Formal: Removed (A6) or keep (A7).** |
| 0.3 | **DNS cutover decision (2 options)** — **Formal: New domain → DNS change (P7).** |

---

**End of RISKS_AND_MIGRATION.md**
