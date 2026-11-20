# SECURITY PLAN — Al-Reda Digital Business Platform

**Date:** 2026-11-20  
**Version:** 1.0  
**Summary:** Hardening of existing auth (JWT+bcryptjs) + new controls: Argon2id optional, lockout, session rotation, jti invalidation, rate-limit-backend, CSP tightening, audit extension. New public routes: `/api/company`, `/api/links`, `/api/testimonials` — public-safe by design.

---

## 1. Objectives

- [ ] No regressions in staff login/logout flows (keep working).
- [ ] Staff area: strong auth, short-lived sessions, rotation on password change.
- [ ] Public: unchanged attack surface (links are http(s) only).
- [ ] Dashboard: Zod-validated, CSRF-checked mutations; rate-limited.
- [ ] Secrets: none in repo; `.env.local` non-committed (already gitignored).
- [ ] OWASP basics: XSS (React), CSRF (double-submit), header hardening, CSP, input validation, XXE (none — JSON only), security headers.

---

## 2. Authentication & Authorization

### 2.1 Authentication (existing — hardened)

| Mechanism | Current | Plan |
|---|---|---|
| Session creation | JWT sign (jsonwebtoken, default alg HS256) → cookie `session` | Same; **add `iat`** (already present by default) |
| Session storage | None (stateless JWT + cookie) | Keep; add `jti` claim |
| Cookie flags | httpOnly, secure: production, sameSite: lax, path: / | Same; consider `__Host-`-prefixed cookie naming (requires Secure + no Domain) — decision at P5 (§6.2 A5). |
| Token TTL | 7 days | Keep 7d? — reduce to 24h + refresh? — decision point (§4, A6) |
| Password hashing | bcryptjs 3.0.3, SALT_ROUNDS=12 | Keep; **switch to Argon2id (`argon2` package, w/ hash options: m=65536,t=3,p=4)** — (pending offline; optional upgrade) — put on roadmap (P5.B) |

### 2.2 Staff Authorization

- [ ] `requireRole(role, "manager")` guard for dashboard + API (existing `lib/auth/guard.ts`).
- [ ] `proxy.ts` — UPDATE: dashboard routes require manager; `/api/*` — separate matrix (public, staff, mutations). (Current `proxy.ts` — keep semantics; extend for public GET routes.)
- [ ] `hasRole` — existing utility — `customer`(0) < `manager`(1) < `admin`(2) — no change needed? Keep (decision: no — locked).
- [ ] **Passwords**: hash + store — `passwordHash` — never exposed (user routes audit: `/api/users/password` — changePassword has auth — confirmed plan item).

### 2.3 Login Flow Hardening (P5)

| Control | Status | Plan |
|---|---|---|
| Rate limit login (5/15s) | ✅ existing | Keep; **Redis-backed or DB-backed** (§3); add `X-RateLimit-*` headers (nice-to-have); lock to 5/5min per IP+account. |
| Account lockout (5 fails) | ❌ | Add: `failedAttempts` (int), `lockoutUntil` (Date) — verify in `verifyCredentials` + lock. |
| Credentials comparison | bcrypt.compare (constant time) | Keep (planned argon2 for future). |
| Login events | audit.log | Add `auth.login.success/failure` w/ ip + user agent — extend audit table. |
| Slow-response attack (login brute) | rate-limit | ✓ via rate-limit + failure counting. |
| Token DoS (long JWT list) | — | N/A — single JWT, 7d. |
| Password spray — rotated IPs | — | Reduce lockout window 10m; user reset flow exists. |
| `forgot`/`reset` flow | existing API — review + add ip rate limit on `/api/auth/forgot-password` & reset — extend. |

### 2.4 Logout & Revocation

- [ ] `logout` — delete cookie (existing) + **revoke all active tokens** (add `revokedJti` in Redis/cache; optional for first version — decision §4.6).
- [ ] `passwordChangedAt` check — next session creation sets `iat` (auto); older tokens: extend `SessionPayload` w/ `passwordChangedAt`; `getSession()` rejects if `iat < payload.passwordChangedAt`.

---

## 3. Rate Limiting (Redis-backed, with in-mem fallback)

- [ ] Store: Redis if available (`redis` pkg? — decision §4 — else in-mem with warmup note). 
- [ ] Sliding window (per IP) for: `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot`, `/api/auth/reset`, and `/api/auth/verify-email`.
- [ ] New: `/api/auth/revoke` rate-limited.
- [ ] Global: limit mutations per user: `dashboard/*` Server Actions rate-limited at 5/min (Planning.md note — implement later, v1 maybe basic).
- [ ] Public route: `/api/company`, `/api/links`, `/api/testimonials` — rate-limit: 10/min per IP (abuse prevention).

---

## 4. CSRF Protection

| Path | Mechanism | Details |
|---|---|---|
| Server Actions (dashboard) | double-submit (`csrfToken` field + cookie) | Existing (`lib/security/csrf.ts`) — extend to new dashboard actions. |
| `/api/**` mutating routes (PUT/POST/DELETE) | double-submit (header + cookie) | Extend existing. |
| Public GETs | N/A (safe) | ✓ |

Additional controls:
- [ ] Rotate CSRF cookie after login.
- [ ] CSRF failure logging (`csrf_failure` — extend to include endpoint).
- [ ] SameSite=Lax + no SameSite=None without Secure (existing).
- [ ] Cookie `Secure` on all envs — recommend HTTPS everywhere.

---

## 5. Headers & Hardening (Updated from §6 audit)

| Header | Value | Notes |
|---|---|---|
| CSP | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com https://*.googleapis.com; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` | Tightened: remove `https://images.unsplash.com` after asset migration? — upgrade list — local `/images/`? (§3 SEO_AND_PERFORMANCE — decision §4); add `https://fonts.googleapis.com` for Google Fonts; **add `upgrade-insecure-requests`?** — maybe not (site not fully https? — recommend). |
| X-Frame-Options | `DENY` | ✓ existing |
| X-Content-Type-Options | `nosniff` | ✓ |
| Referrer-Policy | `strict-origin-when-cross-origin` | ✓ |
| Permissions-Policy | camera=(), geolocation=(), microphone=(), payment=(self) | ✓ + extend: `payment` for instaPay on Next site — ok. |
| HSTS | max-age=63072000; includeSubDomains; preload | ✓ (2y) — verify preload once deployed. |
| Strict-Transport-Security on `/api/auth/*` | — | Same as HSTS. |
| Server header | Audit — `x-powered-by` disabled by default on Vercel — keep (documented). |

---

## 6. Input Validation (Zod)

- [ ] **Every** external URL field: `z.string().url().max(2048).refine(v => https?.✔)` — plus `url.parse()` allowlist (protocol http/https, no userinfo).
- [ ] ZIP/phone: `+20 1234 5678` format validation (regex), E.164 for WhatsApp numbers.
- [ ] Titles/comments: max length via Zod (coverspaces), no HTML allowed (inputs: `React escape` only; no dangerouslySetInnerHTML).
- [ ] All server actions: `z.object(...).parse(input)` + `.safeParse` — never trust FormData types; coerce safely.
- [ ] Upload: filename/extension/mime allowlist (image/*), size caps (≤ 5MB), MIME verify (don't trust Content-Type — verify magic or use Cloudinary signature).
- [ ] File: audit — upload routes — additional sanitization (validate image headers via sharp `input-formats`? — sharp already in stack? — plan: use sharp `.metadata()`).

---

## 7. XSS & Injection Prevention

- [ ] React escaping — verify no `dangerouslySetInnerHTML` (audit confirmed — none).
- [ ] Textarea `spellcheck` off for numeric fields; `input type=number` semantics.
- [ ] `aria` labels for icon buttons.
- [ ] Header injection — set via Next.js (no manual header injection).
- [ ] Response headers — via `next.config.ts` headers() (static) + proxy.ts (dynamic).
- [ ] Template literals — never for SQL (no SQL!).
- [ ] MongoDB injection — use mongoose query API (no raw).
- [ ] `javascript:` hrefs — forbid (URL validation covers).
- [ ] If `dangerouslySetInnerHTML` later: add DOMPurify.

---

## 8. Secrets Management

- [ ] Env validation: `lib/env.ts` — add `JWT_SECRET` — FAIL FAST (`throw`) in production — currently logs only (§6 audit). (`process.env.NODE_ENV === "production"` hard fail).
- [ ] `.env*` — gitignored — audit ✓; add `.env.local.example` template with required vars (`MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`) — plan doc + sample.
- [ ] Scan: `grep -r "API_KEY\|SECRET\|TOKEN" apps/` — periodic; automated grep script — plan; add a small `npm run scan` script? (maybe): but **can't modify package.json** (§12) — but CAN add new scripts later? (no). Alternative: use code comments (`docs/ADMIN_TOOLING.md` — planning stage).
- [ ] Atlas key:
  - `CLOUDINARY_URL` — upload routes — audit (existing).
  - Optional: Cloudinary unsigned upload API restriction — plan for hardening (signed mode) — consult later.
- [ ] AWS Keys — NONE — documented as current security model (file://?). (Plan.)
- [ ] Keyring? — N/A — on Vercel.
- [ ] Secrets scanning — GitHub Codespaces — plan later if needed.

---

## 9. Audit & Logging (Extended)

Events:
- ✅ Existing: `auth.login.failure` (rate-limit), `auth.login.success`, `auth.register`, `auth.logout` (plan — add to destroySession/actions), `forgot-password` request event.
- New: `password.change` — auth event — logActivity/audit — action: `user.password_changed`, target user_id.
- New: `company.edit/create/delete`, `link.upsert/delete/reorder`, `testimonial.upsert/publish/unpublish/verify/delete`, `font.save`, `address.edit`, `profile.update`, `settings.update`.
- New: `csrf_failure`, `rate_limit_exceeded`, `auth_forbidden`, `public_404`? (plan later).

---

## 10. Security Testing (P5)

- [ ] Manual: BurpSuite-lite style scans (XSS, CSRF tokens presence, CSP config, HSTS headers).
- [ ] Auth:
  - Login no-cookie → 401, role access (login as admin → dashboard; login as customer → redirect or 401).
  - Unauthenticated GET /dashboard → redirect /login.
  - /api/company no auth → 401/403.
- [ ] CSRF: mutating endpoint w/o token → 403.
- [ ] Rate limit: 5+ logins → 6th → 429.
- [ ] Rate limit: N+1 API mutations → 429.
- [ ] URL validation: javascript: `javascript:alert(1)` → rejected.
- [ ] Input injection: name = `"><script>` → stored & displayed as text (React).
- [ ] SQL — N/A — MongoDB — raw queries only in repos (audit once).
- [ ] SQL injection — N/A.
- [ ] File upload: exe → rejected.
- [ ] Session: change cookie → new session; staff logout → previous session invalid.
- [ ] OWASP: OWASPZAP scan → low-grade ZERO.
- [ ] `sqlmap`? — N/A.
- [ ] Nmap-lite: `nmap -Pn 127.0.0.1 -p 80,443,3000`.

---

## 11. New Public Route Security (`/api/company`, `/api/links`, `/api/testimonials`)

- [ ] Rate limit 10/min/IP.
- [ ] No sensitive fields in JSON responses: whitelist projection:
  - `/api/company` → return Company singleton with `whatsAppNumber` (public anyway), exclude any internal-only fields (none exist, but ensure `_id` not exposed).
  - `/api/links` → return LinkItem w/ title/description/url/iconKey/section/displayOrder/enabled.
  - `/api/testimonials` → published+verified projection: name, role, rating, comment, avatarUrl, createdAt (no slug/isPublished, sorted).
- [ ] Content-Type: `application/json` w/ CSP-safe connect-src (no unsafe-inline).
- [ ] Response headers via proxy.ts (already).
- [ ] Cached where possible (ISR/revalidate, next/navigation).

---

## 12. Configuration & Infrastructure Security

| Item | Recommendation | Plan |
|---|---|---|
| Env files | `.env*` gitignored — README/docs add sample (`docs/ENV.example`? — plan doc) | 
| Domain | HTTPS only (SaaS + HSTS) | 
| Cookies | Default secure; `__Host-` naming — consider for stronger isolation (v2; note risk: cookie rename invalidates all sessions — that's OK). |
| Hosting | Vercel — requires DNS setup — plan doc for owners (§8 RISKS_AND_MIGRATION) |
| DB | Atlas TLS — audit: `?ssl=true` in URI — already present — ✓ |
| DNS | CNAME to Vercel; TTL low on cutover | 
| Cloudinary | CSP allow `https://res.cloudinary.com` (audit; present), add in new CSP headers list (§5) |
| NPM | `pnpm` — no vulnerabilities (audit later: `pnpm audit`) |

---

## 13. Decisions & Alternatives (See DECISIONS_AND_ASSUMPTIONS.md for the Formal Record)

**ACCEPTED (alternative) — Argon2id instead of bcryptjs.**  
Rationale: Argon2id is the OWASP-recommended hash; but "bcryptjs 3.0.3 SALT_ROUNDS=12" is strong enough (per OWASP). Pick argon2 if security team mandates. — **Formal decision: P5.B — adopt Argon2id — REQUIRES new dep (but §12 says NO NEW DEPS for P0-P4).**

**REJECTED — External auth (e.g., next-auth).**  
Rationale: lightweight custom better matches existing stack + no extra auth complexity; login/logout/password flows already exist.

**REJECTED — Redis as required dependency now.**  
Rationale: in-mem rate-limit is acceptable for low-traffic business card site; Redis upgrade path kept (§3).

**REJECTED — Self-signed certs.**  
Rationale: HTTPS is required.

**ACCEPTED — CSRF double-submit with nonce in cookie.** (existing pattern — KEEP.)

---

## 14. Security Testing Verification Checklist (P7)

- [ ] Rate limits with 10 parallel attempts — verify.
- [ ] 401/403 responses well-defined — verify.
- [ ] No sensitive data in JS bundles (grep client chunks for API keys).
- [ ] Dynamic import boundaries OK (no secrets in client chunks).
- [ ] Console warnings cleared.
- [ ] `preexec`: `grep -rn "api_key\|API_KEY" --include="*.ts*" apps/web/app --exclude-dir=node_modules` — returns nothing.
- [ ] Server actions boundaries: `React Server Components` — no secrets in client hydration.

---

## 15. Compliance & Standards Mapping (Back to §9 Brief)

| Requirement | Where it lives |
|---|---|
| Secure admin auth | §2 |
| Password hashing (Argon2id or alt) | §2.1/§13 |
| HTTP-only cookies | §2.1 (existing) |
| Session expiration & renewal | §2.1 (existing + rotation plan) |
| Server-side authorization | §2.2 |
| Role-based access (multiple admins) | §2.2 (single admin for now — decision §4) |
| Login rate limiting | §3 |
| CSRF protection | §4 |
| Zod validation | §6 |
| Output sanitization | §7 |
| XSS/injection protection | §7 |
| Secrets management | §8 |
| URL validation | §6 |
| Unauthorized API access protection | §11 |
| Security headers | §5 |
| Audit logging | §9 |

**Cross-reference:** System Requirements in `PRODUCT_REQUIREMENTS.md` §8.

---

**End of SECURITY_PLAN.md**
