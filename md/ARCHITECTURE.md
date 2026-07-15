# Al Reda Hardware E-Commerce

> Modern enterprise-grade e-commerce platform for **Al Reda**, specializing in door hardware, locks, handles, cylinders, hinges, smart locks, and accessories.

---

# Overview

Al Reda E-Commerce is a scalable full-stack platform built using modern web technologies to provide a premium shopping experience for customers while offering a powerful administration dashboard for inventory, orders, and business management.

The platform is designed with scalability, maintainability, SEO, and performance as first-class priorities.

---

# Technology Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* TailwindCSS v4
* shadcn/ui
* Framer Motion
* Lucide Icons

---

## Backend

* Next.js Server Actions
* Route Handlers
* MongoDB
* Mongoose
* Zod Validation

---

## Authentication

* JWT Authentication
* HttpOnly Cookies
* Role Based Access Control

Roles

* Customer
* Admin
* Manager

---

## Storage

Cloudinary

* Product Images
* Brand Logos
* Banner Images
* Documents
* PDFs

---

## Search

MongoDB Atlas Search

Features

* Full Text Search
* Instant Search
* Product Suggestions
* Typo Tolerance

---

## Payments

* Cash On Delivery
* Paymob
* Future Stripe Integration

---

## Deployment

Frontend

* Vercel

Backend

* Next.js

Database

* MongoDB Atlas

Assets

* Cloudinary

---

# Documentation Index

* [Architecture](ARCHITECTURE.md) — Platform overview, tech stack, system architecture
* [Authentication](Authentication.md) — JWT, HttpOnly cookies, RBAC, token strategy
* [Landing Page](Landingpage.md) — Public marketing site structure and design system
* [Products](Products.md) — Catalog model, filtering, search, media, SEO
* [Orders](Orders.md) — Order lifecycle, payments, inventory, management
* [Checkout](Checkout.md) — Checkout flow, pricing, order placement, security

---

# System Architecture

```
                        Users
                          │
                          ▼
                Next.js Application
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
 Route Handlers                     Server Actions
        │                                    │
        └─────────────────┬──────────────────┘
                          ▼
                   Business Layer
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Authentication  Products   Orders
             │            │            │
             └────────────┼────────────┘
                          ▼
                     MongoDB Atlas
                          │
              Cloudinary / External APIs
```

---

# Project Structure

```
src
│
├── app
│
├── actions
│
├── components
│   ├── ui
│   ├── layout
│   ├── shop
│   ├── dashboard
│   ├── marketing
│   └── shared
│
├── config
│
├── constants
│
├── hooks
│
├── lib
│
├── middleware
│
├── models
│
├── services
│
├── repositories
│
├── validators
│
├── types
│
├── providers
│
├── store
│
├── utils
│
├── styles
│
└── public
```

---

# Feature Modules

## Customer

* Home
* Shop
* Categories
* Brands
* Product Details
* Wishlist
* Cart
* Checkout
* Orders
* Profile

---

## Admin

* Dashboard
* Products
* Categories
* Brands
* Inventory
* Orders
* Customers
* Coupons
* Reviews
* Reports
* Website Content
* Users
* Settings

---

# Database Collections

```
users

roles

products

categories

brands

orders

orderItems

wishlists

reviews

addresses

inventoryLogs

coupons

notifications

settings

banners

pages

contacts

sessions
```

---

# Product Model

```
Product

id

name

slug

sku

barcode

brand

category

price

salePrice

cost

stock

weight

dimensions

material

finish

doorType

openingDirection

securityLevel

country

warranty

images

documents

videos

specifications

relatedProducts

tags

seo

status

createdAt

updatedAt
```

---

# Design System

## Colors

Primary

Gold

Secondary

Dark Gray

Background

Light Gray

Accent

Premium Gold

Success

Green

Warning

Orange

Danger

Red

---

## Typography

Primary

Cairo

Secondary

Inter

---

## UI Style

* Premium
* Minimal
* Enterprise
* Responsive
* Soft Shadows
* Rounded XL
* Glass Effects
* Smooth Animations

---

# Security

* HttpOnly Cookies
* CSRF Protection
* Rate Limiting
* XSS Protection
* Input Validation
* Password Hashing
* Secure Headers
* RBAC Authorization

---

# Performance

* Server Components
* Dynamic Imports
* Lazy Loading
* Image Optimization
* Streaming
* Route Caching
* Metadata Optimization
* ISR Ready

---

# SEO

* Dynamic Metadata
* Open Graph
* Twitter Cards
* Robots
* Sitemap
* Structured Data
* Canonical URLs
* Product Rich Snippets

---

# Business Features

* Advanced Product Filtering
* Brand Management
* Inventory Tracking
* Low Stock Alerts
* Order Management
* Coupon System
* Wishlist
* Compare Products
* Recently Viewed
* Request Quote
* PDF Datasheets
* Product Videos
* Installation Guides

---

# Future Roadmap

## Phase 1

* Customer Store
* Admin Dashboard
* Authentication
* Products
* Orders

---

## Phase 2

* Analytics
* Smart Search
* Recommendations
* Reports
* Notifications

---

## Phase 3

* Mobile App
* Multi Vendor
* Multi Warehouse
* AI Product Assistant
* AI Search
* ERP Integration

---

# Development Principles

* Clean Architecture
* Feature-Based Organization
* SOLID Principles
* Reusable Components
* Type Safety
* Accessibility
* Performance First
* SEO First
* Security First
* Mobile First

---

# Goal

Build the most modern and scalable door hardware e-commerce platform in the Egyptian market while maintaining enterprise-grade architecture, exceptional performance, and an outstanding user experience.
