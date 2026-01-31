"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FileText, Download, CheckCircle2, User, CreditCard, Phone, Building, FileCheck, ArrowRight, Camera, Award as IdCard, FileImage, MapPin, AlertCircle } from "lucide-react"

interface FormData {
  fullName: string
  aadhaarNumber: string
  bankAccount: string
  ifscCode: string
  mobileNumber: string
  address: string
  district: string
}

const initialFormData: FormData = {
  fullName: "",
  aadhaarNumber: "",
  bankAccount: "",
  ifscCode: "",
  mobileNumber: "",
  address: "",
  district: "",
}

const requiredDocuments = [
  {
    icon: IdCard,
    title: "Ration Card Copy",
    description: "Photocopy of your family ration card",
  },
  {
    icon: Camera,
    title: "Passport Photos",
    description: "4 recent passport-size photographs",
  },
  {
    icon: FileImage,
    title: "Disability Certificate",
    description: "Existing disability certificate from certified medical board",
  },
  {
    icon: CreditCard,
    title: "Aadhaar Card Copy",
    description: "Photocopy of your Aadhaar card",
  },
  {
    icon: Building,
    title: "Bank Passbook Copy",
    description: "First page of bank passbook showing account details",
  },
]

const districts = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli",
  "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur",
  "Ranipet", "Sivaganga", "Kancheepuram", "Cuddalore", "Karur", "Nagapattinam",
  "Viluppuram", "Tiruvarur", "Perambalur", "Ariyalur", "Krishnagiri", "Dharmapuri",
  "Namakkal", "Tiruvannamalai", "Theni", "Virudhunagar", "Ramanathapuram",
  "Pudukkottai", "Nilgiris", "Kallakurichi", "Chengalpattu", "Tenkasi", "Mayiladuthurai"
]

export default function DossierPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!formData.aadhaarNumber.trim() || formData.aadhaarNumber.length !== 12) {
      newErrors.aadhaarNumber = "Valid 12-digit Aadhaar number is required"
    }
    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = "Bank account number is required"
    }
    if (!formData.ifscCode.trim() || formData.ifscCode.length !== 11) {
      newErrors.ifscCode = "Valid 11-character IFSC code is required"
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Valid 10-digit mobile number is required"
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }
    if (!formData.district) {
      newErrors.district = "District is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerate = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setIsGenerated(true)
  }

  const handleDownload = () => {
    // In a real app, this would trigger an actual PDF download
    const dossierContent = `
JUST-EASE - APPLICATION DOSSIER
============================================

APPLICANT DETAILS
-----------------
Full Name: ${formData.fullName}
Aadhaar Number: ${formData.aadhaarNumber}
Mobile Number: ${formData.mobileNumber}
Address: ${formData.address}
District: ${formData.district}

BANK DETAILS
------------
Account Number: ${formData.bankAccount}
IFSC Code: ${formData.ifscCode}

REQUIRED DOCUMENTS CHECKLIST
----------------------------
[ ] Ration Card Copy
[ ] 4 Passport Photos
[ ] Disability Certificate (40%+ certified)
[ ] Aadhaar Card Copy
[ ] Bank Passbook Copy (first page)

NEXT STEPS
----------
1. Gather all documents listed above
2. Take this dossier to your District DDAWO office
3. Submit all documents together
4. Note down your application reference number
5. Track your application on our dashboard

IMPORTANT CONTACTS
------------------
District: ${formData.district}
DDAWO Office Contact: Check district website
Email: scd.tn@nic.in

Generated on: ${new Date().toLocaleDateString("en-IN")}
Application Reference: EB-${Date.now().toString(36).toUpperCase()}

---
This is an auto-generated dossier from Just-Ease.
For official queries, contact your local DDAWO office.
    `.trim()

    const blob = new Blob([dossierContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `JustEase_Dossier_${formData.fullName.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1 bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Generate Your Dossier
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Fill in your details to create a ready-to-print application package
            </p>
          </div>

          {!isGenerated ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Applicant Information
                    </CardTitle>
                    <CardDescription>
                      Enter your details exactly as they appear on your official documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name (as per Aadhaar)</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Aadhaar Number */}
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input
                        id="aadhaar"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={formData.aadhaarNumber}
                        onChange={(e) => updateField("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))}
                        className={errors.aadhaarNumber ? "border-destructive" : ""}
                      />
                      {errors.aadhaarNumber && (
                        <p className="text-sm text-destructive">{errors.aadhaarNumber}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                          +91
                        </span>
                        <Input
                          id="mobile"
                          placeholder="Enter 10-digit mobile number"
                          value={formData.mobileNumber}
                          onChange={(e) => updateField("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className={`rounded-l-none ${errors.mobileNumber ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-sm text-destructive">{errors.mobileNumber}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        SMS alerts for renewals will be sent to this number
                      </p>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter your complete address"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className={errors.address ? "border-destructive" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive">{errors.address}</p>
                      )}
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <select
                        id="district"
                        value={formData.district}
                        onChange={(e) => updateField("district", e.target.value)}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.district ? "border-destructive" : ""}`}
                      >
                        <option value="">Select your district</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="text-sm text-destructive">{errors.district}</p>
                      )}
                    </div>

                    {/* Bank Details Header */}
                    <div className="border-t border-border pt-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Building className="h-5 w-5 text-primary" />
                        Bank Account Details
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        For direct benefit transfer to your account
                      </p>
                    </div>

                    {/* Bank Account */}
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Bank Account Number</Label>
                      <Input
                        id="bankAccount"
                        placeholder="Enter your bank account number"
                        value={formData.bankAccount}
                        onChange={(e) => updateField("bankAccount", e.target.value.replace(/\D/g, ""))}
                        className={errors.bankAccount ? "border-destructive" : ""}
                      />
                      {errors.bankAccount && (
                        <p className="text-sm text-destructive">{errors.bankAccount}</p>
                      )}
                    </div>

                    {/* IFSC Code */}
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        placeholder="Enter 11-character IFSC code"
                        value={formData.ifscCode}
                        onChange={(e) => updateField("ifscCode", e.target.value.toUpperCase().slice(0, 11))}
                        className={errors.ifscCode ? "border-destructive" : ""}
                      />
                      {errors.ifscCode && (
                        <p className="text-sm text-destructive">{errors.ifscCode}</p>
                      )}
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Generating Dossier...
                        </>
                      ) : (
                        <>
                          <FileCheck className="h-5 w-5" />
                          Generate Dossier
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Required Documents */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Documents</CardTitle>
                    <CardDescription>
                      Gather these before visiting the office
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {requiredDocuments.map((doc) => (
                      <div key={doc.title} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <doc.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Important Note</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Keep originals of all documents for verification. Only submit photocopies unless asked otherwise.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Success State */
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Dossier Generated Successfully!
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Your application package is ready for download
                  </p>
                </div>

                {/* Download Card */}
                <Card className="mx-auto mt-8 max-w-md border-2">
                  <CardContent className="p-6 text-center">
                    <FileText className="mx-auto h-12 w-12 text-primary" />
                    <p className="mt-3 font-medium text-foreground">
                      Application Dossier for {formData.fullName}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reference: EB-{Date.now().toString(36).toUpperCase().slice(0, 8)}
                    </p>
                    <Button onClick={handleDownload} className="mt-4 gap-2">
                      <Download className="h-4 w-4" />
                      Download Dossier
                    </Button>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-center text-lg font-semibold text-foreground">Next Steps</h3>
                  <div className="mx-auto max-w-2xl space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Print the dossier</p>
                        <p className="text-sm text-muted-foreground">Download and print all pages of the dossier</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Gather required documents</p>
                        <p className="text-sm text-muted-foreground">Collect all documents listed in the checklist</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Visit the DDAWO office</p>
                        <p className="text-sm text-muted-foreground">Take your dossier and documents to the {formData.district} DDAWO office</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        4
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Track your application</p>
                        <p className="text-sm text-muted-foreground">Use our dashboard to monitor your application status</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild className="gap-2">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsGenerated(false)
                      setFormData(initialFormData)
                    }}
                  >
                    Create Another Dossier
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
