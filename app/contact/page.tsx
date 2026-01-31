import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Building2,
  ExternalLink,
  ArrowRight
} from "lucide-react"

const contacts = [
  {
    title: "Commissionerate for Welfare of the Differently Abled",
    description: "State-level department overseeing disability welfare in Tamil Nadu",
    email: "scd.tn@nic.in",
    alternateEmail: "scdatn@gmail.com",
    website: "https://cms.tn.gov.in/sites/default/files/welfare/diff_abled.html",
  },
  {
    title: "District DDAWO Offices",
    description: "District-level offices for application submission and queries",
    note: "Contact your respective district DDAWO office for local assistance",
  },
  {
    title: "District Collector Office",
    description: "For grievances and escalations",
    email: "collchn@nic.in",
    note: "Format varies by district (e.g., collchn@nic.in for Chennai)",
  },
]

const onlineResources = [
  {
    title: "UDID Portal",
    description: "Unique Disability ID Card registration and status",
    url: "https://swavlambancard.gov.in",
  },
  {
    title: "TN e-Sevai",
    description: "Tamil Nadu electronic services portal",
    url: "https://www.tnesevai.tn.gov.in",
  },
  {
    title: "RPWD Act 2016",
    description: "Full text of the Rights of Persons with Disabilities Act",
    url: "https://legislative.gov.in/sites/default/files/A2016-49_1.pdf",
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <main className="flex-1 bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Contact & Resources
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Official contacts and helpful resources for disability welfare in Tamil Nadu
            </p>
          </div>

          {/* Official Contacts */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Official Contacts</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.title}>
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3 text-lg">
                      <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {contact.title}
                    </CardTitle>
                    <CardDescription>{contact.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.alternateEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${contact.alternateEmail}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {contact.alternateEmail}
                        </a>
                      </div>
                    )}
                    {contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {contact.note && (
                      <p className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                        {contact.note}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Online Resources */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Online Resources</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {onlineResources.map((resource) => (
                <Card key={resource.title} className="transition-colors hover:border-primary/50">
                  <CardContent className="p-4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-foreground">{resource.title}</h3>
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* District Offices Info */}
          <section className="mb-12">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Finding Your Local DDAWO Office
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Each district in Tamil Nadu has a District Differently Abled Welfare 
                      Office (DDAWO). To find your local office:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Visit your district collectorate website
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Look for the Social Welfare or Differently Abled Welfare section
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Contact the Tahsildar office in your taluk for directions
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ-style Help */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">Need Help?</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground">
                    {"I don't know which office to contact"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start with your local DDAWO office at the district collectorate. 
                    They can guide you to the right department based on your needs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground">
                    My application has been pending for too long
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Use our dashboard to track your application status. If there are 
                    unusual delays, use the grievance reporting feature to escalate 
                    directly to district officials.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground">
                    {"I was asked to pay a bribe"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This is illegal. Document the incident and report it immediately 
                    using our grievance reporting feature, which sends a pre-formatted 
                    complaint to the District Collector and state officials.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-lg bg-secondary/50 p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {"Haven't started your application yet?"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              Check your eligibility and generate your application dossier for free.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="gap-2">
                <Link href="/eligibility">
                  Check Eligibility
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Track Existing Application</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
