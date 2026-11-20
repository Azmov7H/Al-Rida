"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { X, UploadCloud, Shuffle } from "lucide-react"
import { QrScanner } from "@/components/dashboard/products/qr-scanner"
import { generateSku } from "@/lib/utils"

const STATUSES = [
  { value: "active", label: "نشط" },
  { value: "draft", label: "مسودة" },
  { value: "out_of_stock", label: "غير متوفر" },
  { value: "archived", label: "مؤرشف" },
]

interface ProductImage {
  url: string
  alt: string
}

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
  brands: { _id?: string; name: string; slug: string }[]
  categories: { _id?: string; name: string; slug: string }[]
  product?: {
    _id?: string
    name: string
    slug: string
    sku: string
    barcode?: string
    brand?: string
    category?: string
    price: number
    salePrice?: number
    cost?: number
    stock: number
    material?: string
    finish?: string
    country?: string
    warranty?: string
    tags?: string[]
    status: string
    images?: ProductImage[]
  }
  formAction: (formData: FormData) => void
}) {
  const p = product
  const [images, setImages] = React.useState<ProductImage[]>(p?.images ?? [])
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const skuRef = React.useRef<HTMLInputElement>(null)
  const barcodeRef = React.useRef<HTMLInputElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  function onSkuDetected(value: string) {
    if (skuRef.current) skuRef.current.value = value
    if (barcodeRef.current) barcodeRef.current.value = value
  }

  function onBarcodeDetected(value: string) {
    if (barcodeRef.current) barcodeRef.current.value = value
  }

  function generate() {
    const sku = generateSku()
    if (skuRef.current) skuRef.current.value = sku
    if (barcodeRef.current) barcodeRef.current.value = sku
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError(null)
    const next: ProductImage[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "products")
      try {
        const res = await fetch("/api/upload/image", { method: "POST", body: fd })
        const json = await res.json()
        if (!res.ok || !json?.data?.url) {
          setUploadError("فشل رفع صورة.")
          continue
        }
        next.push({ url: json.data.url, alt: file.name.replace(/\.[^.]+$/, "") })
      } catch {
        setUploadError("فشل رفع صورة.")
      }
    }
    setImages((prev) => [...prev, ...next])
    setUploading(false)
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateAlt(idx: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, alt } : img)))
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <Field label="الاسم" name="name" defaultValue={p?.name} placeholder="مثال: قفل أبواب معدني" />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">الرمز (SKU)</span>
        <div className="flex gap-2">
          <input
            ref={skuRef}
            name="sku"
            defaultValue={p?.sku}
            placeholder="SKU-001"
            className="h-11 flex-1 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-11 items-center gap-1 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#475569] hover:border-[#0F3B73]"
          >
            <Shuffle className="size-4" /> عشوائي
          </button>
          <QrScanner onDetect={onSkuDetected} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">الباركود</span>
        <div className="flex gap-2">
          <input
            ref={barcodeRef}
            name="barcode"
            defaultValue={p?.barcode}
            placeholder="باركود المنتج"
            className="h-11 flex-1 rounded-lg border border-[#E2E8F0] px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
          />
          <QrScanner onDetect={onBarcodeDetected} />
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[#475569]">العلامة التجارية</span>
        <select
          name="brandId"
          defaultValue={p?.brand?.toString()}
          className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm focus:border-[#0F3B73] focus:outline-none focus:ring-1 focus:ring-[#0F3B73]"
        >
          <option value="">اختر العلامة التجارية</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
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
            <option key={c._id} value={c._id}>
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
      <Field label="الوسوم (مفصولة بفاصلة)" name="tags" defaultValue={p?.tags?.join(", ")} />

      <div className="mt-2 sm:col-span-2">
        <span className="text-sm font-medium text-[#475569]">الصور</span>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img, idx) => (
            <div key={img.url} className="relative rounded-lg border border-[#E2E8F0] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="h-24 w-full rounded object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute left-1 top-1 rounded-full bg-black/60 p-1 text-white"
                aria-label="حذف"
              >
                <X className="size-3.5" />
              </button>
              <input
                value={img.alt}
                onChange={(e) => updateAlt(idx, e.target.value)}
                placeholder="وصف الصورة"
                className="mt-1 h-8 w-full rounded border border-[#E2E8F0] px-2 text-xs focus:border-[#0F3B73] focus:outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#CBD5E1] text-xs text-[#64748B] hover:border-[#0F3B73]"
          >
            <UploadCloud className="size-5" />
            {uploading ? "جاري الرفع..." : "إضافة صورة"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            void handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
        {uploadError ? <p className="mt-2 text-xs text-red-600">{uploadError}</p> : null}
      </div>

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
