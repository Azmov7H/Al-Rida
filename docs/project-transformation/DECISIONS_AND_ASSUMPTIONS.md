# DECISIONS & ASSUMPTIONS — Al-Reda Digital Business Platform

**Date:** 2026-11-20  
**Version:** 1.0  
**Status:** Living record — formal decisions (A1–A12) for implementation team; Assumptions for business/pushing; Unresolved Business Questions (B1–B13).

---

## 1. Sectioning

- **A-series (Formal Decisions):** Required by implementation team — implementation-team decisions (architecture, platform behavior, timelines, exit strategies). Defined behavior — must be followed.
- **B-series (Business Data Requirements):** What business must provide: values, translations, documents. Business-level questions — data, operational info, verification, objectives, timelines.
- **C-series (Editorial/Agency Estimates):** Rough estimates of costs/effort — not final.

---

## 2. Formal Decisions (A1–A12) — Required by Implementation Team

### A1 — Static Nav Links (UX Config, Not Dynamic)
- **Decision:** Landing header nav links are **static** (UX config) — sourced from `constants/navigation.ts` (existing) — not DB.
- **Rationale:** Nav links are UX chrome, not dynamic content; page content (company info, links) is CMS content (LinkItem).
- **Impact:** Dashboard does not manage nav; replaces old marketing `navLinks` data with static `constants/navigation.ts`.

### A2 — Font Mapping (Readex Pro for Display, Cairo for UI)
- **Decision:** Readex Pro used for hero display headings; Cairo for UI + body; Inter (English); JetBrains Mono for SKU/data.
- **Impact:** `BrandSettings.primaryArabicFont` enum: `cairo`, `readexPro`. Display role: Readex Pro. Decision note: if dashboard-only switching → implement switching accordingly.

### A3 — Tailwind 4 Tokens via `@theme`
- **Decision:** Colors defined via Tailwind CSS v4 `@theme` in `apps/web/styles/globals.css` — tokens auto-imported.
- **Impact:** New Tailwind CSS v4 `@theme` block in `apps/web/styles/globals.css`.
- **Note:** Tailwind v4 is the required version for Next 16 (architecture); `@tailwindcss/postcss` already installed.

### A4 — Single-Step Font Change, With FOUT Warning
- **Decision:** Single-step font swap per change (no two-phase swap). On change: brief FOUT possible on landing (small); dashboard shows the change immediately.
- **Impact:** Dashboard experience UX note; acceptable CLS/UX on landing.

### A5 — Cookie Rotation (Optional)
- **Decision:** Cookie rotation on password change is **optional** — sessions stay valid by default; optional rotation step added in P5 (documented). Default: no rotation.
- **Impact:** If rotated: old sessions invalidated (safe); old cookies don't work.

### A6 — Legacy Page URLs: Keep vs Remove
- **Options:** A (remove — clean URL map) / B (keep — backward compatible).
- **Decision:** **Option A: Remove** (recommended, clean URL map). List of removals per `RISKS_AND_MIGRATION.md` §2.3.

### A7 — Legacy Dashboard Pages
- **Decision:** **Keep — frozen** — legacy dashboards (`products`, `orders`, etc.) remain available but legacy; noted.

### A8 — Rate Limiter Backend
- **Decision:** **Redis-backed** (or DB-backed — as of P5, Redis preferred; in-memory fallback for dev).

### A9 — Google Maps Reviews (External Only)
- **Decision:** Google Maps reviews are external links — no API integration for embedded maps or reviews data.

### A10 — HTTPS Default (Vercel)
- **Decision:** HTTPS on production (Vercel default). HSTS via `headers()`.

### A11 — Google Maps API?
- **Decision:** No (external links only — `googleMapsReviewUrl`, `googleMapsUrl` as links). — See §2.4 doc.

### A12 — Digits Policy
- **Decision:** Eastern Arabic digits (١٢٣) in phone, wallet, ID-ish; Western digits (123) in SKU/QR/codes.

---

## 3. Assumptions (Business/Agency/Technical)

### B-Assumptions (B1–B13) — What Business Must Provide (Unresolved Question Time)

| ID | Assumption/Question | Notes |
|---|---|---|
| **B1** | Company Name (Arabic: الرضا, English: Al-Rida? or ?) | Old: "Al Rida" (English) / "الرضا" (Arabic). Confirm with business. |
| **B2** | Google Maps reviews link (URL) | Only obtainable via link — external API integration? (Decision: external links only, see A9). |
| **B3** | InstaPay link | Direct URL to payment platform. |
| **B4** | Cash wallet details | Account number/label/instructions. |
| **B5** | Official Website URL | The company's new URL. |
| **B6** | QR artwork + domain (QR validity) | Needed at P7 — user to provide by then. |
| **B7** | Legacy e-commerce data (products/orders) | Option: keep for dashboard/analytics (decision: keep, no migration). |
| **B8** | Testimonial count + contents | Seed 3–5 real ones (legacy data + new, verified by business). |
| **B9** | "Business in Numbers" values (years, products, brands, clients) | New: TBD — **decision: static config, not DB**. |
| **B10** | EN version | Skip for v1 (Arabic-first) — decision (§4). |
| **B11** | Testimonial date display | `createdAt` — seed (admin marks; date of review). |
| **B12** | Login flow | Email + password — rate-limited, locked-out after 5. — Standard. |
| **B13** | Google verification | GSC — planned, needs control of domain — decision (§5). |

### Agency (C-Series — Estimated Costs)

| # | Item | Estimate | Notes |
|---|---|---|---|
| C1 | Design/brand work (P1, logo, identity) | ~2 weeks agency time | High: professional deliverable |
| C2 | P2 animation/DS | ~2 weeks agency time | Medium |
| C3 | P3–P5, P6–P7 | ~4-5 weeks | Medium |
| C4 | Total | ~9-11 weeks agency time | Estimate — validate at P7 |
| C5 | **Deadline** | ~3 months (Q2 2026) | If relevant — mention to client early |
| C6 | Logo/brand files (e.g., .ai, .psd, renders) | ~1 week | Initial deliverables only |

### Other Assumptions (Agency)

| Area | Assumption |
|---|---|
| Hardware | ≥ 16GB RAM, macOS 15/Windows 10+/Linux. |
| Tools | Figma (design) — higher transferable assets (PDFs/WebP/PNG, with source layers). |
| Security | HTTPS-only, HTTPS+HSTS, for Production. |
| Speed (TTFB, LCP) | Target: LCP < 2.5s, FCP < 1.0s, CLS < 0.1, INP < 200ms. |
| Deploy | Vercel (existing), DNS at registrar. |
| Backup | Mongo Atlas snapshot policy — daily, via Atlas. |
| Assets | All images should be WebP, compressed. |
| Search | Google Search Console — account already created (external). |
| SEO | Keywords: professional door hardware ( الأقفال، الأوكر، أغلاق، أدوات أبواب، زحل ) — content vs. keywords. |
| Domains | alreda.example (or preferred by business — TBD), www alias. |
| Cache | CDN (Vercel) — cache policy default. |
| Performance | Lighthouse CI in GitHub Actions? — Optional. |
| Security Testing | OWASP-lite: static analysis + manual. |
| Support | Root admin for login. |

### Dev Environment Assumptions

| Area | Assumption |
|---|---|
| Services | MongoDB running on localhost for dev (Atlas in prod). |
| Env vars | `.env.local` with `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL` — ✓ (existing). |
| Node/pnpm | Node 20, pnpm 10 (existing `packageManager`). |
| Git | Clean tree at start (P0, review blockers) — confirmed. |
| CI | None — no workflow — decision: none for v1, add GH Actions in P7. |
| Markdown | `README.md` + docs — final at P7. |

### Legacy Data Decisions

| Area | Decision |
|---|---|
| `products`/`orders`/`cart`/`wishlist` | Keep — Dashboard stays — accessible via `/dashboard/products` etc. — freeze legacy. |
| `Content` | Frozen — used as migration source — removed after migration (optional). |
| `Review` (product) | Keep — frozen — product-specific — separate from `Testimonial` (new, dynamic). |

---

## 4. Decisions Documented (Where Answered)

- Legacy pages (A6/A7): In `RISKS_AND_MIGRATION.md`.
- Rate limiter (A8): `lib/security/rate-limit.ts` — Redis-based.
- Google Maps (A9/A11): External links.
- Digits policy (A12): Eastern Arabic.
- Cookie rotation (A5): Optional at P5.

---

## 5. Pending Decisions (Follow-up Required After)

| # | Decision Point | Deadline | Impact |
|---|---|---|---|
| P1 | Final copy + fonts for "Business in Numbers" numbers | End of P1 | Affects `landing-data.ts` values (static). |
| P2 | Final Arabic copy review (titles, CTAs) | End of P2 | Affects all landing components. |
| P3 | Business data delivery (B1–B13) | Before P3 | Affects migration + seed. |
| P5 | Argon2id vs bcryptjs | End of P5 | Affects security. |
| P5 | Multi-language (EN) v1? | End of P5 | Affects scope. |
| P6 | Structured data audit (Google) | End of P6 | SEO. |
| P7 | Cutover date + rollback plan signoff | End of P7 | Affects launch. |

---

## 6. Unknowns & Ambiguities (Historical)

| ID | What | Resolved? |
|---|---|---|
| U1 | Old legacy admin data — remove or keep? | Formal: Keep — legacy dashboards frozen (A7). |
| U2 | Google Maps API integration? | Formal: No — external links only (A9/A11). |
| U3 | Arabic vs Latin name — الرضا or Al Rida? | **Open — business decision (B1).** |
| U4 | EN version support? | **Open — business decision (B10).** |
| U5 | Old code-infra or migrate? | **Open** (see A6, RISKS_AND_MIGRATION §2). |
| U6 | Root admin for login | **Open — decision (B12).** |
| U7 | GSC verification process | **Open — decision (B13).** |
| U8 | QR artwork + domain (QR validity) | **Open — decision (B6).** |

---

## 7. Risk/Decision Exit Strategies (Also in RISKS_AND_MIGRATION.md)

- Revert decisions: (A6) — revert via git; (A7) — no action; (A5) — JWT rotation.

---

## 8. Decision Archive (Changelog Log for Decisions)

| Date | Decision | Type | Owner |
|---|---|---|---|
| 2026-11-20 | All formal decisions (A1–A12) — initial | Initial | Architect |

---

## 9. Executive Summary (TL;DR for Stakeholders)

1. **Goal:** Transform from a door-hardware e‑commerce store into a premium digital business card with customer engagement — P0–P7.
2. **Estimate:** ~19–24 person-weeks (1 dev). (~5–7 weeks for one person + a bit.)
3. **Key risks:** Dirty tree, data migration, staff access, SEO — all mitigated.
4. **Quick answers:**
   - **Verified:** Legacy pages — removed (or kept — decision A6/A7 — formal: Remove).
   - **Assisted:** Argon2 — offered (P5).
   - **User Dashboard:** New dashboard for landing management.
   - **External:** Google Maps reviews — external links only.
   - **Assistive technologies:** — Staff login kept — unchanged.

---

**End of DECISIONS_AND_ASSUMPTIONS.md**
