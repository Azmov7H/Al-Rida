# Landing Page Architecture

## Al Reda Hardware E-Commerce

---

# Objective

The Landing Page is the public face of **Al Reda**. Its purpose is to establish trust, showcase premium door hardware products, highlight the company's expertise, and convert visitors into customers through a fast, modern, and highly optimized user experience.

---

# Design Goals

* Premium and modern appearance
* Fast loading performance
* Mobile-first responsive design
* High conversion rate
* Excellent SEO
* Accessibility (WCAG)
* Smooth animations
* Enterprise-level UI

---

# Target Audience

* Homeowners
* Interior Designers
* Contractors
* Construction Companies
* Architects
* Hardware Retailers
* Developers
* Wholesale Buyers

---

# Color Palette

Primary

```
#C69214
```

Dark

```
#181818
```

Background

```
#F7F7F5
```

Surface

```
#FFFFFF
```

Secondary Text

```
#6B7280
```

Border

```
#E5E7EB
```

Success

```
#22C55E
```

Danger

```
#EF4444
```

---

# Typography

## Arabic

Cairo

## English

Inter

Weights

* 400
* 500
* 600
* 700
* 800

---

# Layout Width

```
Container

max-width: 1440px

Padding

Desktop: 80px

Tablet: 40px

Mobile: 20px
```

---

# Landing Structure

```
Navbar

Hero

Brands

Categories

Featured Products

Best Sellers

Solutions

Projects

Why Choose Us

Statistics

Testimonials

Partners

FAQ

CTA

Footer
```

---

# Navbar

Height

```
80px
```

Sticky

```
Yes
```

Blur

```
Glass Effect
```

Contents

```
Logo

Home

Shop

Categories

Brands

Projects

Offers

About

Contact

Search

Wishlist

Cart

Account

Theme Toggle
```

Behavior

* Sticky
* Shrinks on scroll
* Mega Menu
* Mobile Drawer
* Keyboard Accessible

---

# Hero Section

Layout

```
Left

Headline

Description

Buttons

Features

Right

Premium Product Image
```

Headline

```
Premium Door Hardware for Every Space
```

Subtitle

```
Discover locks, handles, hinges, cylinders, smart locks, and professional door accessories designed for durability, security, and elegance.
```

Buttons

```
Shop Now

Explore Categories
```

Highlights

* Premium Quality
* Fast Delivery
* Warranty
* Wholesale Available

Background

* Soft Gradient
* Decorative Shapes
* Floating Hardware Elements

Animation

* Fade
* Parallax
* Smooth Scroll

---

# Brands Section

Grid

```
5–8 Brands
```

Each Card

* Logo
* Name
* Hover Effect

---

# Categories

Grid

```
3 Columns Desktop

2 Tablet

1 Mobile
```

Categories

* Door Locks
* Handles
* Hinges
* Cylinders
* Smart Locks
* Door Accessories

Each Card

* Large Image
* Overlay
* Product Count
* CTA

---

# Featured Products

Grid

Desktop

```
4 Cards
```

Tablet

```
2
```

Mobile

```
1
```

Card

* Product Image
* Badge
* Brand
* Name
* Rating
* Price
* Discount
* Add to Cart
* Wishlist
* Compare

Hover

* Lift
* Shadow
* Image Zoom

---

# Best Sellers

Carousel

Auto Play

Manual Navigation

Indicators

---

# Solutions Section

Purpose

Show products grouped by use case.

Examples

* Residential
* Commercial
* Hotels
* Hospitals
* Offices
* Industrial

Each Card

* Icon
* Description
* CTA

---

# Projects Showcase

Display completed projects using Al Reda products.

Card

* Project Image
* Client
* Location
* Category

---

# Why Choose Us

Grid

```
4 Cards
```

Examples

* Premium Materials
* Trusted Brands
* Professional Support
* Fast Delivery

Icons

Lucide Icons

---

# Statistics

Animated Counters

```
Products

Customers

Orders

Years Experience

Projects Completed
```

---

# Testimonials

Slider

Each Testimonial

* Avatar
* Name
* Position
* Rating
* Review

---

# Partners

Infinite Logo Slider

---

# FAQ

Accordion

Questions

* Shipping
* Warranty
* Returns
* Installation
* Wholesale
* Payment

---

# CTA Section

Headline

```
Need Professional Door Hardware?
```

Buttons

```
Shop Now

Contact Sales
```

Background

Premium Gold Gradient

---

# Footer

Columns

```
Company

Products

Support

Quick Links

Contact

Newsletter
```

Bottom

* Copyright
* Privacy Policy
* Terms
* Social Media

---

# Components

```
Navbar

Mega Menu

Hero

Section Title

Category Card

Brand Card

Product Card

Badge

Button

Counter

Accordion

Carousel

Testimonial Card

Partner Logo

Footer
```

---

# Animations

Library

```
Framer Motion
```

Effects

* Fade Up
* Fade In
* Scale
* Slide
* Hover Lift
* Image Zoom
* Counter Animation
* Smooth Page Transition

---

# Performance

* Server Components
* Lazy Loading
* Dynamic Imports
* Image Optimization
* Skeleton Loading
* Route Prefetching
* Font Optimization

---

# SEO

* Dynamic Metadata
* Open Graph
* Twitter Cards
* Canonical URLs
* JSON-LD
* Sitemap
* Robots
* Product Structured Data

---

# Accessibility

* Keyboard Navigation
* Focus States
* Screen Reader Support
* Semantic HTML
* ARIA Labels
* Color Contrast Compliance

---

# Responsive Breakpoints

```
Mobile

<640px

Tablet

640–1024px

Laptop

1024–1440px

Desktop

>1440px
```

---

# Folder Structure

```
app
└── (marketing)
    └── page.tsx

components
├── landing
│   ├── navbar
│   ├── hero
│   ├── brands
│   ├── categories
│   ├── featured-products
│   ├── best-sellers
│   ├── solutions
│   ├── projects
│   ├── why-us
│   ├── statistics
│   ├── testimonials
│   ├── partners
│   ├── faq
│   ├── cta
│   └── footer
```

---

# Success Metrics

* Lighthouse Score ≥ 95
* First Contentful Paint < 1.5s
* Largest Contentful Paint < 2.5s
* CLS < 0.1
* Mobile Performance ≥ 95
* Accessibility ≥ 95
* SEO ≥ 100

---

# Final Vision

The landing page should communicate **trust, quality, and professionalism** from the first interaction. Every section should guide visitors naturally toward exploring products or contacting the sales team, while maintaining a premium visual identity that reflects Al Reda's position in the door hardware industry.
