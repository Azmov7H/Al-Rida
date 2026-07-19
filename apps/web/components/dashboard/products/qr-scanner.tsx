"use client"

import * as React from "react"
import { ScanLine, X } from "lucide-react"

interface QrScannerProps {
  onDetect: (value: string) => void
}

export function QrScanner({ onDetect }: QrScannerProps) {
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [scanning, setScanning] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const rafRef = React.useRef<number>(0)
  const detectorRef = React.useRef<{ detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } | null>(null)
  const loopRef = React.useRef<() => void>(() => {})

  const stop = React.useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setScanning(false)
  }, [])

  const close = React.useCallback(() => {
    stop()
    setOpen(false)
    setError(null)
  }, [stop])

  const tick = React.useCallback(async () => {
    const video = videoRef.current
    const detector = detectorRef.current
    if (!video || !detector) return
    if (video.readyState >= 2 && video.videoWidth > 0) {
      try {
        const candidates = await detector.detect(video)
        const first = candidates[0]
        if (first) {
          close()
          onDetect(first.rawValue)
          return
        }
      } catch {
        // transient detection errors are safe to ignore
      }
    }
    rafRef.current = requestAnimationFrame(() => loopRef.current())
  }, [onDetect])

  React.useEffect(() => {
    loopRef.current = () => {
      void tick()
    }
  }, [tick])

  const start = React.useCallback(async () => {
    setError(null)
    if (typeof window === "undefined" || !("BarcodeDetector" in window)) {
      setError("المتصفح لا يدعم مسح الرموز. استخدم متصفح Chrome/Edge على أندرويد.")
      return
    }
    try {
      const BarcodeDetectorCtor = (window as any).BarcodeDetector
      const formats = BarcodeDetectorCtor.getSupportedFormats()
      detectorRef.current = new BarcodeDetectorCtor({
        formats: formats.length ? formats : undefined,
      })
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setScanning(true)
      loopRef.current()
    } catch {
      setError("تعذر الوصول للكاميرا. تأكد من منح الإذن.")
    }
  }, [])

  React.useEffect(() => {
    return () => stop()
  }, [stop])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#E2E8F0] px-3 text-sm text-[#475569] hover:border-[#0F3B73]"
      >
        <ScanLine className="size-4" /> مسح رمز
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0F3B73]">مسح الرمز الشريطي / QR</h3>
          <button type="button" onClick={close} className="text-[#64748B]">
            <X className="size-5" />
          </button>
        </div>
        <video
          ref={videoRef}
          className="aspect-square w-full rounded-lg bg-black"
          muted
          playsInline
        />
        {error ? (
          <p className="mt-3 text-xs text-red-600">{error}</p>
        ) : (
          <p className="mt-3 text-xs text-[#64748B]">
            وجّه الكاميرا نحو الرمز الشريطي أو رمز QR.
          </p>
        )}
        {!scanning ? (
          <button
            type="button"
            onClick={start}
            className="mt-3 h-10 w-full rounded-lg bg-[#0F3B73] text-sm text-white"
          >
            تشغيل الكاميرا
          </button>
        ) : null}
      </div>
    </div>
  )
}
