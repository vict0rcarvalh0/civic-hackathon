import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BrowserQRCodeReader } from "@zxing/browser"

/* ---------- Tailwind helper ---------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ---------- Base‑URL helpers ---------- */
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

export const SITE_DOMAIN = (() => {
  try {
    return new URL(BASE_URL).host
  } catch {
    return BASE_URL.replace(/^https?:\/\//, "")
  }
})()

/* ---------- QR‑code ---------- */
export async function decodeQrFromImage(file: File): Promise<string | null> {
  const reader = new BrowserQRCodeReader()
  try {
    const url = URL.createObjectURL(file)
    const result = await reader.decodeFromImageUrl(url)
    URL.revokeObjectURL(url)
    return result.getText()
  } catch (err) {
    console.error("QR decode failed", err)
    return null
  }
}

/* ---------- Clipboard ---------- */
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const success = document.execCommand("copy")
    document.body.removeChild(textarea)
    return success
  } catch (err) {
    console.error("Clipboard copy failed", err)
    return false
  }
}

/* ---------- Chain persistence ---------- */
export const SELECTED_CHAIN_KEY = "authora.selectedChain"

export function saveSelectedChain(id: string | null) {
  try {
    if (id && id.length > 0) {
      localStorage.setItem(SELECTED_CHAIN_KEY, id)
    } else {
      localStorage.removeItem(SELECTED_CHAIN_KEY)
    }
  } catch {}
}

export function loadSelectedChain(): string | null {
  try {
    const val = localStorage.getItem(SELECTED_CHAIN_KEY)
    return val && val.length > 0 ? val : null
  } catch {
    return null
  }
}

/* ---------- CSV export ---------- */
export function exportCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/* ---------- Misc ---------- */
export function ensureHttp(url: string): string {
  if (!url) return url
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, "")}`
}

export function buildAuthHeaders(
  user: { id?: string | null; email?: string | null } | null | undefined,
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(user ? { "x-user-id": user.id || user.email || "" } : {}),
  }
}