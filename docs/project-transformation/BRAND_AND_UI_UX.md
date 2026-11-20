# BRAND & UI/UX — Al-Reda Digital Identity

**Date:** 2026-11-20  
**Status:** Design specification (planning). Revisions go into this single file.

> The brand speaks: **Security. Trust. Premium craftsmanship. Professionalism.** — the feel of a
> door opening onto a well‑fitted handle room, not a "link‑in‑bio" template. Modern, architectural,
> letter‑pressed, mostly‑white with confident navy, amber as warm accent.

---

## 1. Brand Identity

### 1.1 Name & Taglines
- **Name (Arabic):** الرضا  
- **Name (Latin/International):** Al‑Reda (`siteConfig.name` — keep current: "Al Rida"? — decide in DECISIONS)
- **Tagline (Arabic):** "حلول مثلية لأوكر الأبواب والأقفال" (Premium solutions for door handles & locks)
- **Tagline (English):** "Security & Craftsmanship, Made Premium"
- **Mission statement (Arabic):** "شركة الرضا: موزع معتمد لأدوات الأبواب (أوكر/أقفال/كوالين)، تقدم حلولاً أصلية عالي الجودة من بلدك."

### 1.2 Logo Direction
Logo = **M-shape / door‑arrow device** + wordmark, two styles:

| Variant | Use |
|---|---|
| **Full wordmark** | Landing header, dashboard header, social OG images. |
| **Isolated device mark** (monogram‑ish) | Favicon, QR destinations, micro‑cards. Design: horizontal arch "M"-like swirl formed by an open door leaf, with a door‑frame outline; the gap between door halves suggests an opening. |
| **Wordmark only** | Login card, footer, fallback if logo asset missing. |

Rules:
- Logo rendered at 24–48px on light backgrounds; dark text on light, inverted white on dark/CTA backgrounds.
- SVG source in `apps/web/public/brand/alreda-logo.svg`; raster favicon from same source.
- No logo in onboarding of clients (not our flow).
- Never animate the logo — pure brand stamp; door animation tells the story.

### 1.3 Color System (professional, architectural, security‑aware)

Primary + secondary + neutrals + semantic:

| Token | Value | Role | Notes |
|---|---|---|---|
| `--color-primary` | `#0F3B73` (Navy Deep) | Primary, brand anchor | Trust, security, depth. Used for header bg, logo device, CTA, links, badge, security tiles. |
| `--color-accent` | `#F58220` (Amber) | Accent, warmth | "Living security": used sparingly — wallet/InstaPay/reviews CTAs, active states, marketing highlights. |
| `--color-canvas` | `#F8FAFC` (Off‑white) | Page background, section alt | Airy premium; avoids clinical white. |
| `--color-surface` | `#FFFFFF` | Cards, panels, modals | True white for depth contrast. |
| `--color-line` | `#E2E8F0` | Borders, dividers, shadows ring | Ultra‑soft lines for layout. |
| `--color-ink` | `#1E293B` (Slate) | Text default | High contrast on light. |
| `--color-muted` | `#475569` (Slate‑mid) | Sub‑text | Body copy secondary. |
| `--color-faint` | `#94A3B8` | Disabled/placeholder, small labels | |
| `--color-danger` | `#B91C1C` (Deep Red) | Errors, destructive | |
| `--color-success` | `#16A34A` (Green) | Published/OK states | Verified badge, success actions. |
| `--color-security` | `#0F3B73` (reuse of primary) | Security tiles, trust/vouched marks | Semantic — reused from primary, identifies "security/trust" UI (glow, border, accent text) |

Palette notes:
- Keep neutral ramp 8 values (50→950) extended to serve every UI use.
- Amber used only where warmth conveys "living, trusted" value: wallet/payments, reviews, insta‑pay.
- Navy is the anchor — builds credibility and reads as premium on mobiles.

### 1.4 Typography System (Arabic‑first)

| Role | Font | Weights | Hosting | Notes |
|---|---|---|---|---|
| **Arabic Primary (UI + headings)** | **Cairo** (Google Fonts) | 400, 500, 600, 700, 800 | `next/font/google` — **Optimized, CDN, zero repo bloat.** | Modern, legible, distinctly Arabic. Fallback stack: `system-ui, sans-serif`. |
| **Arabic Display (hero headings, brand name)** | **Readex Pro** (Google Fonts) | 400, 500, 600, 700 | `next/font/google` | Modern Arabic display for hero headings; decisions about mapping: DECISIONS §A2. |
| **English UI (numbers, long copy)** | **Inter** (Google Fonts) | 400, 500, 600, 700 | `next/font/google` | Existing choice — retain. |
| **Monospace (SKU, phone, QR alt, code)** | **JetBrains Mono** (Google Fonts) | 400, 500, 600, 700 | `next/font/google` | For SKU/code values (lowercase alphanumeric). |

System fallbacks for all: robust Arabic stack (`Cairo, system-ui, sans-serif`).

Arabic typography rules:
- Text alignment: `text-start` (RTL aware); headings `font-bold` from 400.
- Arabic leading: line‑height 1.6–1.8 for body, tighter for headings.
- Optimization: `next/font` `sizeAdjust` + `fallback` — avoids CLS; subset to Arabic + ASCII + digits (plus currency symbols EUR/USD).
- Digits policy (DECISION, see §4): **Eastern Arabic digits (١٢٣)** in phone, wallet, ID-ish; **Western digits** in SKU/QR/codes. |

### 1.5 Iconography System

- **Lucide React** (existing dep) — primary icon set; Lucide includes `DoorOpen` (for do-8style features), `House`, `DoorClosed`, `ShieldCheck` etc.
- Product‑specific icons: `DoorHandle`, `DoorLock`, `Cylinder`, `SecurityShield`, `VerifiedBadge`, `AccountBook` (wallet), `Instapay` (custom SVG), `WhatsApp` (Lucide `WhatsApp`), `ExternalLink` (Lucide `SquareArrowOutUpRight`).
- **Door opening animation character:** custom CSS door (see §2).
- Custom SVG glyphs where Lucide misses: `DoorFrame`, `KeySlot`, `HandleHinge`, `CylinderGears`, etc. — static JSX components in `components/icons/` (no bundler plugins).
- All icons colored with palette tokens; size 12–16px body, 24–32px hero, touch 44×44px minimum.
- SVG files in `public/icons/` with docs; **all icons have `aria-hidden="true"` unless interactive (then aria-label present).**

### 1.6 Button & Card Design Language (design‑system v0)

**Buttons** (reuse existing `components/ui/button.tsx` + design refinements):

| Variant | Visual | Radius | Notes |
|---|---|---|---|
| `primary` (default) | `bg-primary` — navy #0F3B73, white text | 8–10px | hover `#0C2F5C`, shadow `0 2px 8px -3px rgba(15,59,115,0.35)` on hover, active `scale-[0.98]`, focus ring 3px `#0F3B73`. |
| `secondary` (accent) | `bg-accent` amber — white text | 10px | hover `#DB6F12`. |
| `outline` | white bg (on primary bg sections), border ink, hover scale down | 10px | |
| `ghost` | transparent, ink hover | 8px | |
| `danger` | new — `bg-danger` red, white | 8–10px | Used for destructive actions. |

- Size tokens: `sm` h-10 px-4 (12–14px font), `md` h-12 px-5 (14px), `lg` h-12 px-7 (base 16px). Hero buttons: `lg` + `shadow-lg` + `sm:rounded-xl`.
- Unified transitions: `transition-all duration-150`, never `0.2s`+ (too slow for micro‑actions); hover `scale` only on touch targets + explicit user actions.

**Cards:**

| Element | Style |
|---|---|
| Standard card (actions, testimonials, reviews) | `bg-surface`, `border border-line` (1px), `rounded-2xl`, `shadow-sm`, hover: `border-primary/20` + `shadow-md`, `transition-shadow 200ms`. |
| Elevated card (hero CTA tile, featured) | `bg-surface`, `rounded-2xl`, `shadow-lg` (or 2xl on mobile). |
| Card hover (interactive actions) | scale `[1.02]` on touch-active states only, minimal. |
| Card padding | hero CTA tiles: 18–24px (spaced), standard: 20–24px; phone icon tiles: p-6. |
| Radius tokens | rounded-lg 6px (small), rounded-xl 8px, rounded-2xl 12–16px (cards), rounded-full 24px (logo device). |

**Link styles** (nav/footer): `text-ink`; hover `text-primary`; `transition-colors 120ms`; `active` subtle color shift.

**Focus style (every interactive):** `focus-visible:ring-2 ring-primary ring-offset-2`.

---

## 2. Landing Page Motion & Interaction Guidelines

### 2.1 Global Motion Tokens
- Duration scale: `micro 120ms`, `standard 200–300ms`, `reveal 600–900ms`, `door total 1.1–1.5s`.
- Easing tokens:
  - Standard: `cubic-bezier(0.22, 1, 0.36, 1)` (exit) / `cubic-bezier(0.16, 1, 0.3, 1)` (entrance).
  - Floor easing for lifting tiles: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Interaction rules: hover → opacity/color/scale transitions, `will-change: transform` only for short moves.

### 2.2 Signature Door Opening Animation

**Concept:** A double‑swing door leafed by a door frame + hinge + top/bottom panels. On page mount:
1. **Stage 0 (t=0):** Closed. Door frame visible (full width, subtle shadow). Door leaf centered, closed. Main content set to `visibility: hidden`.
2. **Stage 1 (t≈0–200ms):** Door leaf starts opening: both door halves rotate inward around hinge axes. Each half: `rotateX` ±(0 → 60°), perspective origin.
3. **Stage 2 (t≈200–500ms):** Reveal — door collapses inward: each half continues rotating inward to a final ~110–125° open angle (a tiled swing: to make the door swing along top/bottom panels, rotating the top panel 0→55° and the bottom panel 0→55° inwards), with collapse animation; simultaneous: main content flips `visibility: hidden` → `visible` (synchronized to open finish, no translate during animation — content appears settled as the door opens).
4. **Stage 3 (t≈500–900ms):** Content reveals: staggered reveals: hero left column/title → right column/background → actions/buttons appear, icons pop with `scale` 0→100 + fade (icon pop 0.1s).
5. **Stage 4 (t≈900ms+):** Rest — hero visible, actions scrollable.
6. **Replay protection:** Set `sessionStorage["alredaDoorOpen"] = "1"` on open; early return if set. Client‑nav back to `/` → skip animation (content directly visible).
7. **Escape hatch:** after 2s, door locked open regardless (for slow animations); content becomes visible if not yet unlocked (e.g. heavy fonts).

**Technique choice:** CSS 3D transforms (`perspective`, `rotateX`, `transform-style: preserve-3d`) — best fit: visual realism, zero JS rAF loops, performant. Fallback: none needed (modern browsers everywhere). Alternatives evaluated: SVG path animation (can't do 3D door swing); CSS keyframes vs CSSOM animation API (CSOM not yet supported for scale; keyframes fine); JS‑driven rAF (possible, no benefit).

**Door design details (ASCII → design):**
```
┌───────────────────────────────────┐   ← door frame (top rail, thin border, hairline shadow)
│      ╔═══════════════════════╗    │
│      ║  ┌─°──────°───°─────┐ ║    │   ← door leaf: glass pane with etched symbols?
│      ║  │   door handle    │ ║    │   ← handle ring (أوكر) at vertical center; focus outline possible
│      ║  └──────────────────┘ ║    │   ← glass window + top border, leaf bottom
│      ╚═══════════════════════╝    │
│        °───°──────°──────°       │   ← hinge dots + metal hinge detail (حديد إنسك خط ✓)
└───────────────────────────────────┘
```
Design: double‑leaf door opening inward, hinged along the full side; top/bottom border panels; glass top panel of the leaf; hinge dots + a thin security‑tone ("security") stripe along the door body; subtle drop shadow of the open floor. Leaf color: `#FFFFFF` on `#F8FAFC` w/ `#E2E8F0` border + `#0F3B73` thin stripe on body left edge (security detail). Floor shadow: `rgba(15,59,115,0.12)` on open. Wall line under door frame: thin `#E2E8F0`. Door center height: mid‑viewport. Width: min(80%, 420px), flex‑centered. Door frame: light gray outline; door background matches `#FFFFFF` leaf to blend open reveal.

**Implementation approach:**
- Component: `client components/landing/door-animation.tsx` — a wrapper showing a CSS door on top of a pre‑rendered hidden content.
- Use React state for stage: `useEffect` → setTimeout chain ~500ms to "content ready", CSS keyframes for door: open (0→0.55s, 2 leaf halves in parallel), reveal (0.55→0.9s leaf skew + content visibility swap), pop (0.9→1.1s).
- Keep everything in `transform`/`opacity`/`visibility` for INP safety.
- `respect reduced motion`: `const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)")` → skip animation; set content visible immediately.
- For very old browsers (no `matchMedia` support) — fine to assume modern; guard optional.

### 2.3 Product‑Inspired Micro‑Animations (Curated)

| Feature | Effect | Trigger | Duration/Easing | Reduced‑motion alternative |
|---|---|---|---|---|
| Door handles (أوكر) | rotate handle ring ±20° on both sides | hover / tap (mouse/touch) | 160ms ease-out | animate only for desktop; 0ms on touch |
| Lock (القفال) | click lever down, spin top (like tumbler snap), brief shake of body | hover | 300ms (click: 200ms snap + 50ms shake) | none |
| Cylinder (الكوالين) | slow gentle circular wobble (2s loop) — **only when visible on screen & not reduced-motion** | hover | 2000ms ease-in-out loop | none (static) |
| Security tiles | surface scales 1→1.03 + border pulse, optional glow | hover, active | 150ms | none |
| Social action tiles | scale active states, ring flash on tap | active/tap | 100–150ms | none |
| Timeline/numbers (company numbers) | counting animation? (optional: `useAnim`) — maybe later | — | — | static number |
| Review stars | hover to fill stars (gradient or color change) | hover | 150ms | no change |

**Constraints:** Never continuously auto‑run. All animations behind `useReduceMotion` check. Selective—door is the star; micro‑anims support.

### 2.4 Motion & Interaction CSS Guidelines (document for devs)
- All transitions: `transition` shorthand `transform, opacity, scale, box-shadow, background, border-color, color, filter` w/ tokens.
- Never transition width/height (use scale or padding tricks; `no-layout-property-transitions`).
- `will-change` only where justified: `transform`, `opacity` (paint-only `background` transitions are cheap, but prefer `opacity`/`filter` variants).
- For SVG icons: prefer `fill` transitions (on chrome, on Firefox works) for hover fills.
- Touch targets: ≥44×44.

### 2.5 Accessibility Motion Guidelines
- Reduce/disable: all keyframes + hover transitions under `prefers-reduced-motion` (JS check + CSS media).
- Focus rings as specified; `:focus-visible` only.
- Verify with axe-core + Lighthouse perf/accessibility (both recommended).

---

## 3. Landing Page Layout (Mobile‑First)

### 3.1 Grid System
- Container max: `max-w-[1280px]` (good for cards + hero). Mobile: full fluid with padding.
- Mobile first: start with 1–2 column vertical rhythm; desktop at ≥1024px.
- Spacing scale (0–96 tokens: 4px base): `gap` tokens as above.
- Door animation responsive: center‑aligned on all screens.

### 3.2 Landing Sections (order — accessible, progressive disclosure, mobile first)

| # | Section | Content | Notes |
|---|---|---|---|
| 1 | **Door animation + Brand header** | Company name + tagline + short description (2 lines mobile, 1 on desktop) | Door overlay + 2‑card layout |
| 2 | **Main Action Cards (5)** | Google Maps Reviews, InstaPay, Cash Wallet, WhatsApp, Official Website — grid (mobile 1 col, desktop 5 col) | Each action in own card; on desktop 2 col to fit |
| 3 | **Testimonials** | 2–3 cards (name, rating stars, comment, avatar, date if set) — mobile 1 col, desktop 3 col | Only published+verified |
| 4 | **Why Al‑Reda (3 or 4 trust tiles)** | Security, Craftsmanship, Premium, Professionalism — icon + text | Mobile: vertical list |
| 5 | **Business in Numbers (3–4)** | Years, Products, Brands, Clients — large numbers + labels | NEW (reuse CompanyNumbers style; numbers TBD = required business data, see §11) |
| 6 | **Contact Info Tiles (3–4)** | Email, Phone, Address — larger tiles | NEW: tiles with phone/email/address |
| 7 | **Footer** | Brand logo + tagline + contact + nav links + copyright + social icons | Nav links static config (§3.2 Note); footer contact from Company data |

### 3.3 Section Base Style
- Vertical rhythm: 48–96px sections gap; mobile 24–32.
- Alternate background: `#F8FAFC` / white — consistent cream‑white palette.

---

## 4. Dashboard Design System

- Reuse landing tokens (palette, button, card styles).
- Dashboard header: stable sticky; shows company + role badge + notifications bell + logout.
- Sidebar (existing, updated): NAV to new routes; icons.
- Pages follow consistent layout: PageHeader(title+description), stats, forms.
- **Forms:** consistent input styles (4–5 fields, dark borders, 40–48px height), error messages in danger color.
- Mobile behavior: sidebar collapses (existing), pages responsive.

---

## 5. SVG Asset Strategy & Optimization

- `public/brand/` — `alreda-logo.svg`, `alreda-icon.svg`, `favicon.ico` + 2× (`favicon-16.png` fallback), apple-touch-icon.
- Optimization: all SVG vectors, `title` tags, `aria-hidden` on non-interactive, minimal files in `public/`.
- Door animation as React component (no PNG, no asset bloat).
- All landing images: external Unsplash URLs (remotePatterns allowlist) OR switch to `public/images/` local when SEO concerns mount. (Decision — see §2.3.1.)

---

## 6. Design System Package Strategy

`packages/ui` — create proper shadcn/ui scaffold per repo pattern (but no new deps — all existing). Only if beneficial: create `packages/ui` components used across app — plan to migrate `components/ui/*` there? — DECIDE (stability note: plan to move Button + shared atoms).

---

## 7. FOUC/CLS Mitigation

- No inline styles on `html` except `--font-arabic` — set via `next/font` (auto-compute).
- All animations start AFTER `content-visibility: auto` or `display: none` blocks — let document complete.
- Test CLS with web.dev metrics: target < 0.05.

---

**End of BRAND_AND_UI_UX.md**
