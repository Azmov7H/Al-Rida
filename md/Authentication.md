# Authentication Architecture

## Al Reda Hardware E-Commerce

---

# Objective

Define the authentication and authorization model for the Al Reda platform. The system must secure both the customer storefront and the admin dashboard, support role-based access control, and remain stateless, scalable, and resistant to common web attacks.

---

# Approach

* JWT Authentication
* HttpOnly Cookies
* Role Based Access Control (RBAC)
* Server-side session verification via Next.js Middleware

The platform does not use server-side session storage. A signed JWT is issued on login, stored in an HttpOnly cookie, and verified on every protected request.

---

# Roles

* Customer
* Admin
* Manager

Permissions

```
Customer

  View products
  Manage cart
  Place orders
  Manage wishlist
  Manage profile
  View own orders

Manager

  Everything a Customer can do
  View inventory
  Manage products
  Manage categories
  Manage brands
  Manage orders
  View reports

Admin

  Everything a Manager can do
  Manage users
  Manage roles
  Manage coupons
  Manage website content
  Manage settings
```

---

# Authentication Flow

```
            Login Form
                │
                ▼
        Validate Credentials
        (Zod + bcrypt)
                │
        ┌───────┴───────┐
        │               │
     Invalid          Valid
        │               │
        ▼               ▼
     Error         Sign JWT
     Message       (access + refresh)
                       │
                       ▼
              Set HttpOnly Cookies
                       │
                       ▼
                 Redirect by Role
```

---

# Token Strategy

## Access Token

* Short lived (15 minutes)
* Stored in HttpOnly cookie
* Used to authorize API and Server Action requests

## Refresh Token

* Long lived (7 days)
* Stored in HttpOnly cookie (separate name)
* Used to issue new access tokens
* Rotation enabled on refresh

## Cookie Attributes

```
HttpOnly: true
Secure: true (production)
SameSite: Lax
Path: /
```

---

# Request Lifecycle

```
        Incoming Request
                │
                ▼
        Next.js Middleware
                │
        ┌───────┴───────┐
        │               │
   No Token        Token Present
        │               │
        ▼               ▼
   Public Route    Verify JWT
   Allowed              │
                  ┌─────┴─────┐
                  │           │
               Invalid     Valid
                  │           │
                  ▼           ▼
            Redirect      Attach user
            to /login     context
                  │           │
                  │           ▼
                  │      Role Gate (RBAC)
                  │           │
                  │     ┌─────┴─────┐
                  │     │           │
                  │  Forbidden   Allowed
                  │     │           │
                  │     ▼           ▼
                  │  401 / 403   Render Route
```

---

# Route Protection

## Public Routes

* `/`
* `/shop`
* `/products/*`
* `/categories/*`
* `/brands/*`
* `/login`
* `/register`

## Protected Customer Routes

* `/cart`
* `/checkout`
* `/wishlist`
* `/orders/*`
* `/profile`

## Protected Admin Routes

* `/dashboard/*`

Middleware enforces authentication before reaching protected routes. Server Actions additionally verify the role on the server to prevent privilege escalation from tampered clients.

---

# Password Security

* Hashing Algorithm: bcrypt
* Salt Rounds: 12
* Plaintext passwords are never stored
* Password strength enforced at validation boundary

---

# Security Controls

* HttpOnly Cookies (no client-side token access)
* CSRF Protection (SameSite cookies + origin checks)
* Rate Limiting on login and token refresh
* XSS Protection via input sanitization and CSP headers
* Input Validation with Zod on every boundary
* Secure Headers (HSTS, X-Content-Type-Options, etc.)
* RBAC Authorization on both middleware and server actions

---

# Logout

```
        Logout Request
                │
                ▼
     Clear Access Cookie
                │
                ▼
     Clear Refresh Cookie
                │
                ▼
     Invalidate Refresh Token
     (denylist / rotation)
                │
                ▼
          Redirect to Home
```

---

# Error States

```
401 Unauthorized      Missing or expired token
403 Forbidden         Authenticated but wrong role
422 Validation Error  Invalid login payload
429 Too Many Requests Rate limit exceeded
```

---

# Future Enhancements

* Email verification on registration
* Two Factor Authentication (2FA)
* OAuth providers (Google, Apple)
* Account lockout after failed attempts
* Device tracking for refresh tokens
