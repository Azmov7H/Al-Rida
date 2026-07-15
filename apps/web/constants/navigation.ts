export const customerNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Cart", href: "/cart" },
  { label: "Orders", href: "/orders" },
] as const

export const adminNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Coupons", href: "/dashboard/coupons" },
  { label: "Settings", href: "/dashboard/settings" },
] as const
