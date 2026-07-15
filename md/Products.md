# Products Architecture

## Al Reda Hardware E-Commerce

---

# Objective

Define the data model, catalog structure, and presentation strategy for the door hardware product catalog. The product system must support rich specifications, advanced filtering, brand and category organization, media assets, and SEO-ready product pages.

---

# Product Entity

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

# Status Values

```
active       Visible and purchasable
draft        Hidden from storefront
out_of_stock Temporarily unavailable
archived     Removed from catalog
```

---

# Catalog Structure

```
Categories
    │
    ├── Door Locks
    ├── Handles
    ├── Hinges
    ├── Cylinders
    ├── Smart Locks
    └── Door Accessories

Brands
    │
    └── Many-to-one relationship with products

Products
    │
    └── Belong to one category and one brand
```

---

# Filtering & Search

## Filter Dimensions

* Category
* Brand
* Price Range
* Material
* Finish
* Door Type
* Security Level
* In Stock Only
* On Sale Only
* Rating

## Search

* MongoDB Atlas Search
* Full Text Search
* Instant Search
* Product Suggestions
* Typo Tolerance

## Sorting

* Price (low to high)
* Price (high to low)
* Newest
* Best Selling
* Top Rated
* Name (A–Z)

---

# Media

```
images      Cloudinary (gallery, zoom)
documents   Cloudinary (datasheets, PDFs)
videos      Cloudinary / external embeds
```

Asset pipeline

* Upload via Server Action
* Optimization via Cloudinary transforms
* Responsive delivery (srcset)

---

# Product Page

```
Breadcrumb
Gallery (main + thumbnails)
Title + Brand
Rating + Reviews
Price + Sale Price
Short Description
Variants / Options
Specifications Table
Add to Cart
Wishlist
Compare
Related Products
Recently Viewed
Installation Guide
Downloadable Datasheet
Structured Data (JSON-LD)
```

---

# SEO

* Dynamic Metadata per product
* Open Graph tags
* Canonical URL
* Product Rich Snippets
* Sitemap inclusion
* Slug-based URLs (`/products/[slug]`)

---

# Inventory Integration

* `stock` decremented on order placement
* Low stock threshold triggers alert
* `inventoryLogs` records every stock change
* Out of stock products flagged in UI

---

# Admin Management

* Create / Edit / Delete products
* Bulk upload via CSV
* Media management
* Status transitions
* SEO fields editing
* Specification templates per category

---

# Performance

* Server Components for product pages
* Image Optimization (Cloudinary)
* Lazy loading of gallery and related
* Route caching / ISR Ready
* Skeleton loading states

---

# Future Enhancements

* Product comparisons
* AI product assistant
* Recommendations engine
* Multi-warehouse stock
* Barcode scanning
