# Orders Architecture

## Al Reda Hardware E-Commerce

---

# Objective

Define the order lifecycle, data model, and management workflow for customer purchases. The order system must track every stage from cart to fulfillment, support multiple payment methods, and provide full administrative oversight.

---

# Order Entity

```
Order

id
orderNumber
user
items (orderItems)
subtotal
discount
shippingFee
tax
total
status
paymentMethod
paymentStatus
shippingAddress
billingAddress
coupon
notes
timeline
createdAt
updatedAt
```

---

# Order Item Entity

```
OrderItem

product
name (snapshot)
sku (snapshot)
price (snapshot)
quantity
total
```

Product details are snapshotted at purchase time to preserve history even if the catalog changes.

---

# Order Status Lifecycle

```
pending
   │
   ▼
confirmed
   │
   ▼
processing
   │
   ▼
shipped
   │
   ▼
delivered
   │
   ▼
completed

cancelled      (any stage before shipped)
refunded       (after payment)
returned       (after delivered)
```

---

# Payment Status

```
unpaid
paid
partially_paid
refunded
failed
```

---

# Payment Methods

* Cash On Delivery
* Paymob (online)
* Future: Stripe

---

# Order Timeline

Each status change appends an entry to the timeline.

```
timestamp
status
note
actor (customer / admin / system)
```

---

# Customer Order View

```
My Orders
   │
   ├── Order List (status badges)
   ├── Order Detail
   │      ├── Items
   │      ├── Pricing Breakdown
   │      ├── Shipping Address
   │      ├── Payment Info
   │      ├── Timeline
   │      └── Track Shipment
   └── Reorder
```

---

# Admin Order Management

```
Dashboard → Orders
   │
   ├── Filter by status / date / payment
   ├── Search by order number / customer
   ├── Update status
   ├── Add note
   ├── Print invoice
   ├── Export (CSV / PDF)
   └── Refund / Cancel
```

---

# Inventory Effects

* Stock reserved on order confirmation
* Stock decremented on processing
* Stock restored on cancellation / refund
* `inventoryLogs` records each movement

---

# Notifications

* Order placed confirmation (email / SMS)
* Status change alerts
* Shipping notification
* Delivery confirmation

---

# Coupon Integration

* Applied at checkout
* Stored on order for audit
* Percentage or fixed discount
* Validity and usage limits enforced

---

# Security

* Customers only access own orders (RBAC + ownership check)
* Admins scoped by role
* Server Action authorization on every mutation
* Audit trail via timeline

---

# Reports

* Sales by period
* Orders by status
* Top selling products
* Revenue by payment method
* Fulfillment performance

---

# Future Enhancements

* Partial shipments
* Split payments
* Subscriptions
* Multi-warehouse fulfillment
* Invoice PDF generation
