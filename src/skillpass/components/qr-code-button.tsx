"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"
import * as React from "react"

interface QrCodeButtonProps extends ButtonProps {
  /** Data to encode in the QR code */
  value: string
}

export default function QrCodeButton({
  value,
  children,
  ...props
}: QrCodeButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG value={value} size={200} />
          <p className="font-mono break-all text-sm">{value}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}