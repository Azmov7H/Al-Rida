# API Routes Architecture

## Al Reda Hardware E-Commerce

---

# Overview

The API layer is built using **Next.js 16 Route Handlers** following a modular, RESTful architecture. Every endpoint is organized by business domain, protected with authentication and authorization where required, and designed to support future integrations such as ERP systems, payment gateways, mobile applications, and third-party distributors.

---

# Design Goals

* RESTful API Design
* Modular Structure
* Feature-Based Organization
* JWT Authentication
* HttpOnly Cookies
* Role-Based Authorization (RBAC)
* Request Validation
* Standardized Responses
* Rate Limiting
* Scalable Architecture
* API Versioning Ready

---

# API Structure

```text
app
└── api
    ├── auth
    ├── users
    ├── products
    ├── categories
    ├── brands
    ├── inventory
    ├── cart
    ├── wishlist
    ├── checkout
    ├── orders
    ├── reviews
    ├── search
    ├── upload
    ├── dashboard
    ├── analytics
    ├── contact
    ├── settings
    └── webhooks
```

---

# Authentication APIs

```text
POST   /api/auth/register

POST   /api/auth/login

POST   /api/auth/logout

POST   /api/auth/refresh

POST   /api/auth/forgot-password

POST   /api/auth/reset-password

POST   /api/auth/verify-email

GET    /api/auth/session
```

---

# Users APIs

```text
GET     /api/users/me

PATCH   /api/users/me

PATCH   /api/users/password

PATCH   /api/users/avatar

DELETE  /api/users/me

GET     /api/users/addresses

POST    /api/users/addresses

PATCH   /api/users/addresses/:id

DELETE  /api/users/addresses/:id
```

---

# Products APIs

```text
GET     /api/products

POST    /api/products

GET     /api/products/:id

PATCH   /api/products/:id

DELETE  /api/products/:id

PATCH   /api/products/:id/status

PATCH   /api/products/:id/stock
```

Supports

* Pagination
* Search
* Filtering
* Sorting
* Brand
* Category
* Stock
* Featured
* Best Seller

---

# Categories APIs

```text
GET

POST

PATCH

DELETE

/api/categories
```

---

# Brands APIs

```text
GET

POST

PATCH

DELETE

/api/brands
```

---

# Inventory APIs

```text
GET

/api/inventory

PATCH

/api/inventory/:id

POST

/api/inventory/adjustment

GET

/api/inventory/history
```

---

# Cart APIs

```text
GET

/api/cart

POST

/api/cart/items

PATCH

/api/cart/items/:id

DELETE

/api/cart/items/:id

DELETE

/api/cart/clear
```

---

# Wishlist APIs

```text
GET

/api/wishlist

POST

/api/wishlist

DELETE

/api/wishlist/:id
```

---

# Checkout APIs

```text
POST

/api/checkout

POST

/api/checkout/validate

POST

/api/checkout/payment

POST

/api/checkout/complete
```

---

# Orders APIs

```text
GET

/api/orders

POST

/api/orders

GET

/api/orders/:id

PATCH

/api/orders/:id

PATCH

/api/orders/:id/status

PATCH

/api/orders/:id/payment

DELETE

/api/orders/:id
```

---

# Reviews APIs

```text
GET

/api/reviews

POST

/api/reviews

PATCH

/api/reviews/:id

DELETE

/api/reviews/:id
```

---

# Search APIs

```text
GET

/api/search

GET

/api/search/suggestions

GET

/api/search/popular
```

---

# Upload APIs

```text
POST

/api/upload/image

POST

/api/upload/document

DELETE

/api/upload/:id
```

---

# Contact APIs

```text
POST

/api/contact

GET

/api/contact/messages

PATCH

/api/contact/messages/:id
```

---

# Dashboard APIs

```text
GET

/api/dashboard/stats

GET

/api/dashboard/revenue

GET

/api/dashboard/orders

GET

/api/dashboard/products

GET

/api/dashboard/customers
```

---

# Analytics APIs

```text
GET

/api/analytics/sales

GET

/api/analytics/products

GET

/api/analytics/customers

GET

/api/analytics/inventory
```

---

# Settings APIs

```text
GET

/api/settings

PATCH

/api/settings
```

---

# Webhooks

```text
POST

/api/webhooks/paymob

POST

/api/webhooks/paytabs

POST

/api/webhooks/erp
```

---

# Request Lifecycle

```text
Client

↓

Middleware

↓

Authentication

↓

Authorization

↓

Rate Limiter

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

MongoDB

↓

Response
```

---

# Response Format

Success

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {},
  "meta": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [],
  "status": 400
}
```

---

# Pagination

Query

```text
?page=1

&limit=20
```

Response

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

# Filtering

Examples

```text
?category=locks

?brand=al-ahram

?available=true

?featured=true

?sort=newest
```

---

# Authentication

Uses

* JWT Access Token
* Refresh Token
* HttpOnly Cookies

No Local Storage.

---

# Authorization

Roles

```text
Guest

Customer

Manager

Admin
```

Permissions enforced using RBAC middleware.

---

# Validation

Library

* Zod

Every request is validated before reaching the business layer.

---

# Error Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 204  | No Content            |
| 400  | Validation Error      |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Resource Not Found    |
| 409  | Conflict              |
| 422  | Invalid Data          |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---

# Security

* HttpOnly Cookies
* CSRF Protection
* XSS Protection
* Secure Headers
* Input Sanitization
* Rate Limiting
* Request Logging
* Audit Logs
* Password Hashing (bcrypt/Argon2)
* Helmet Headers
* CORS Configuration

---

# Folder Structure

```text
app
└── api
    ├── auth
    ├── users
    ├── products
    ├── categories
    ├── brands
    ├── inventory
    ├── cart
    ├── wishlist
    ├── checkout
    ├── orders
    ├── reviews
    ├── analytics
    ├── dashboard
    ├── search
    ├── upload
    ├── contact
    ├── settings
    └── webhooks

lib
├── auth
├── database
├── validators
├── middleware
├── services
├── repositories
├── utils
└── responses
```

---

# Future Integrations

* ERP Integration
* Warehouse Management System (WMS)
* CRM Integration
* Mobile Applications
* WhatsApp Business API
* SMS Gateway
* Payment Gateways
* Shipping Providers
* AI Product Recommendation Engine
* Elastic / Atlas Search

---

# Final Vision

The API should serve as a secure, scalable, and maintainable backend foundation for the Al Reda platform. It must support high-performance product browsing, secure authentication, order management, inventory operations, and future enterprise integrations while following clean architecture principles and modern REST API best practices.
