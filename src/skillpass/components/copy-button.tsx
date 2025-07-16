"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { copyText } from "@/lib/utils"
import { toast } from "sonner"

interface CopyButtonProps extends ButtonProps {
  /** Text that will be copied to clipboard */
  value: string
  /** Optional suffix: e.g. "Address" will render "Copy Address" */
  suffix?: string
  /** Hide label text and only show icon */
  showText?: boolean
  /** Override toast title */
  toastTitle?: string
  /** Override toast description */
  toastDescription?: string
}

export default function CopyButton({
  value,
  suffix,
  showText = true,
  toastTitle,
  toastDescription,
  children,
  ...props
}: CopyButtonProps) {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(e)
    const ok = await copyText(value)
    toast(ok ? toastTitle || "Copied!" : "Copy failed", {
      description: toastDescription || value,
    })
  }

  const label = children ? (
    children
  ) : (
    <>
      <Copy className="w-4 h-4 mr-2" />
      {showText && `Copy${suffix ? ` ${suffix}` : ""}`}
    </>
  )

  return (
    <Button {...props} onClick={handleClick}>
      {label}
    </Button>
  )
}