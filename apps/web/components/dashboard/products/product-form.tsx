"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import type { IBrand } from "@/models/brand"
import type { ICategory } from "@/models/category"
import type { IProduct } from "@/models/product"

const STATUSES = [
  { value: "active", label: "نشط" },
  { value: "draft", label: "مسودة" },
  { value: "out_of_stock", label: "غير متوفر" },
  { value: "archived", label: "مؤرشف" },
]

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  step,
}: {
  label: string
  name: string
  defaultValue?: string
  type?: string
  placeholder?: string
  step?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#475569]">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
      />
    </label>
  )
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "جاري الحفظ..." : "حفظ"}
    </Button>
  )
}

export function ProductForm({
  brands,
  categories,
  product,
  formAction,
}: {
  brands: IBrand[]
  categories: ICategory[]
  product?: IProduct
  formAction: (formData: FormData) => void
}) {
  const p = product
  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field label="الاسم" name="name" defaultValue={p?.name} placeholder="مثال: قفل أبواب معدني" />
      <Field label="الرمز (SKU)" name="sku" defaultValue={p?.sku} placeholder="SKU-001" />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">العلامة التجارية</span>
        <select
          name="brandId"
          defaultValue={p?.brand?.toString()}
          className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        >
          <option value="">اختر العلامة التجارية</option>
          {brands.map((b) => (
            <option key={b._id?.toString()} value={b._id?.toString()}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">الفئة</span>
        <select
          name="categoryId"
          defaultValue={p?.category?.toString()}
          className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        >
          <option value="">اختر الفئة</option>
          {categories.map((c) => (
            <option key={c._id?.toString()} value={c._id?.toString()}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <Field label="السعر" name="price" type="number" step="0.01" defaultValue={String(p?.price ?? "")} />
      <Field label="سعر التخفيض" name="salePrice" type="number" step="0.01" defaultValue={p?.salePrice != null ? String(p.salePrice) : ""} />
      <Field label="التكلفة" name="cost" type="number" step="0.01" defaultValue={p?.cost != null ? String(p.cost) : ""} />
      <Field label="المخزون" name="stock" type="number" defaultValue={String(p?.stock ?? "0")} />
      <Field label="الخامة" name="material" defaultValue={p?.material} />
      <Field label="اللمسة النهائية" name="finish" defaultValue={p?.finish} />
      <Field label="بلد المنشأ" name="country" defaultValue={p?.country} />
      <Field label="الضمان" name="warranty" defaultValue={p?.warranty} />
      <Field label="الباركود" name="barcode" defaultValue={p?.barcode} />
      <Field label="الوسوم (مفصولة بفاصلة)" name="tags" defaultValue={p?.tags?.join(", ")} />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">الحالة</span>
        <select
          name="status"
          defaultValue={p?.status ?? "draft"}
          className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-2 sm:col-span-2">
        <Submit />
      </div>
    </form>
  )
}
