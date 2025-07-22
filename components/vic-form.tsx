"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Car, FileText } from "lucide-react"

interface VehicleRegistrationProps {
  formData: {
    vehicle_type: string
    sequenceNumber: string
  }
  setFormData: (data: any) => void
  errors: Record<string, string>
}

export default function VehicleRegistration({ formData, setFormData, errors }: VehicleRegistrationProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
  }

  const vehicleTypes = [
    {
      id: "serial",
      title: "رقم تسلسلي",
      description: "للمركبات الحديثة",
      icon: Car,
    },
    {
      id: "custom",
      title: "لوحة مميزة",
      description: "للوحات المميزة والخاصة",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">نوع المركبة</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vehicleTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                formData.vehicle_type === type.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleFieldChange("vehicle_type", type.id)}
            >
              <CardContent className="p-4 text-center">
                <type.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h5 className="font-semibold text-gray-900 mb-1">{type.title}</h5>
                <p className="text-xs text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {formData.vehicle_type === "serial" ? "الرقم التسلسلي" : "رقم اللوحة المميزة"}
          <span className="text-red-500"> *</span>
        </label>
        <Input
          value={formData.sequenceNumber}
          onChange={(e) => handleFieldChange("sequenceNumber", e.target.value)}
          placeholder={formData.vehicle_type === "serial" ? "123456789" : "أ ب ج 123"}
          className="h-12"
        />
      </div>
    </div>
  )
}
