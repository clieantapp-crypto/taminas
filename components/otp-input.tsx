"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
}

export function OtpInput({ value, onChange, length = 6, error }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("").slice(0, length)

    onChange(updatedValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    onChange(pastedData)
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2" dir="ltr">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors ${
              error ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-[#146394]"
            }`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  )
}
