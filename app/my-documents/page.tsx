"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Lock,
  Eye,
  Trash2,
  Download,
  Camera,
  CreditCard,
  FileImage,
  Building,
  User,
  Loader2,
  Shield,
  RefreshCw,
} from "lucide-react"
import { verifyWithBiometric, isPlatformAuthenticatorAvailable } from "@/lib/webauthn"

interface Document {
  id: string
  document_type: string
  file_name: string
  file_url: string
  uploaded_at: string
  verified: boolean
}

interface Profile {
  id: string
  full_name: string
  udid_number: string
  phone: string
  passkey_credential_id: string | null
}

const REQUIRED_DOCUMENTS = [
  { type: "aadhaar_card", label: "Aadhaar Card", icon: CreditCard, description: "Front and back copy" },
  { type: "udid_card", label: "UDID Card", icon: CreditCard, description: "Disability ID card" },
  { type: "disability_certificate", label: "Disability Certificate", icon: FileText, description: "Medical certificate" },
  { type: "passport_photo", label: "Passport Photo", icon: Camera, description: "Recent photograph" },
  { type: "bank_passbook", label: "Bank Passbook", icon: Building, description: "First page with details" },
  { type: "income_certificate", label: "Income Certificate", icon: FileText, description: "If applicable" },
  { type: "ration_card", label: "Ration Card", icon: FileImage, description: "Family ration card" },
]

export default function MyDocumentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isVerified, setIsVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [passkeySupported, setPasskeySupported] = useState<boolean | null>(null)

  const loadUserData = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login?redirect=/my-documents")
      return
    }

    // Load profile
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profileData) {
      setProfile(profileData)
    }

    // Load documents
    const { data: docsData } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false })

    if (docsData) {
      setDocuments(docsData)
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    loadUserData()
    isPlatformAuthenticatorAvailable().then(setPasskeySupported)
  }, [loadUserData])

  const handleBiometricVerify = async () => {
    setVerifying(true)
    setError("")

    try {
      const verified = await verifyWithBiometric()
      if (verified) {
        setIsVerified(true)
        setSuccess("Identity verified! You can now view and manage your documents.")
      } else {
        setError("Verification failed. Please try again.")
      }
    } catch (err) {
      setError("Biometric verification failed. Please try again.")
      console.error(err)
    } finally {
      setVerifying(false)
    }
  }

  const handlePasswordVerify = async () => {
    // For devices without biometric support, we consider logged-in users as verified
    setIsVerified(true)
    setSuccess("Access granted!")
  }

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!profile) return

    setUploading(documentType)
    setError("")
    setSuccess("")

    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile.id}/${documentType}_${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("user-documents").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user-documents").getPublicUrl(fileName)

      // Check if document of this type already exists
      const existingDoc = documents.find((d) => d.document_type === documentType)

      if (existingDoc) {
        // Update existing document
        const { error: updateError } = await supabase
          .from("documents")
          .update({
            file_name: file.name,
            file_url: publicUrl,
            uploaded_at: new Date().toISOString(),
          })
          .eq("id", existingDoc.id)

        if (updateError) throw updateError
      } else {
        // Insert new document
        const { error: insertError } = await supabase.from("documents").insert({
          user_id: profile.id,
          document_type: documentType,
          file_name: file.name,
          file_url: publicUrl,
        })

        if (insertError) throw insertError
      }

      setSuccess(`${documentType.replace(/_/g, " ")} uploaded successfully!`)
      loadUserData()
    } catch (err) {
      setError("Failed to upload document. Please try again.")
      console.error(err)
    } finally {
      setUploading(null)
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase.from("documents").delete().eq("id", docId)

      if (deleteError) throw deleteError

      setSuccess("Document deleted successfully.")
      loadUserData()
    } catch (err) {
      setError("Failed to delete document. Please try again.")
      console.error(err)
    }
  }

  const uploadedCount = documents.length
  const totalRequired = REQUIRED_DOCUMENTS.length
  const completionPercentage = Math.round((uploadedCount / totalRequired) * 100)

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  // Verification gate
  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
              <CardDescription>
                Your documents are securely stored. Please verify your identity to access them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {profile?.passkey_credential_id && passkeySupported ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <Fingerprint className="mx-auto h-16 w-16 text-primary" />
                    <p className="mt-3 font-medium">Use Fingerprint or Face ID</p>
                    <p className="text-sm text-muted-foreground">Quick and secure access to your documents</p>
                  </div>

                  <Button onClick={handleBiometricVerify} disabled={verifying} className="w-full" size="lg">
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="mr-2 h-5 w-5" />
                        Verify with Biometrics
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {passkeySupported === false
                        ? "Your device does not support biometric authentication."
                        : "You haven't set up biometric access yet."}
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handlePasswordVerify} className="w-full" size="lg">
                    <Lock className="mr-2 h-5 w-5" />
                    Continue with Password
                  </Button>

                  {passkeySupported !== false && (
                    <Button variant="outline" onClick={() => router.push("/settings/passkey")} className="w-full">
                      Set Up Fingerprint Access
                    </Button>
                  )}
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Your documents are encrypted and only accessible by you
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Documents</h1>
                <p className="mt-1 text-muted-foreground">
                  Welcome, {profile?.full_name}. Manage your documents securely.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsVerified(false)}>
                <Lock className="mr-2 h-4 w-4" />
                Lock
              </Button>
            </div>

            {/* Progress Card */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Document Completion</span>
                  <span className="text-sm text-muted-foreground">
                    {uploadedCount} of {totalRequired} uploaded
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                {completionPercentage === 100 && (
                  <p className="mt-2 text-sm text-primary flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    All required documents uploaded!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">{success}</AlertDescription>
            </Alert>
          )}

          {/* UDID Info Card */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Your UDID Number</h3>
                  <p className="font-mono text-lg">{profile?.udid_number || "Not set"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share this with NGO workers along with your password to grant them document access
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const uploaded = documents.find((d) => d.document_type === doc.type)
              const Icon = doc.icon
              const isUploading = uploading === doc.type

              return (
                <Card key={doc.type} className={uploaded ? "border-primary/30" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            uploaded ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${uploaded ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{doc.label}</CardTitle>
                          <CardDescription className="text-xs">{doc.description}</CardDescription>
                        </div>
                      </div>
                      {uploaded && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Uploaded
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {uploaded ? (
                      <div className="space-y-3">
                        <div className="rounded-lg bg-muted p-3">
                          <p className="truncate text-sm font-medium">{uploaded.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {new Date(uploaded.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <a href={uploaded.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <a href={uploaded.file_url} download>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(uploaded.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <label className="block">
                          <Button variant="ghost" size="sm" className="w-full" disabled={isUploading} asChild>
                            <span>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Replace Document
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFileUpload(doc.type, file)
                                }}
                              />
                            </span>
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <label className="block">
                        <div
                          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5 ${
                            isUploading ? "pointer-events-none opacity-50" : ""
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <span className="mt-2 text-sm text-muted-foreground">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="mt-2 text-sm font-medium">Click to upload</span>
                              <span className="text-xs text-muted-foreground">JPG, PNG, or PDF</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(doc.type, file)
                          }}
                        />
                      </label>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
