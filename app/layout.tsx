import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import CrispChat from "@/components/chat"


export const metadata: Metadata = {
  title: "تأميني - منصة تأمين السيارات في السعودية",
  description: "أول منصة تأمين السيارات في السعودية - احصل على أفضل عروض التأمين من أكثر من 25 شركة معتمدة",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar">
      <body >
      <CrispChat/> {
          children}
       </body>
    </html>
  )
}
