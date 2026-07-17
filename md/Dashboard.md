# Dashboard Pages Architecture

## Al Reda Hardware E-Commerce — Admin Dashboard

---

# Overview

The Dashboard is the operational hub of the Al Reda platform. It is designed for administrators, managers, sales representatives, warehouse staff, and content managers to efficiently manage products, inventory, orders, customers, brands, and business operations.

The interface should resemble modern enterprise systems such as **Shopify Admin**, **Stripe Dashboard**, **Vercel Dashboard**, and **Linear**, rather than a traditional CMS.

---

# Design Principles

* Enterprise UI
* Fast Workflow
* Information Density
* Arabic First (RTL)
* Mobile Responsive
* Keyboard Friendly
* Minimal Clicks
* Scalable Architecture

---

# Dashboard Structure

```text
Dashboard

├── Home
├── Products
├── Categories
├── Brands
├── Inventory
├── Orders
├── Customers
├── Reviews
├── Contact Messages
├── Marketing
├── Media Library
├── Reports
├── Analytics
├── Users
├── Roles & Permissions
├── Activity Logs
├── Website Content
├── Settings
└── Profile
```

---

# 1. Dashboard Home

Purpose

Provide a complete overview of business performance.

Widgets

* Total Products
* Total Orders
* Revenue
* Pending Orders
* Low Stock Products
* New Customers
* Best Selling Products
* Latest Orders
* Recent Activity
* Sales Chart
* Category Distribution
* Quick Actions

Quick Actions

* Add Product
* Create Order
* Add Brand
* Add Category
* Upload Images

---

# 2. Products

Routes

```text
/dashboard/products

/dashboard/products/new

/dashboard/products/[id]

/dashboard/products/[id]/edit
```

Features

* Product Table
* Grid/List View
* Bulk Actions
* Import Products
* Export Products
* Duplicate Product
* Archive Product
* Product Status
* Product Variants
* Product Gallery
* SEO Editor

Filters

* Brand
* Category
* Status
* Stock
* Featured
* Best Seller

---

# 3. Categories

Features

* Tree Structure
* Parent Categories
* Sort Order
* SEO Metadata
* Category Image
* Product Count

Actions

* Create
* Edit
* Delete
* Hide
* Reorder

---

# 4. Brands

Features

* Logo
* Brand Banner
* Country
* Description
* Website
* Featured Brand

Actions

* Add
* Edit
* Archive

---

# 5. Inventory

Purpose

Warehouse management.

Features

* Current Stock
* Reserved Stock
* Low Stock
* Out Of Stock
* Purchase History
* Stock Adjustment
* Inventory Movement
* Barcode Support

Operations

* Increase Stock
* Decrease Stock
* Manual Adjustment
* Inventory Notes

---

# 6. Orders

Routes

```text
/dashboard/orders

/dashboard/orders/[id]
```

Features

* Order Timeline
* Payment Status
* Shipping Status
* Customer Details
* Invoice
* Order Notes
* Print Invoice
* Download PDF
* Update Status

Statuses

* Pending
* Confirmed
* Packed
* Shipped
* Delivered
* Cancelled
* Refunded

---

# 7. Customers

Features

* Customer Profile
* Order History
* Addresses
* Wishlist
* Lifetime Value
* Notes
* Activity Timeline

Actions

* Edit
* Suspend
* Delete
* Reset Password

---

# 8. Reviews

Features

* Rating
* Approval
* Spam Detection
* Reply
* Images
* Product Link

Actions

* Approve
* Reject
* Delete

---

# 9. Contact Messages

Features

* Inbox
* Read Status
* Assign Employee
* Internal Notes
* Reply History

Status

* New
* In Progress
* Closed

---

# 10. Marketing

Modules

* Coupons
* Promotions
* Homepage Banners
* Featured Products
* Notifications
* Email Campaigns

---

# 11. Media Library

Features

* Folder Organization
* Image Compression
* Search
* Preview
* Bulk Upload
* Delete
* Rename

Supported

* Images
* PDF
* Documents
* Videos

---

# 12. Reports

Reports

* Sales
* Products
* Categories
* Brands
* Customers
* Inventory
* Revenue

Export

* Excel
* CSV
* PDF

---

# 13. Analytics

Charts

* Sales Trend
* Orders
* Revenue
* Product Performance
* Customer Growth
* Conversion Rate

Filters

* Daily
* Weekly
* Monthly
* Yearly
* Custom Range

---

# 14. Users

Roles

* Admin
* Manager
* Sales
* Warehouse
* Content Manager

Actions

* Invite User
* Edit User
* Suspend
* Delete

---

# 15. Roles & Permissions

Permission Examples

* View Products
* Edit Products
* Delete Products
* Manage Orders
* View Reports
* Manage Inventory
* Manage Users
* Manage Website

---

# 16. Activity Logs

Tracks

* Login
* Logout
* Product Changes
* Inventory Changes
* Orders
* User Management
* Settings Changes

Each log contains

* User
* Action
* IP
* Date
* Device

---

# 17. Website Content

Manage

* Homepage Hero
* Banners
* About Page
* Contact Page
* FAQ
* Footer
* Company Information

---

# 18. Settings

Sections

General

* Company Name
* Logo
* Contact Information

Commerce

* Currency
* Taxes
* Shipping

Payments

* Paymob
* Stripe
* Cash on Delivery

Notifications

* Email
* SMS
* WhatsApp

Security

* Password Policy
* Session Timeout
* 2FA

SEO

* Metadata
* Sitemap
* Robots

---

# 19. Profile

Features

* Personal Information
* Avatar
* Change Password
* Notification Preferences
* Login Sessions

---

# Shared Dashboard Components

* Data Table
* Search Bar
* Filter Panel
* Breadcrumb
* Page Header
* Statistic Cards
* Charts
* Drawer
* Modal
* Confirm Dialog
* Pagination
* Bulk Actions Toolbar
* Empty State
* Loading Skeleton
* Error State

---

# Folder Structure

```text
app
└── dashboard
    ├── page.tsx
    ├── products
    ├── categories
    ├── brands
    ├── inventory
    ├── orders
    ├── customers
    ├── reviews
    ├── contact
    ├── marketing
    ├── media
    ├── reports
    ├── analytics
    ├── users
    ├── roles
    ├── activity
    ├── content
    ├── settings
    └── profile

components
└── dashboard
    ├── layout
    ├── tables
    ├── charts
    ├── forms
    ├── cards
    ├── dialogs
    ├── filters
    ├── navigation
    └── shared
```

---

# Security

* RBAC Permissions
* Middleware Protection
* Audit Logs
* CSRF Protection
* Rate Limiting
* Secure File Uploads
* Session Validation

---

# Performance

* Server Components
* Streaming Tables
* Virtualized Data Tables
* Lazy-loaded Charts
* Optimistic Updates
* Route-level Caching
* Image Optimization

---

# Final Vision

The Dashboard should provide a complete enterprise management experience for Al Reda, allowing administrators and staff to efficiently control every aspect of the business—from products and inventory to orders, customers, analytics, and website content. The interface must prioritize speed, clarity, scalability, and Arabic-first usability while remaining flexible enough to support future ERP, CRM, and multi-branch integrations.
