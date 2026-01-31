import Link from "next/link"
import { Phone, Mail, MapPin, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand & Disclaimer */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">JE</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                Just-Ease
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This is guidance software, not an official government website. 
                Information provided is for reference only. Please verify all details with official sources.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link href="/eligibility" className="text-sm text-muted-foreground hover:text-foreground">
                Check Eligibility
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Official Contacts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Commissionerate for Welfare of the Differently Abled, Chennai, Tamil Nadu
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">DDAWO Office</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a 
                  href="mailto:scd.tn@nic.in" 
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  scd.tn@nic.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Just-Ease. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built to help families access their rightful benefits
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
