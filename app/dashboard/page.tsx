"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { 
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  MapPin,
  Bell,
  Mail,
  ArrowRight,
  ChevronRight,
  Send
} from "lucide-react"

// Demo application data
const demoApplication = {
  id: "EB-7X9K2M4N",
  applicantName: "Rajesh Kumar",
  aadhaarLast4: "4532",
  submissionDate: "2024-01-15",
  district: "Chennai",
  currentStage: 2,
  estimatedCompletion: "2024-02-15",
  renewalDate: "2025-01-15",
  categories: ["Locomotor Disability", "High Support Needs"],
  monthlyAmount: 2500,
}

const stages = [
  {
    id: 1,
    name: "Submitted",
    description: "Application received at DDAWO office",
    duration: "1-2 days",
    status: "completed",
  },
  {
    id: 2,
    name: "Tahsildar Verification",
    description: "Document verification by Tahsildar",
    duration: "5-7 days",
    status: "current",
  },
  {
    id: 3,
    name: "Executive Magistrate",
    description: "Review and approval by Executive Magistrate",
    duration: "7-10 days",
    status: "pending",
  },
  {
    id: 4,
    name: "District Collector",
    description: "Final approval by District Collector",
    duration: "5-7 days",
    status: "pending",
  },
  {
    id: 5,
    name: "Completed",
    description: "Benefits activated and disbursed",
    duration: "-",
    status: "pending",
  },
]

export default function DashboardPage() {
  const [applicationId, setApplicationId] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [showApplication, setShowApplication] = useState(false)
  const [grievanceOpen, setGrievanceOpen] = useState(false)
  const [grievanceText, setGrievanceText] = useState("")
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false)

  const handleTrack = () => {
    if (applicationId.trim()) {
      setIsTracking(true)
      // Simulate API call
      setTimeout(() => {
        setIsTracking(false)
        setShowApplication(true)
      }, 1500)
    }
  }

  const handleSubmitGrievance = () => {
    if (grievanceText.trim()) {
      // In a real app, this would send an email
      const subject = encodeURIComponent(`Grievance Report - Application ${demoApplication.id}`)
      const body = encodeURIComponent(`
Applicant Name: ${demoApplication.applicantName}
Application ID: ${demoApplication.id}
Aadhaar (last 4): ${demoApplication.aadhaarLast4}
District: ${demoApplication.district}

Grievance Details:
${grievanceText}
      `.trim())
      
      window.open(`mailto:collchn@nic.in,scd.tn@nic.in,scdatn@gmail.com?subject=${subject}&body=${body}`)
      setGrievanceSubmitted(true)
      setTimeout(() => {
        setGrievanceOpen(false)
        setGrievanceSubmitted(false)
        setGrievanceText("")
      }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1 bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {!showApplication ? (
            /* Search State */
            <div className="mx-auto max-w-xl">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Track Your Application
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Enter your application ID to check the status
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="appId">Application ID</Label>
                      <Input
                        id="appId"
                        placeholder="e.g., EB-7X9K2M4N"
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
                        className="text-center font-mono text-lg"
                      />
                      <p className="text-center text-xs text-muted-foreground">
                        You can find this on your dossier or submission receipt
                      </p>
                    </div>
                    <Button
                      onClick={handleTrack}
                      disabled={!applicationId.trim() || isTracking}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isTracking ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5" />
                          Track Application
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Demo Link */}
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="text-center text-sm text-muted-foreground">
                      {"Don't have an application yet?"}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/eligibility">Check Eligibility</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setApplicationId("EB-7X9K2M4N")
                          setShowApplication(true)
                        }}
                      >
                        View Demo Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Dashboard State */
            <div className="space-y-8">
              {/* Welcome Banner */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {demoApplication.applicantName.charAt(0)}
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-foreground">
                          Welcome, {demoApplication.applicantName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          Application ID: <span className="font-mono">{demoApplication.id}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowApplication(false)
                        setApplicationId("")
                      }}
                    >
                      Track Another
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Progress Tracker */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Application Progress
                      </CardTitle>
                      <CardDescription>
                        Track your application through each stage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Progress Bar Visual */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between">
                          {stages.map((stage, index) => {
                            const isCompleted = stage.id < demoApplication.currentStage
                            const isCurrent = stage.id === demoApplication.currentStage
                            
                            return (
                              <div key={stage.id} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                      isCompleted
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : isCurrent
                                          ? "border-primary bg-primary/10 text-primary"
                                          : "border-border bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                      <span className="text-sm font-medium">{stage.id}</span>
                                    )}
                                  </div>
                                  <span className="mt-2 hidden text-xs font-medium sm:block">
                                    {stage.name.split(" ")[0]}
                                  </span>
                                </div>
                                {index < stages.length - 1 && (
                                  <div
                                    className={`mx-1 h-1 flex-1 ${
                                      stage.id < demoApplication.currentStage
                                        ? "bg-primary"
                                        : "bg-border"
                                    }`}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Stage Details */}
                      <div className="space-y-3">
                        {stages.map((stage) => {
                          const isCompleted = stage.id < demoApplication.currentStage
                          const isCurrent = stage.id === demoApplication.currentStage
                          
                          return (
                            <div
                              key={stage.id}
                              className={`flex items-start gap-3 rounded-lg p-3 ${
                                isCurrent
                                  ? "border-2 border-primary bg-primary/5"
                                  : isCompleted
                                    ? "bg-secondary/50"
                                    : "bg-muted/30"
                              }`}
                            >
                              <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                  isCompleted
                                    ? "bg-primary text-primary-foreground"
                                    : isCurrent
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : isCurrent ? (
                                  <Clock className="h-4 w-4" />
                                ) : (
                                  <span className="text-xs">{stage.id}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-foreground">{stage.name}</p>
                                  {isCurrent && (
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                      In Progress
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{stage.description}</p>
                                {stage.duration !== "-" && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Estimated: {stage.duration}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Grievance Reporting */}
                  <Card className="border-destructive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Report an Issue
                      </CardTitle>
                      <CardDescription>
                        {"Experiencing delays or been asked for bribes? Report directly to officials."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Dialog open={grievanceOpen} onOpenChange={setGrievanceOpen}>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="w-full gap-2 sm:w-auto">
                            <Mail className="h-4 w-4" />
                            Report Grievance
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report a Grievance</DialogTitle>
                            <DialogDescription>
                              Your report will be sent directly to the District Collector and Welfare Department officials.
                            </DialogDescription>
                          </DialogHeader>
                          {grievanceSubmitted ? (
                            <div className="py-8 text-center">
                              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                              <p className="mt-4 font-medium text-foreground">
                                Email client opened!
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Please send the email to complete your grievance report.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="rounded-lg bg-secondary/50 p-3">
                                <p className="text-xs text-muted-foreground">
                                  <strong>Recipients:</strong> District Collector, Commissionerate for Welfare of the Differently Abled
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="grievance">Describe your issue</Label>
                                <Textarea
                                  id="grievance"
                                  placeholder="Please describe the issue you faced, including any names, dates, and office locations if applicable..."
                                  value={grievanceText}
                                  onChange={(e) => setGrievanceText(e.target.value)}
                                  rows={5}
                                />
                              </div>
                              <Button
                                onClick={handleSubmitGrievance}
                                disabled={!grievanceText.trim()}
                                className="w-full gap-2"
                              >
                                <Send className="h-4 w-4" />
                                Open Email with Report
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <p className="mt-3 text-xs text-muted-foreground">
                        All reports are confidential and sent directly to: collchn@nic.in, scd.tn@nic.in
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Application Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Application Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Applicant</p>
                          <p className="font-medium text-foreground">{demoApplication.applicantName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">District</p>
                          <p className="font-medium text-foreground">{demoApplication.district}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted On</p>
                          <p className="font-medium text-foreground">
                            {new Date(demoApplication.submissionDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Categories</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {demoApplication.categories.map((cat) => (
                              <span
                                key={cat}
                                className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">Expected Monthly Benefit</p>
                        <p className="text-2xl font-bold text-primary">
                          Rs. {demoApplication.monthlyAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Renewal Alert */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Bell className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Renewal Reminder</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Your Life Certificate is due on{" "}
                            {new Date(demoApplication.renewalDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            SMS reminder will be sent 30 days before the due date.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <a
                        href="https://swavlambancard.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-secondary"
                      >
                        <span>UDID Portal</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </a>
                      <a
                        href="https://tnpds.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-secondary"
                      >
                        <span>TN e-Sevai Portal</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </a>
                      <Link
                        href="/dossier"
                        className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-secondary"
                      >
                        <span>Generate New Dossier</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
