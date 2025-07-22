import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
