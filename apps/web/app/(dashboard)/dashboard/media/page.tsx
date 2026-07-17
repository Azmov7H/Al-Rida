import { PageHeader } from "@/components/dashboard/shared/page-header"
import { EmptyState } from "@/components/dashboard/shared/empty-state"
import { Button } from "@/components/ui/button"

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="مكتبة الوسائط"
        description="إدارة الصور والمستندات والفيديو."
        action={{ label: "رفع ملف", href: "/dashboard/media?upload=1" }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white text-xs text-[#94A3B8]"
          >
            صورة {i + 1}
          </div>
        ))}
      </div>
      <EmptyState
        title="مكتبة الوسائط قيد التطوير"
        description="سيتم ربط الرفع بـ Cloudinary ودعم التنظيم بالمجلدات والتصدير bulk."
      />
      <Button size="sm" variant="outline">
        رفع صور
      </Button>
    </div>
  )
}
