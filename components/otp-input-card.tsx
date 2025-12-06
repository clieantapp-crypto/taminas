"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface OtpInputCardProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
}

export function OtpInputCard({ value, onChange, length = 6, error }: OtpInputCardProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("").slice(0, length)

    onChange(updatedValue)

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
    <div className="space-y-3">
      <div className="flex justify-center gap-3" dir="ltr">
        {Array.from({ length }, (_, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl shadow-md transition-all duration-200 ${
              value[index] 
                ? "shadow-lg scale-105" 
                : "shadow-sm"
            }`}
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-14 h-16 text-center text-2xl font-bold bg-gradient-to-b from-white to-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                error 
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                  : value[index]
                    ? "border-[#4052B5] bg-gradient-to-b from-blue-50 to-white"
                    : "border-gray-200 focus:border-[#4052B5] focus:ring-2 focus:ring-[#4052B5]/20"
              }`}
              autoComplete="one-time-code"
            />
            {value[index] && !error && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4052B5] to-[#6B7FE3]"></div>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center font-medium">{error}</p>
      )}
    </div>
  )
}
