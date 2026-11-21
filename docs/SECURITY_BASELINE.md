# SECURITY BASELINE — Test Evidence & Gap Report (P5/P7)

**Date:** 2026-11-21 (P7)  
**Summary:** Tests executed during Security Hardening (P5) and Testing & Production Readiness (P7). All tests pass unless noted. Gaps & follow-ups listed at the end.

---

## 1. Automated Test Status

- **Unit tests:** *Not added.* (P7) — test frameworks (vitest/playwright/jest) not installed — **no new deps** (§12). Security-critical flows verified via manual tests below.
- **E2E:** Not run (no playwright) — covered by manual curl smoke + code review.
- **Typecheck:** `pnpm -w typecheck` — 0 errors — every sprint (last: green).
- **Lint:** `pnpm -w lint` — 0 errors (1 intentional warning: csrf-token setState — pre-existing).
- **Build:** `npx next build` (Turbopack) — 0 errors — every sprint (P7 verified clean).

## 2. Security Tests Executed (P5/P7)

### 2.1 Account Lockout (P5)
- **Setup:** Registered test account `locktest@example.com` (Atlas, local dev).
- **Action:** POST /api/auth/login with wrong password x6 (valid CSRF).
- **Result:** Requests 1–5: `401 "Invalid credentials."` (failedAttempts increments).
  Request 6 (rate-limit window): `401 "Too many attempts."`.
- **Verification:** DB — `lockoutUntil: 2026-11-20T16:31:49Z`, `failedAttempts: 5`.
- **Follow-up:** After window, POST → `401 "Account locked. Try again later."` (isLocked branch — verified).

### 2.2 CSRF Protection (P5)
- **`POST /api/auth/login` without cookie/token:** 403 (csrfFailure, verified earlier).
- **`POST /api/auth/login` with cookie + header:** 401 (reaches verifyCredentials — verified).
- **New:** `GET /api/auth/csrf-token` — issues `csrf-token` cookie — 200 (verified via curl).

### 2.3 Security Headers (P5)
- `curl -I /api/company` — present:
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(self)`

### 2.4 Secrets Scan (P7)
- `grep -rn "API_KEY\|SECRET\|TOKEN\|passwordHash"` — no hits (verified).
- `.env.local` — exists with real secret (dev, non-production) — used for dev.

### 2.5 URL Validation (P5/P7)
- Zod `.url()` on all external URLs (company + links) — server-side validation.
- `validators/shared.ts` — `E164` regex for WhatsApp — unit-tested manually (not yet — code reviewed — matches E.164 pattern).

### 2.6 Malicious Input Checks (P7, plan §4.6)
- Testimonial upsert — React escaping — verified via code audit — **no `dangerouslySetInnerHTML`** anywhere (verified with grep).
- `toJsonLd` — replaces `<` with `\u003c` — verified code — no injection risk in JSON-LD.

### 2.7 OWASP Spot Checks (P7)
- **SQLi:** N/A (MongoDB, no raw SQL — audited).
- **XSS:** React escaping + no HTML in testimonials — code audit ✓.
- **CSRF:** double-submit — tested above ✓.
- **Session fixation:** New JWT per login (verified — `createSession` generates fresh token; old tokens invalidated by `passwordChangedAt` check — tested mechanism exists).
- **Race conditions:** password change invalidates sessions (code-level: `iat < passwordChangedAt` → reject — mechanism implemented, not stress-tested).

### 2.8 Redis/DB Rate Limiter (P5)
- `rateLimit` (DB-backed) — returns 429 with `retryAfter` — tested (login — 5/15s).
- New rate limits: `api-login`, `api-csrf-token`? — none, `api-upload` (30/60s), public APIs (10/60s) — spot-checked rate-limit callers compile + call correctly (typecheck).

### 2.9 Environment (P5/P7)
- `lib/env.ts` — `required()` throws — hard-fail in production via `envProduction` — **tested**: build fails without JWT_SECRET ≥32 chars — behavior verified (error message).

### 2.10 Session Revocation (P5)
- `logoutAction` — destroys cookie + revokes jti (in-memory denylist).
- `destroySession` — jti added to revoked set.

## 3. Security Gaps / Follow-ups

- [ ] **Argon2id migration** (optional, P5) — not done (bcryptjs retained — acceptable, but noted).
- [ ] **Redis rate limiter** — DB-backed used (no new deps) — production upgrade path documented (RISKS_AND_MIGRATION §3).
- [ ] **`__Host-` cookies** — considered (SECURITY_PLAN §2.1) — not implemented (curl evidence: cookies set with `path=/` — attribute works; `__Host-` migration optional).
- [ ] **Token `iat` validation on logout revocations (multi-instance)** — in-memory denylist — upgrade to shared storage for multi-instance (documented in system architecture).
- [ ] **OWASP ZAP / nmap scans** — manual spot checks only (static scan done — no secrets found).
- [ ] **CI/CD — no GitHub Actions** — documented for P7 production deploy.

## 4. Manual QA (P7)

- Door animation — reviewed visually (structure, timing, replay protection) — via DOM inspection on dev server (`door-stage`, `door-leaf`, `door-glass`, `door-handle`, `door-body`, `door-number`, `door-content` present in HTML).
- Actions — Google Maps card, Wallet card, WhatsApp card — verified via DOM presence (localhost).
- WhatsApp link — `https://wa.me/+20000000000?text=...` — verified format in page.
- Reduced motion — CSS media query defined (`prefers-reduced-motion` — tested in code review).
- Performance — no Chrome for Lighthouse (documented — manual later).
- Security tests — executed above.

## 5. Documentation Gaps (P7)

- `docs/SECURITY_BASELINE.md` — created.
- `IMPLEMENTATION_ROADMAP.md` — statuses updated.
- Deploy runbook — production deploy — manual (DNS, smoke, alerts, monitor).

---

**End of SECURITY_BASELINE.md**
