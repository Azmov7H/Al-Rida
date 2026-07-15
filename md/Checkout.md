# Checkout Architecture

## Al Reda Hardware E-Commerce

---

# Objective

Define the checkout flow that converts a cart into a confirmed order. The flow must be fast, secure, mobile-first, and support multiple payment methods while validating every step on the server.

---

# Checkout Flow

```
        Cart
         │
         ▼
   Review Items
         │
         ▼
   Login / Guest Detect
         │
         ▼
   Shipping Address
         │
         ▼
   Shipping Method
         │
         ▼
   Payment Method
         │
         ▼
   Order Summary
         │
         ▼
   Place Order
         │
         ▼
   Payment Processing
         │
         ▼
   Confirmation
```

---

# Step Details

## Cart Review

* List of items with snapshots
* Quantity adjustment
* Remove item
* Apply / remove coupon
* Subtotal calculation

## Authentication

* Registered customers auto-filled
* Guest checkout allowed (limited features)
* Account creation optional at confirmation

## Shipping Address

* Name, phone, governorate, city, address
* Saved addresses for customers
* Validation with Zod

## Shipping Method

* Standard
* Express
* Fee calculated by method and region

## Payment Method

* Cash On Delivery
* Paymob (redirect / iframe)
* Future: Stripe

## Order Summary

* Items subtotal
* Coupon discount
* Shipping fee
* Tax (if applicable)
* Grand total
* Address and payment review

---

# Pricing Calculation

```
subtotal    = Σ (price × quantity)
discount    = coupon value
shipping    = method-based fee
tax         = applicable rate
total       = subtotal − discount + shipping + tax
```

All calculations performed server-side to prevent tampering.

---

# Order Placement

```
Place Order (Server Action)
   │
   ▼
Validate Cart + Stock
   │
   ├── Out of stock → abort with error
   │
   ▼
Validate Address + Payment
   │
   ▼
Create Order (status: pending)
   │
   ▼
Create OrderItems (snapshots)
   │
   ▼
Reserve Inventory
   │
   ▼
Process Payment
   │
   ├── Success → status: confirmed, paymentStatus: paid
   └── Failure → status: cancelled, restore stock
   │
   ▼
Clear Cart
   │
   ▼
Send Confirmation
   │
   ▼
Redirect to Confirmation
```

---

# Validation Boundaries

* Cart items exist and active
* Stock availability
* Address completeness
* Coupon validity and limits
* Payment method supported
* Total matches server calculation

---

# Security

* Server-side total recalculation (no client trust)
* Authenticated mutations (RBAC)
* CSRF protection via SameSite cookies
* Input validation with Zod
* No payment secrets on client
* Rate limiting on place-order action

---

# Guest vs Customer

```
Guest
   │
   ├── Must provide address
   ├── No saved history
   └── Optional account creation

Customer
   │
   ├── Saved addresses
   ├── Order history
   └── Wishlist linkage
```

---

# Confirmation

* Order number displayed
* Email / SMS receipt
* Summary of items and totals
* Estimated delivery
* Track order link

---

# Error Handling

```
Stock changed      → revert, show updated cart
Payment failed     → keep cart, show retry
Validation error   → return to step with message
Network error      → idempotent retry guard
```

---

# Performance

* Server Actions for mutations
* Optimistic UI for quantity changes
* Skeleton loading on transition
* Minimal client JS
* Prefetch confirmation route

---

# Future Enhancements

* One-page express checkout
* Wallet / stored balance
* Split payments
* Apple Pay / Google Pay
* Abandoned cart recovery
