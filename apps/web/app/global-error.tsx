"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error(error)

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ color: "#0F3B73", fontSize: "1.5rem", margin: 0 }}>
          تعذر تحميل التطبيق
        </h1>
        <p style={{ color: "#64748B", maxWidth: "28rem", textAlign: "center" }}>
          حدث خطأ جسيم. يرجى إعادة المحاولة.
        </p>
        <button
          onClick={reset}
          style={{
            borderRadius: "0.5rem",
            background: "#0F3B73",
            color: "#fff",
            padding: "0.5rem 1.25rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  )
}
