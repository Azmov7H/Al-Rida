"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import mongoose from "mongoose"
import { requireRole } from "@/lib/auth/guard"
import { productRepository } from "@/repositories/product.repository"
import { productCreateSchema } from "@/validators/product"
import { slugify } from "@/lib/utils"

export async function createProductAction(formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect("/dashboard/products")

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    sku: formData.get("sku"),
    barcode: formData.get("barcode") || undefined,
    brandId: formData.get("brandId"),
    categoryId: formData.get("categoryId"),
    price: Number(formData.get("price")),
    salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : undefined,
    cost: formData.get("cost") ? Number(formData.get("cost")) : undefined,
    stock: Number(formData.get("stock")) || 0,
    material: formData.get("material") || undefined,
    finish: formData.get("finish") || undefined,
    country: formData.get("country") || undefined,
    warranty: formData.get("warranty") || undefined,
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
    status: formData.get("status") || "draft",
  }

  const parsed = productCreateSchema.safeParse({
    ...raw,
    slug: raw.slug || slugify(raw.name as string),
    brandId: raw.brandId as string,
    categoryId: raw.categoryId as string,
  })

  if (!parsed.success) {
    redirect("/dashboard/products/new?error=invalid")
  }

  try {
    await productRepository.create({
      ...parsed.data,
      brand: new mongoose.Types.ObjectId(parsed.data.brandId),
      category: new mongoose.Types.ObjectId(parsed.data.categoryId),
    })
    revalidatePath("/dashboard/products")
  } catch {
    redirect("/dashboard/products/new?error=save")
  }
  redirect("/dashboard/products")
}

export async function updateProductAction(id: string, formData: FormData) {
  const guard = await requireRole("manager")
  if ("response" in guard) redirect(`/dashboard/products/${id}`)

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    sku: formData.get("sku"),
    barcode: formData.get("barcode") || undefined,
    brandId: formData.get("brandId"),
    categoryId: formData.get("categoryId"),
    price: Number(formData.get("price")),
    salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : undefined,
    cost: formData.get("cost") ? Number(formData.get("cost")) : undefined,
    stock: Number(formData.get("stock")) || 0,
    material: formData.get("material") || undefined,
    finish: formData.get("finish") || undefined,
    country: formData.get("country") || undefined,
    warranty: formData.get("warranty") || undefined,
    tags: (formData.get("tags") as string)
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [],
    status: formData.get("status") || "draft",
  }

  const parsed = productCreateSchema.safeParse({
    ...raw,
    slug: raw.slug || slugify(raw.name as string),
    brandId: raw.brandId as string,
    categoryId: raw.categoryId as string,
  })

  if (!parsed.success) {
    redirect(`/dashboard/products/${id}?error=invalid`)
  }

  try {
    await productRepository.update(id, {
      ...parsed.data,
      brand: new mongoose.Types.ObjectId(parsed.data.brandId),
      category: new mongoose.Types.ObjectId(parsed.data.categoryId),
    })
    revalidatePath("/dashboard/products")
    revalidatePath(`/dashboard/products/${id}`)
  } catch {
    redirect(`/dashboard/products/${id}?error=save`)
  }
  redirect("/dashboard/products")
}
