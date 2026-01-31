import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Shield, 
  FileText, 
  BarChart3, 
  UserX, 
  FileQuestion, 
  Clock,
  CheckCircle2,
  Bot,
  Eye
} from "lucide-react"

const problems = [
  {
    icon: UserX,
    title: "Middlemen Exploitation",
    description: "Agents and lawyers charge high fees for simple paperwork that families cannot afford.",
  },
  {
    icon: FileQuestion,
    title: "Confusing Legal Jargon",
    description: "Complex legal language prevents families from understanding their entitlements.",
  },
  {
    icon: Clock,
    title: "Manual Paperwork",
    description: "Endless visits to offices and hunting for correct forms wastes precious time.",
  },
]

const solutions = [
  {
    icon: CheckCircle2,
    title: "Plain English Questions",
    description: "Simple symptom-based questions replace confusing legal terminology.",
  },
  {
    icon: Bot,
    title: "Automated Forms",
    description: "We generate your complete application dossier ready for submission.",
  },
  {
    icon: Eye,
    title: "Transparent Tracking",
    description: "Track your application status and report any issues directly to officials.",
  },
]

const stats = [
  { value: "21", label: "RPWD Categories Covered" },
  { value: "₹2,000+", label: "Monthly Allowance Possible" },
  { value: "1", label: "Office Visit Required" },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Shield className="h-4 w-4" />
                Free & Transparent Service
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Unlock Your Government Benefits
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                A digital bridge automating complex legal journeys for vulnerable families. 
                Check your eligibility, generate application forms, and track your benefits 
                - all in one place.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="gap-2 px-8">
                  <Link href="/eligibility">
                    Check Eligibility Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The Problems We Solve
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Families with disabled members face numerous obstacles when trying to access 
                their rightful government benefits.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem) => (
                <Card key={problem.title} className="border-destructive/20 bg-destructive/5">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <problem.icon className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{problem.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{problem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Solution
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                We replace jargon with simple questions, automate forms, and provide 
                a direct tracking dashboard.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((solution) => (
                <Card key={solution.title} className="border-primary/20 bg-card">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <solution.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{solution.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{solution.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Three simple steps to access your benefits
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Check Eligibility</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Answer simple questions about your condition to find out which benefits you qualify for.
                </p>
                <div className="mt-6">
                  <FileText className="h-16 w-16 text-primary/20" />
                </div>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Generate Dossier</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Provide your details and we create a complete application dossier ready to print.
                </p>
                <div className="mt-6">
                  <FileText className="h-16 w-16 text-primary/20" />
                </div>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Track & Submit</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Take your dossier to the DDAWO office and track your application through our dashboard.
                </p>
                <div className="mt-6">
                  <BarChart3 className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/eligibility">
                  Start Your Application
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Claim Your Benefits?
            </h2>
            <p className="mt-4 text-pretty text-lg text-primary-foreground/80">
              Join thousands of families who have successfully accessed their government 
              entitlements through our simple process.
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
