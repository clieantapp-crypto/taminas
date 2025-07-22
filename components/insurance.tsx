"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

interface InsurancePurposeProps {
  formData: {
    insurance_purpose: string
    documment_owner_full_name: string
    owner_identity_number: string
    buyer_identity_number: string
    seller_identity_number: string
  }
  setFormData: (data: any) => void
  errors: Record<string, string>
}

export default function InsurancePurpose({ formData, setFormData, errors }: InsurancePurposeProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  const purposes = [
    {
      id: "renewal",
      title: "تجديد التأمين",
      description: "تجديد وثيقة تأمين موجودة",
      icon: "🔄",
    },
    {
      id: "new-insurance",
      title: "تأمين جديد",
      description: "إصدار وثيقة تأمين جديدة",
      icon: "✨",
    },
    {
      id: "property-transfer",
      title: "نقل ملكية",
      description: "تأمين عند نقل ملكية المركبة",
      icon: "🔄",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">الغرض من التأمين</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {purposes.map((purpose) => (
            <Card
              key={purpose.id}
              className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                formData.insurance_purpose === purpose.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleFieldChange("insurance_purpose", purpose.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{purpose.icon}</div>
                <h5 className="font-semibold text-gray-900 mb-1">{purpose.title}</h5>
                <p className="text-xs text-gray-600">{purpose.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          اسم مالك الوثيقة <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.documment_owner_full_name}
          onChange={(e) => handleFieldChange("documment_owner_full_name", e.target.value)}
          placeholder="الاسم الكامل"
          className="h-12"
        />
        {errors.documment_owner_full_name && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.documment_owner_full_name}</span>
          </div>
        )}
      </div>

      {formData.insurance_purpose === "renewal" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            رقم هوية المالك <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.owner_identity_number}
            onChange={(e) => handleFieldChange("owner_identity_number", e.target.value)}
            placeholder="1234567890"
            maxLength={10}
            className="h-12"
          />
          {errors.owner_identity_number && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.owner_identity_number}</span>
            </div>
          )}
        </div>
      )}

      {formData.insurance_purpose === "property-transfer" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              رقم هوية المشتري <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.buyer_identity_number}
              onChange={(e) => handleFieldChange("buyer_identity_number", e.target.value)}
              placeholder="1234567890"
              maxLength={10}
              className="h-12"
            />
            {errors.buyer_identity_number && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.buyer_identity_number}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              رقم هوية البائع <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.seller_identity_number}
              onChange={(e) => handleFieldChange("seller_identity_number", e.target.value)}
              placeholder="1234567890"
              maxLength={10}
              className="h-12"
            />
            {errors.seller_identity_number && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.seller_identity_number}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
