# SEO Architecture

## Al Reda Hardware E-Commerce Platform

---

# Overview

The SEO architecture is designed to maximize the visibility of **Al Reda** across Google and other search engines while targeting the Egyptian market first and supporting future regional expansion.

The platform must follow Google's latest SEO guidelines, Core Web Vitals, structured data standards, and semantic HTML practices to achieve high rankings for commercial and informational searches related to door hardware.

---

# SEO Objectives

* Rank on the first page for target keywords
* Maximize organic traffic
* Improve Core Web Vitals
* Generate rich search results
* Optimize product discoverability
* Increase local visibility
* Support Arabic and English content
* Improve conversion from search traffic

---

# SEO Strategy

Focus Areas

* Technical SEO
* On-Page SEO
* Local SEO
* Product SEO
* Performance SEO
* Image SEO
* Content SEO
* Structured Data

---

# URL Structure

Use clean URLs.

Examples

```text
/

/

/products

/products/door-locks

/products/door-locks/al-ahram-lock-123

/categories/handles

/brands/al-ahram

/about

/contact
```

Rules

* lowercase
* kebab-case
* no IDs
* no unnecessary query parameters
* canonical URLs

---

# Dynamic Metadata

Every page must generate metadata dynamically.

Includes

* Title
* Description
* Keywords
* Open Graph
* Twitter Card
* Robots
* Canonical URL

Example

```ts
export const metadata = {
  title: "كوالين الأهرام | شركة الرضا",
  description: "...",
};
```

---

# Meta Title Rules

Length

```text
50–60 characters
```

Formula

```text
Product Name | Brand | Al Reda
```

Example

```text
كالون باب الأهرام 70 مم | شركة الرضا
```

---

# Meta Description

Length

```text
120–160 characters
```

Example

```text
اكتشف مجموعة كبيرة من كوالين الأهرام الأصلية لدى شركة الرضا، الموزع المعتمد لمنتجات الأقفال وإكسسوارات الأبواب في مصر.
```

---

# Heading Structure

Each page must contain

```text
H1

↓

H2

↓

H3
```

Only one H1 per page.

---

# Open Graph

Generate dynamically.

Includes

* Title
* Description
* Product Image
* URL
* Brand
* Locale

---

# Twitter Cards

Support

```text
summary_large_image
```

---

# Canonical URLs

Every page

```text
<link rel="canonical">
```

Generated automatically.

---

# Robots

Global

```text
index

follow
```

Private pages

```text
noindex

nofollow
```

Examples

* Dashboard
* Login
* Cart
* Checkout
* Profile

---

# Sitemap

Automatically generated.

Include

* Homepage
* Products
* Categories
* Brands
* Blog (Future)
* Projects

Update automatically when new products are added.

---

# Robots.txt

Allow

* Products
* Categories
* Brands
* Landing Pages

Block

* Dashboard
* API
* Authentication
* Internal Search
* Checkout

---

# Structured Data

Homepage

Organization

LocalBusiness

Website

SearchAction

Products

Product

Offer

AggregateRating

Breadcrumb

Categories

CollectionPage

Brands

Brand

About

Organization

FAQ

FAQPage

Contact

LocalBusiness

Projects

Article

---

# Product Schema

Includes

* Name
* Brand
* SKU
* Image
* Description
* Price
* Currency
* Availability
* Rating
* Reviews

JSON-LD generated dynamically.

---

# Breadcrumb Schema

Example

```text
Home

↓

Products

↓

Door Locks

↓

Al Ahram Lock
```

---

# Image SEO

Every image must have

* alt text
* descriptive filename
* width
* height
* WebP or AVIF
* lazy loading

Example

```text
al-ahram-door-lock.webp
```

Avoid

```text
IMG_001.jpg
```

---

# Internal Linking

Link between

* Categories
* Brands
* Products
* Related Products
* Compatible Products

Use contextual links.

---

# Product SEO

Every product should contain

* Long Description
* Technical Specifications
* Features
* Applications
* Installation Guide
* Downloads
* Related Products
* Compatible Products

---

# Local SEO

Business Information

* Company Name
* Address
* Phone
* WhatsApp
* Email
* Working Hours
* Google Maps

Use LocalBusiness Schema.

---

# Multi-language SEO

Primary

Arabic

Secondary

English

Use

```text
hreflang

ar-EG

en
```

---

# Core Web Vitals

Targets

LCP

```text
<2.5s
```

CLS

```text
<0.1
```

INP

```text
<200ms
```

---

# Performance Optimization

* Server Components
* Streaming
* Route Cache
* Dynamic Imports
* Partial Prerendering
* Image Optimization
* Font Optimization
* Compression

---

# Technical SEO

Use

* Semantic HTML
* Clean URLs
* XML Sitemap
* Robots.txt
* Canonical URLs
* Structured Data
* Metadata API
* Open Graph
* Twitter Cards

---

# Content Strategy

Pages

* Home
* About
* Contact
* Categories
* Brands
* Products
* Projects

Future

* Blog
* Installation Guides
* Buying Guides
* Product Comparisons
* Maintenance Tips
* Company News

---

# Keyword Strategy

Primary Keywords

* كوالين أبواب
* أوكر أبواب
* مفصلات أبواب
* إكسسوارات الأبواب
* منتجات الأهرام
* أقفال أبواب
* موزع الأهرام
* أقفال أصلية

Secondary Keywords

* حلول الأبواب
* أقفال ذكية
* كوالين مصر
* أوكر ستانلس
* أقفال فنادق
* إكسسوارات تشطيبات

Long-tail Keywords

* أفضل كوالين أبواب في مصر
* موزع منتجات الأهرام
* أسعار أوكر الأبواب
* شراء كوالين أصلية
* مفصلات أبواب ستانلس

---

# Search Features

Enable

* Product Search
* Category Search
* Brand Search
* Search Suggestions
* Search Analytics

---

# Monitoring

Integrate

* Google Search Console
* Google Analytics 4
* Google Tag Manager
* Microsoft Clarity
* Bing Webmaster Tools

---

# Security & SEO

* HTTPS Only
* Secure Headers
* Fast Response Time
* No Mixed Content
* Proper Redirects (301)
* Custom 404 Page

---

# SEO Folder Structure

```text
lib
├── seo
│   ├── metadata.ts
│   ├── open-graph.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── structured-data.ts
│   ├── breadcrumbs.ts
│   ├── keywords.ts
│   └── canonical.ts

app
├── sitemap.ts
├── robots.ts
└── manifest.ts
```

---

# Success Metrics

* Lighthouse SEO ≥ 100
* Performance ≥ 95
* Accessibility ≥ 95
* Best Practices ≥ 100
* Core Web Vitals Passed
* Rich Results Eligible
* First Page Rankings for Target Keywords
* Increased Organic Traffic
* Higher Product Visibility
* Improved Click-Through Rate (CTR)

---

# Final Vision

The SEO architecture should position Al Reda as the leading online destination for door hardware in Egypt by combining exceptional technical SEO, high-quality Arabic-first content, structured product data, and excellent website performance. Every page should be optimized to rank well, deliver a superior user experience, and support long-term organic growth while remaining scalable for future markets and content expansion.
