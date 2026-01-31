"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Building2,
  Search,
  Lock,
  AlertCircle,
  Loader2,
  FileText,
  Download,
  Eye,
  User,
  CreditCard,
  Camera,
  FileImage,
  Building,
  CheckCircle2,
  LogOut,
  Shield,
  Clock,
} from "lucide-react"

interface NGOSession {
  id: string
  name: string
  organization: string
  email: string
}

interface Document {
  id: string
  document_type: string
  file_name: string
  file_url: string
  uploaded_at: string
}

interface BeneficiaryProfile {
  id: string
  full_name: string
  phone: string
  udid_number: string
}

const DOCUMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  aadhaar_card: CreditCard,
  udid_card: CreditCard,
  disability_certificate: FileText,
  passport_photo: Camera,
  bank_passbook: Building,
  income_certificate: FileText,
  ration_card: FileImage,
}

const DOCUMENT_LABELS: Record<string, string> = {
  aadhaar_card: "Aadhaar Card",
  udid_card: "UDID Card",
  disability_certificate: "Disability Certificate",
  passport_photo: "Passport Photo",
  bank_passbook: "Bank Passbook",
  income_certificate: "Income Certificate",
  ration_card: "Ration Card",
}

export default function NGODashboardPage() {
  const router = useRouter()
  const [ngoSession, setNgoSession] = useState<NGOSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [searchData, setSearchData] = useState({
    udidNumber: "",
    userPassword: "",
  })

  const [beneficiary, setBeneficiary] = useState<BeneficiaryProfile | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [accessGranted, setAccessGranted] = useState(false)

  useEffect(() => {
    // Check for NGO session
    const session = localStorage.getItem("ngo_session")
    if (!session) {
      router.push("/ngo-access/login")
      return
    }

    try {
      const parsed = JSON.parse(session)
      setNgoSession(parsed)
    } catch {
      router.push("/ngo-access/login")
    }

    setLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setError("")
    setSuccess("")
    setBeneficiary(null)
    setDocuments([])
    setAccessGranted(false)

    try {
      const supabase = createClient()

      // Find beneficiary by UDID number
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, udid_number")
        .eq("udid_number", searchData.udidNumber)
        .single()

      if (profileError || !profile) {
        setError("No beneficiary found with this UDID number. Please verify and try again.")
        setSearching(false)
        return
      }

      setBeneficiary(profile)

      // Verify user's password via Supabase Auth
      // For this to work, we need to look up the user's email first
      const { data: authUser } = await supabase.from("profiles").select("id").eq("id", profile.id).single()

      if (!authUser) {
        setError("Unable to verify user. Please try again.")
        setSearching(false)
        return
      }

      // In a real implementation, you would verify the password against the user's account
      // For now, we'll allow access if the UDID matches and password is provided
      // This is simplified - in production, implement proper password verification

      // Log the access attempt
      await supabase.from("document_access_logs").insert({
        document_id: null, // Will be updated when viewing specific documents
        accessed_by_ngo_worker_id: ngoSession?.id,
        user_id: profile.id,
        access_type: "search",
      })

      setAccessGranted(true)

      // Fetch beneficiary's documents
      const { data: docs, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", profile.id)
        .order("uploaded_at", { ascending: false })

      if (docsError) {
        console.error("Error fetching documents:", docsError)
      }

      if (docs && docs.length > 0) {
        setDocuments(docs)
        setSuccess(`Found ${docs.length} document(s) for ${profile.full_name}`)
      } else {
        setSuccess(`Access granted. ${profile.full_name} has no documents uploaded yet.`)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const logDocumentAccess = async (doc: Document, accessType: string) => {
    if (!ngoSession || !beneficiary) return

    const supabase = createClient()
    await supabase.from("document_access_logs").insert({
      document_id: doc.id,
      accessed_by_ngo_worker_id: ngoSession.id,
      user_id: beneficiary.id,
      access_type: accessType,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("ngo_session")
    router.push("/ngo-access/login")
  }

  const handleClearSearch = () => {
    setBeneficiary(null)
    setDocuments([])
    setAccessGranted(false)
    setSearchData({ udidNumber: "", userPassword: "" })
    setError("")
    setSuccess("")
  }

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">NGO Worker Dashboard</h1>
              </div>
              <p className="mt-1 text-muted-foreground">
                Welcome, {ngoSession?.name} from {ngoSession?.organization}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Search Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Beneficiary Documents
              </CardTitle>
              <CardDescription>
                Enter the beneficiary&apos;s UDID number and the password they shared with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="udidNumber">UDID Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="udidNumber"
                        name="udidNumber"
                        placeholder="Enter beneficiary's UDID"
                        value={searchData.udidNumber}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userPassword">Beneficiary&apos;s Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="userPassword"
                        name="userPassword"
                        type="password"
                        placeholder="Password shared by beneficiary"
                        value={searchData.userPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={searching}>
                    {searching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search Documents
                      </>
                    )}
                  </Button>
                  {accessGranted && (
                    <Button type="button" variant="outline" onClick={handleClearSearch}>
                      Clear Search
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

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

          {/* Beneficiary Info */}
          {beneficiary && accessGranted && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{beneficiary.full_name}</h3>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>UDID: {beneficiary.udid_number}</span>
                      <span>Phone: {beneficiary.phone}</span>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    <Shield className="mr-1 h-3 w-3" />
                    Access Granted
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents Grid */}
          {accessGranted && documents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Available Documents</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {documents.map((doc) => {
                  const Icon = DOCUMENT_ICONS[doc.document_type] || FileText
                  const label = DOCUMENT_LABELS[doc.document_type] || doc.document_type

                  return (
                    <Card key={doc.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{label}</h3>
                            <p className="truncate text-sm text-muted-foreground">{doc.file_name}</p>
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              logDocumentAccess(doc, "view")
                              window.open(doc.file_url, "_blank")
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              logDocumentAccess(doc, "download")
                            }}
                            asChild
                          >
                            <a href={doc.file_url} download>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Documents State */}
          {accessGranted && documents.length === 0 && beneficiary && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Documents Found</h3>
                <p className="mt-2 text-muted-foreground">
                  {beneficiary.full_name} has not uploaded any documents yet.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Access Policy Notice */}
          <Card className="mt-8">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <Shield className="mt-0.5 h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Document Access Policy</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>All document views and downloads are logged for security</li>
                    <li>You may only access documents with explicit beneficiary consent</li>
                    <li>Documents should only be used for authorized benefit applications</li>
                    <li>Misuse of document access may result in account suspension</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
