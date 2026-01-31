import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Target, 
  Heart, 
  Users, 
  Shield,
  ArrowRight,
  CheckCircle2,
  Scale,
  FileText,
  Eye
} from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description: "We understand the challenges faced by families with disabled members and design every feature with empathy.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "No hidden fees, no middlemen. We provide clear guidance and direct access to official processes.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Our platform is designed for everyone, including those with cognitive disabilities and low digital literacy.",
  },
  {
    icon: Eye,
    title: "Accountability",
    description: "We help you track your application and report issues directly to officials, ensuring accountability.",
  },
]

const rpwdCategories = [
  "Blindness",
  "Low-vision",
  "Leprosy Cured persons",
  "Hearing Impairment",
  "Locomotor Disability",
  "Dwarfism",
  "Intellectual Disability",
  "Mental Illness",
  "Autism Spectrum Disorder",
  "Cerebral Palsy",
  "Muscular Dystrophy",
  "Chronic Neurological conditions",
  "Specific Learning Disabilities",
  "Multiple Sclerosis",
  "Speech and Language disability",
  "Thalassemia",
  "Hemophilia",
  "Sickle Cell disease",
  "Multiple Disabilities",
  "Acid Attack victim",
  "Parkinson's disease",
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About Just-Ease
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              We are a digital initiative aimed at simplifying the process of accessing 
              government disability benefits in Tamil Nadu. Our mission is to eliminate 
              barriers between eligible individuals and their rightful entitlements.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Our Mission</h2>
                  <p className="mt-2 text-muted-foreground">
                    To create a digital bridge that automates complex legal procedures for 
                    vulnerable families, ensuring they can access their government benefits 
                    without exploitation by middlemen or confusion from legal jargon.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Legal Framework</h2>
                  <p className="mt-2 text-muted-foreground">
                    We operate within the framework of the Rights of Persons with Disabilities 
                    Act, 2016 (RPWD Act) and Tamil Nadu state welfare schemes, providing 
                    guidance on accessing benefits under these provisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">What We Offer</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Free tools and guidance to help you access your benefits
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-card p-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Eligibility Assessment
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Simple yes/no questions that determine your eligibility without 
                  requiring you to understand complex legal categories.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6">
                <FileText className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Automated Dossier
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Generate a complete application package with pre-filled forms 
                  and a personalized checklist of required documents.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6">
                <Eye className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Transparent Tracking
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Monitor your application progress and report grievances directly 
                  to district officials without any intermediaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RPWD Categories Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                21 RPWD Categories Covered
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We help with applications for all disability categories under the RPWD Act 2016
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {rpwdCategories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-muted/50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="mt-1 h-6 w-6 shrink-0 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-foreground">Important Disclaimer</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Just-Ease is a guidance tool and is not affiliated with or 
                      endorsed by any government body. Information provided is for reference 
                      only and should be verified with official sources. We do not guarantee 
                      the approval of any application. For official queries, please contact 
                      your District DDAWO office or the Commissionerate for Welfare of the 
                      Differently Abled.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Check your eligibility in minutes and begin your journey to accessing 
              your rightful benefits.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 gap-2">
              <Link href="/eligibility">
                Check Eligibility Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
