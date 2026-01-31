"use client"

import React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Users,
  Eye,
  Ear,
  Brain,
  Heart,
  Activity,
  Award,
  IndianRupee
} from "lucide-react"

type UserRole = "self" | "caregiver" | null
type Answer = "yes" | "no" | null

interface Answers {
  role: UserRole
  vision: Answer
  locomotor: Answer
  acidAttack: Answer
  hearing: Answer
  mentalNeuro: Answer
  speechLanguage: Answer
  chronicBlood: Answer
  chronicNeuro: Answer
  severity40: Answer
  severity80: Answer
}

interface EligibilityResult {
  eligible: boolean
  categories: string[]
  monthlyAmount: number
  additionalAllowance: number
  totalAmount: number
}

const initialAnswers: Answers = {
  role: null,
  vision: null,
  locomotor: null,
  acidAttack: null,
  hearing: null,
  mentalNeuro: null,
  speechLanguage: null,
  chronicBlood: null,
  chronicNeuro: null,
  severity40: null,
  severity80: null,
}

const steps = [
  { id: "role", title: "Your Role", icon: User },
  { id: "physical", title: "Physical Conditions", icon: Activity },
  { id: "sensory", title: "Sensory Conditions", icon: Eye },
  { id: "mental", title: "Mental & Speech", icon: Brain },
  { id: "chronic", title: "Chronic Conditions", icon: Heart },
  { id: "severity", title: "Severity Level", icon: Award },
  { id: "results", title: "Your Results", icon: CheckCircle2 },
]

function calculateEligibility(answers: Answers): EligibilityResult {
  const categories: string[] = []
  let baseAmount = 0
  let additionalAllowance = 0

  // Physical disabilities
  if (answers.vision === "yes") {
    categories.push("Visual Impairment (Blindness/Low-Vision)")
    baseAmount = Math.max(baseAmount, 1000)
  }
  if (answers.locomotor === "yes") {
    categories.push("Locomotor Disability / Muscular Dystrophy")
    baseAmount = Math.max(baseAmount, 1500)
  }
  if (answers.acidAttack === "yes") {
    categories.push("Acid Attack Victim")
    baseAmount = Math.max(baseAmount, 1000)
  }
  if (answers.hearing === "yes") {
    categories.push("Hearing Impairment")
    baseAmount = Math.max(baseAmount, 1000)
  }

  // Mental/Neuro
  if (answers.mentalNeuro === "yes") {
    categories.push("Intellectual Disability / Autism / Mental Illness")
    baseAmount = Math.max(baseAmount, 1500)
  }
  if (answers.speechLanguage === "yes") {
    categories.push("Speech & Language Disability")
    baseAmount = Math.max(baseAmount, 1000)
  }

  // Chronic conditions
  if (answers.chronicBlood === "yes") {
    categories.push("Blood Disorder (Haemophilia/Thalassemia/Sickle Cell)")
    baseAmount = Math.max(baseAmount, 2000)
  }
  if (answers.chronicNeuro === "yes") {
    categories.push("Chronic Neurological (Parkinson's/Multiple Sclerosis)")
    baseAmount = Math.max(baseAmount, 2000)
  }

  // Severity adjustments
  if (answers.severity80 === "yes") {
    additionalAllowance = 1000 // Personal Assistance Allowance for high support needs
  }

  const eligible = categories.length > 0 && answers.severity40 === "yes"
  const totalAmount = eligible ? baseAmount + additionalAllowance : 0

  return {
    eligible,
    categories,
    monthlyAmount: baseAmount,
    additionalAllowance,
    totalAmount,
  }
}

export default function EligibilityPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [result, setResult] = useState<EligibilityResult | null>(null)

  const progress = ((currentStep + 1) / steps.length) * 100

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return answers.role !== null
      case 1: return answers.locomotor !== null && answers.acidAttack !== null
      case 2: return answers.vision !== null && answers.hearing !== null
      case 3: return answers.mentalNeuro !== null && answers.speechLanguage !== null
      case 4: return answers.chronicBlood !== null && answers.chronicNeuro !== null
      case 5: return answers.severity40 !== null && answers.severity80 !== null
      default: return true
    }
  }

  const handleNext = () => {
    if (currentStep === 5) {
      const eligibilityResult = calculateEligibility(answers)
      setResult(eligibilityResult)
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers(initialAnswers)
    setResult(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1 bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Eligibility Check
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Answer simple questions to find out your benefits
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="mb-8 hidden overflow-x-auto sm:flex">
            <div className="flex gap-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isComplete = index < currentStep

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content Card */}
          <Card className="border-2">
            <CardContent className="p-6 sm:p-8">
              {/* Step 0: Role Selection */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-foreground">
                      Welcome! Let us help you.
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Are you filling this for yourself or helping someone else?
                    </p>
                  </div>
                  <RadioGroup
                    value={answers.role ?? ""}
                    onValueChange={(value) => updateAnswer("role", value as UserRole)}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Label
                      htmlFor="self"
                      className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors ${
                        answers.role === "self" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="self" id="self" className="sr-only" />
                      <User className="h-10 w-10 text-primary" />
                      <span className="font-medium">I am the affected individual</span>
                    </Label>
                    <Label
                      htmlFor="caregiver"
                      className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors ${
                        answers.role === "caregiver" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="caregiver" id="caregiver" className="sr-only" />
                      <Users className="h-10 w-10 text-primary" />
                      <span className="font-medium">NGO Worker / Caregiver</span>
                    </Label>
                  </RadioGroup>
                </div>
              )}

              {/* Step 1: Physical - Locomotor & Acid Attack */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <QuestionBlock
                    icon={Activity}
                    question="Do you have difficulty moving around or using your limbs?"
                    description="This includes problems with walking, using hands/arms, or requiring mobility aids."
                    value={answers.locomotor}
                    onChange={(val) => updateAnswer("locomotor", val)}
                  />
                  <QuestionBlock
                    icon={Heart}
                    question="Are you an acid attack survivor?"
                    description="This applies if you have been affected by an acid attack incident."
                    value={answers.acidAttack}
                    onChange={(val) => updateAnswer("acidAttack", val)}
                  />
                </div>
              )}

              {/* Step 2: Sensory - Vision & Hearing */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <QuestionBlock
                    icon={Eye}
                    question="Do you have difficulty seeing, even with glasses?"
                    description="This includes blindness, low vision, or significant visual impairment."
                    value={answers.vision}
                    onChange={(val) => updateAnswer("vision", val)}
                  />
                  <QuestionBlock
                    icon={Ear}
                    question="Do you have difficulty hearing?"
                    description="This includes deafness, hard of hearing, or significant hearing loss."
                    value={answers.hearing}
                    onChange={(val) => updateAnswer("hearing", val)}
                  />
                </div>
              )}

              {/* Step 3: Mental & Speech */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <QuestionBlock
                    icon={Brain}
                    question="Do you have trouble understanding things, memory issues, or mental health conditions?"
                    description="This includes intellectual disability, autism spectrum disorder, or mental illness."
                    value={answers.mentalNeuro}
                    onChange={(val) => updateAnswer("mentalNeuro", val)}
                  />
                  <QuestionBlock
                    icon={Activity}
                    question="Do you have difficulty speaking clearly or communicating?"
                    description="This includes speech impairment or language disorders."
                    value={answers.speechLanguage}
                    onChange={(val) => updateAnswer("speechLanguage", val)}
                  />
                </div>
              )}

              {/* Step 4: Chronic Conditions */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <QuestionBlock
                    icon={Heart}
                    question="Do you have a certified chronic blood disorder?"
                    description="This includes Haemophilia, Thalassemia, or Sickle Cell disease."
                    value={answers.chronicBlood}
                    onChange={(val) => updateAnswer("chronicBlood", val)}
                  />
                  <QuestionBlock
                    icon={Brain}
                    question="Do you have a certified chronic neurological condition?"
                    description="This includes Parkinson's disease or Multiple Sclerosis."
                    value={answers.chronicNeuro}
                    onChange={(val) => updateAnswer("chronicNeuro", val)}
                  />
                </div>
              )}

              {/* Step 5: Severity */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Important:</strong> A disability certificate from a certified medical professional 
                      is required for pension eligibility. The certificate must state your disability percentage.
                    </p>
                  </div>
                  <QuestionBlock
                    icon={Award}
                    question="Can you get a doctor's certificate showing 40% or more disability?"
                    description="This is the basic threshold for most pension schemes."
                    value={answers.severity40}
                    onChange={(val) => updateAnswer("severity40", val)}
                  />
                  <QuestionBlock
                    icon={Award}
                    question="Do you have 80% or more disability (High Support Needs)?"
                    description="Higher severity qualifies for additional personal assistance allowance for your caregiver."
                    value={answers.severity80}
                    onChange={(val) => updateAnswer("severity80", val)}
                  />
                </div>
              )}

              {/* Step 6: Results */}
              {currentStep === 6 && result && (
                <div className="space-y-6">
                  {result.eligible ? (
                    <>
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                          Congratulations! You are eligible.
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                          Based on your answers, you may qualify for the following benefits.
                        </p>
                      </div>

                      {/* Amount Card */}
                      <Card className="border-primary bg-primary/5">
                        <CardContent className="p-6 text-center">
                          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-primary">
                            <IndianRupee className="h-8 w-8" />
                            {result.totalAmount.toLocaleString("en-IN")}
                          </div>
                          <p className="mt-1 text-lg text-muted-foreground">per month (estimated)</p>
                          {result.additionalAllowance > 0 && (
                            <p className="mt-2 text-sm text-primary">
                              Includes additional Personal Assistance Allowance for high support needs
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Categories */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Categories Identified:</h3>
                        <ul className="space-y-2">
                          {result.categories.map((category) => (
                            <li key={category} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span className="text-sm text-muted-foreground">{category}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Next Steps */}
                      <div className="rounded-lg bg-secondary/50 p-4">
                        <h3 className="font-semibold text-foreground">Next Steps:</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Proceed to generate your application dossier. This will include all necessary 
                          forms pre-filled and a checklist of documents you need to bring.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="flex-1 gap-2">
                          <Link href="/dossier">
                            Generate Application Dossier
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={handleRestart}>
                          Start Over
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                          Eligibility Requirements Not Met
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                          Based on your answers, you may not currently qualify for the maintenance allowance scheme.
                        </p>
                      </div>

                      <div className="rounded-lg bg-secondary/50 p-4">
                        <h3 className="font-semibold text-foreground">Common Reasons:</h3>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>- A 40% or higher disability certificate is required for most schemes</li>
                          <li>- No qualifying condition was identified from the answers</li>
                        </ul>
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h3 className="font-semibold text-foreground">What You Can Do:</h3>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>- Consult with a certified medical professional for proper assessment</li>
                          <li>- Contact your local DDAWO office for guidance</li>
                          <li>- Visit the UDID portal: swavlambancard.gov.in</li>
                        </ul>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="outline" onClick={handleRestart} className="flex-1 bg-transparent">
                          Start Over
                        </Button>
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                          <Link href="/contact">Contact for Help</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 6 && (
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="gap-2 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    {currentStep === 5 ? "View Results" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface QuestionBlockProps {
  icon: React.ElementType
  question: string
  description: string
  value: Answer
  onChange: (value: Answer) => void
}

function QuestionBlock({ icon: Icon, question, description, value, onChange }: QuestionBlockProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{question}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <RadioGroup
        value={value ?? ""}
        onValueChange={(val) => onChange(val as Answer)}
        className="flex gap-4"
      >
        <Label
          htmlFor={`${question}-yes`}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-colors ${
            value === "yes" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <RadioGroupItem value="yes" id={`${question}-yes`} className="sr-only" />
          <span className="font-medium">Yes</span>
        </Label>
        <Label
          htmlFor={`${question}-no`}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-colors ${
            value === "no" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <RadioGroupItem value="no" id={`${question}-no`} className="sr-only" />
          <span className="font-medium">No</span>
        </Label>
      </RadioGroup>
    </div>
  )
}
