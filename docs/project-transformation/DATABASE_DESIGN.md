# DATABASE DESIGN — MongoDB (Mongoose)

**Date:** 2026-11-20  
**Version:** 1.0  
**Summary:** 6 new collections + extended legacy models (User enhanced, Review legacy). Mongoose 9.7.4 on MongoDB Atlas. Singleton pattern for `Company` and `BrandSettings`. No foreign-key joins (denormalized links where justified). No document migration framework (explicit version fields + migration scripts).

---

## 0. Design Principles

- **New domain models** (Company, LinkItem, Testimonial, BrandSettings) — denormalized with `slug` where it's the primary query dimension; counters precomputed where needed.
- **Singleton pattern:** `slug: "default"` unique index, enforced via `getOrCreateDefault` helper.
- **Indexes:** all queryable fields indexed (status, sortOrder, isActive, isPublished, slug, section); document sizes are small (<64KB each).
- **Safety:** no secrets in DB; passwords hashed server-side; validation at model level + service level + API level.
- **Compatibility:** `User` schema stays compatible with the admin login (`api/auth/login`) — extend, not break.

---

## 1. Company (singleton) — the brand's dynamic data

`db.Company` — doc count = 1 (enforced by `Company.singletonSlug = "default"` helper).

| Field | Type | Required | Validation | Index | Notes |
|---|---|---|---|---|---|
| `slug` | String | yes | `"default"` | unique | Singleton marker |
| `name` | String | yes | non-empty, ≤ 100 chars, Arabic-capable | | e.g., "الرضا" |
| `description` | String | yes | non-empty, ≤ 300 chars | | Short professional description |
| `websiteUrl` | String | yes | Zod: https URL, no userinfo, ≤ 256 | — | Company website (e-commerce legacy goes away; new = official site; optional if keep old) |
| `googleMapsReviewUrl` | String | yes | Zod: https URL (https://www.google.com/maps/...) ≤ 1024 | — | The Maps reviews link, edited by admin |
| `instaPayLink` | String | yes | Zod: https URL, ≤ 1024 | — | Payment/collector link |
| `cashWalletNumber` | String | yes | non-empty, ≤ 64 (E.164-like "971..." or "EUR...") | — | Wallet account number |
| `cashWalletLabel` | String | yes | non-empty, ≤ 128 | — | e.g., "محفظة الشركة" |
| `cashWalletInstructions` | String | yes | non-empty, ≤ 512 | — | e.g., "انتقل للحساب البنكي ..." |
| `logoImageUrl` | String | yes | https URL, ≤ 2048 | — | Landing header logo |
| `coverImageUrl` | String | yes | https URL, ≤ 2048 | — | Optional cover |
| `phone` | String | yes | ≤ 30, digits+spaces | — | Main company phone |
| `email` | String | yes | Zod email, ≤ 255 | — | Display/mailto |
| `address` | Mixed | yes | `{ street, city, governorate, postalCode, country }` | — | Street/Mdu/Gov/Postal/Country |
| `googleMapsUrl` | String | yes | https URL, ≤ 2048 | — | Interactive map share link |
| `coordinates` | Mixed | no | `{ lat: Number, lng: Number }` | — | `-25..55, 34..57` valid |
| `primaryArabicFont` | String | yes | enum of fonts (see BrandSettings, default `"cairo"`) | — | Used on landing; override possible |
| `updatedAt` | Date | auto | — | — | |
| `_id` | ObjectId | yes | — | — | auto |

**Model definition (target):** `apps/web/models/company.ts` — `Company` + `getOrCreateDefaultCompany(seed?)`.

**Seed strategy:** Seed with defaults from `scripts/migrate-to-reda.ts` (from old Content "company" doc + `config/site.ts` + `lib/landing-data.ts:contactInfo`).

**Security notes:**
- `address` stored as structured object — no injection risks (inputs Zod-validated).
- `googleMapsReviewUrl`/`websiteUrl`/etc. validated server-side before save (SSRF not applicable — links only rendered in `<a href>` — `rel="noopener noreferrer"` everywhere; target `_blank` default for external).
- URLs limited in length; scheme = https (or `mailto:` for email; `https://` only enforced for maps/payments/website; no userinfo).

---

## 2. LinkItem — dynamic landing links

`db.LinkItem` — count ~6 (5 main actions + footer + nav? — nav is static config (see DECISIONS §A1). Recommend 5 main + a few footer links (max ~12)).

| Field | Type | Required | Validation | Index | Notes |
|---|---|---|---|---|---|
| `title` | String | yes | non-empty, ≤ 60, Arabic/English OK | — | Button text |
| `description` | String | no | ≤ 120 | — | Sub-text (whatsapp message is separate) |
| `url` | String | yes | Zod https URL, ≤ 2048 | partial-sparse | Main action URL |
| `iconKey` | String | yes | enum: `googleMapsReviews`, `instaPay`, `cashWallet`, `whatsapp`, `officialWebsite`, `mapPin`, `mail`, `phone`, `globe`, `shieldCheck`, `currency`, `bankTransfer`, `custom` (docs) | — | Icon identifier — previewed in dashboard |
| `section` | String | yes | enum: `main_actions`, `footer`, `navbar` | compound | Where the link shows |
| `internalHref` | String | no | non-empty, ≤ 512 | — | If internal route (optional) |
| `enabled` | Boolean | yes | default true | compound `(section, enabled)` | Toggle in dashboard |
| `displayOrder` | Number | yes | ≥ 0 integer | compound `(section, displayOrder)` | Order |
| `slug` | String | yes | unique, ≤ 64 | unique | Dashboard edit URL: `/dashboard/links/<slug>` — auto-derived |
| `metadata` | Mixed | no | | — | Extra: target="_blank", UTM fields? — skip (plan: none), reserved for future |

**Model:** `apps/web/models/link-item.ts` — `LinkItem` + `linkRepository` (listBySection, getBySlug, update, reorder).

**Security notes:** Zod validation of URLs at API/service level; no inline HTML in title/description (React escapes); max sizes (prevent abuse).

---

## 3. Testimonial — customer reviews for landing (moderated)

`db.Testimonial` — count ~5 (curated). Distinct from `Product.Review` (legacy).

| Field | Type | Required | Validation | Index | Notes |
|---|---|---|---|---|---|
| `name` | String | yes | non-empty, ≤ 100 | — | Customer name |
| `role` | String | yes | non-empty, ≤ 64 | — | Company/org (e.g., "مقاول إنشاءات") |
| `avatarUrl` | String | no | https URL, ≤ 2048 | — | Optional |
| `rating` | Number | yes | min 1, max 5, integer | — | Stars |
| `comment` | String | yes | non-empty, trimmed, ≤ 500 | — | Text review |
| `isPublished` | Boolean | yes | default false | compound `(isPublished)` | Publish toggle |
| `isVerified` | Boolean | yes | default false | compound `(isPublished, isVerified)` | Double-gate to public; admin-verify workflow |
| `sortOrder` | Number | yes | ≥ 0 | — | Display order within page |
| `slug` | String | no | unique | — | Dashboard URL (edit/publish history) |
| `createdAt`, `updatedAt` | Date | auto | — | — | Timestamps |

**Model:** `apps/web/models/testimonial.ts` — `Testimonial` + `testimonialRepository` (getAll, getPublishedVerified(public), upsert, togglePublish, toggleVerified, delete, paginate).

**Security notes:**
- Comment is `String` — React escaping prevents XSS (no `dangerouslySetInnerHTML`).
- No HTML in input; max length enforcement (Zod) prevents spam.
- `avatarUrl` validated https URL.
- **Separation:** Google Maps reviews live externally — never imported/duplicated here. |

---

## 4. BrandSettings — font configuration (singleton)

`db.BrandSettings` — singleton. Fields:

| Field | Type | Required | Validation | Index | Notes |
|---|---|---|---|---|---|
| `slug` | String | yes | `"default"` unique | — | Singleton marker |
| `primaryArabicFont` | String | yes | enum: `cairo`, `readexPro` | — | Default `cairo` (BRAND_AND_UI_UX §1.4); `readexPro` used for hero headings (display role) — mapping decided in DECISIONS §A2 |
| `primaryEnglishFont` | String | yes | enum: `inter` | — | Default `inter` |
| `monospaceFont` | String | yes | enum: `jetbrains-mono` | — | Default for SKU/phone display |

**Model:** `apps/web/models/brand-settings.ts` — `BrandSettings` + `brandSettingsRepository`.

---

## 5. Legacy Models — status & notes

| Model | Status |
|---|---|
| `User` | **Enhanced (plan):** add `lastLoginAt`, `failedAttempts`, `lockoutUntil`, `passwordChangedAt`. `role` stays `customer`/`manager`/`admin`. |
| `Product`, `Brand`, `Category`, `Order`, `Address`, `Cart`, `Wishlist`, `Coupon`, `Content`, `Activity`, `AuditLog`, `Review` | Legacy e‑commerce models — remain in DB; ignored by new public surfaces (see DECISIONS). |

---

## 6. Indexes Summary (target)

| Collection | Index | Type | Reason |
|---|---|---|---|
| `Company` | `slug` | unique, partial | Singleton access |
| `LinkItem` | `(section, enabled, displayOrder)` | compound | Landing query pattern |
| `LinkItem` | `slug` | unique | Edit link by slug |
| `Testimonial` | `(isPublished, isVerified, sortOrder)` | compound | Public query pattern |
| `Testimonial` | `slug` | unique, sparse | Edit testimonial by slug |
| `User` | `email` | unique | Auth lookup |
| `User` | `role` | partial | Staff guard |
| `AuditLog` | `(timestamp desc)` | | Feed pagination |
| `Activity` | `(timestamp desc)` | | Feed pagination |
| `Content` (legacy) | `section` | unique, partial | Frozen compat |

**Index plan note:** Atlas partial indexes where needed (e.g., only published testimonials need fast queries; keep low). No analytics counters in DB (rate limit store Redis/DB; avoid counter maintenance — analyze via Aggregates on read).

---

## 7. Security Considerations (DB-level)

- **Password hashing** — server-side (bcryptjs 12 or later argon2); `passwordHash` field stays (not returned to clients).
- **Env vars** — `MONGODB_URI` from `.env.local`; `lib/env.ts` `required()` — ensure it isn't exposed to client (it isn't; it's server-only by naming convention + tree).
- **ObjectId exposure** — internal only (session carries `user._id.toString()`); dashboard pages don't leak IDs in URLs (URLs use slugs).
- **No cross-user data leakage** — public queries return only published+verified items; internal routes gated.
- **Input validation** — two layers: mongoose schema validators + service/API Zod. Both required (defense in depth).
- **SSRF** — upload routes proxy to Cloudinary (existing). URL fields validation before save.
- **Audit** — all admin actions recorded (`AuditLog`), including Testimonial/Link/Company changes.

---

## 8. Migration / Legacy Mapping

| Legacy source | Target | Notes |
|---|---|---|
| Old `Content` doc `company` (from `services/content.service.ts: FALLBACK.company + seed script) | `Company` doc (slug `"default"`) | Seed script reads old doc if exists. |
| `landing-data.ts:testimonials` (hardcoded) | `Testimonial` docs — seed (published=true, verified=true) | Note: legacy used company name/role; name + role in `Testimonial`. |
| `landing-data.ts:navLinks` | static config — **Decision (§12)**: nav links remain static (UX chrome, not dynamic content). |
| Old `Content` sections (hero, footer, company stats) | Seed `Company` + `BrandSettings`; footer links → `LinkItem.section="footer"` (dynamic, from DB); small stat numbers (years/products) → static defaults in landing code. |
| Product/Order/etc. | Unchanged — used for e‑commerce (audit → remove if removed). |

**Migration script:** `apps/web/scripts/migrate-to-reda.ts` (tsx):
1. Read legacy `Content` docs (`getBySection(["company", "footer", "hero", "trust", "statistics", ...])`).
2. Upsert `Company` singleton (from `FALLBACK.company` + legacy overrides + hardcoded defaults for missing).
3. Upsert `BrandSettings` singleton (defaults).
4. Create/verify indexes.
5. Upsert `Testimonial` seed (published+verified, sortOrder 0-4).
6. Upsert footer LinkItems (default values, disabled? — enabled by default false until admin enables — to avoid showing unverified stat links? — footer should be safe: enable footer links only when admin enables).
7. Log summary (counts).

---

## 9. Query Patterns & Access Patterns

- **Landing SSR (hot path):** `getOrCreateDefaultCompany()` (cache 60s?), `linkRepository.listBySection("main_actions", true)`, `testimonialRepository.getPublishedVerified()`.
- **Dashboard pages:** `companyRepository.getDefault()`, `linkRepository.listAll()`, `testimonialRepository.getAll(filters)`, `userRepository.findByEmail()`.
- **Auth:** `userRepository.findByEmail()`, session decode (JWT).
- **Public API:** `/api/company` → `getOrCreateDefaultCompany()`; `/api/links` → `listBySection(section, true)`; `/api/testimonials` → `getPublishedVerified()`.
- **Indexes:** compound indexes above; `explain()` queries via Atlas.

---

## 10. Connection & Persistence Notes

- `lib/db.ts` — retained (connectDB, mongoose cache).
- Atlas replica set (existing config in `.env.local`).
- `mongoose.models.X ?? mongoose.model(...)` pattern — retained for compat.
- `bufferCommands: false` — retained.
- `retryWrites` defaults — OK.

---

**End of DATABASE_DESIGN.md**
