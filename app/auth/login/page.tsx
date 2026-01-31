"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Mail, Lock, Fingerprint, AlertCircle, Loader2 } from "lucide-react"
import { authenticateWithPasskey, isPlatformAuthenticatorAvailable } from "@/lib/webauthn"
import { Suspense } from "react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/my-documents"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passkeySupported, setPasskeySupported] = useState<boolean | null>(null)
  const [hasPasskey, setHasPasskey] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setPasskeySupported)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if user has passkey set up
        const { data: profile } = await supabase
          .from("profiles")
          .select("passkey_credential_id")
          .eq("id", data.user.id)
          .single()

        if (profile?.passkey_credential_id) {
          setHasPasskey(true)
        }

        router.push(redirectTo)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()

      // First, get user's email to find their passkey credential
      if (!formData.email) {
        setError("Please enter your email address first")
        setLoading(false)
        return
      }

      // Look up the user's passkey credential by email
      const { data: profiles, error: lookupError } = await supabase
        .from("profiles")
        .select("id, passkey_credential_id, full_name")
        .eq("email", formData.email)
        .single()

      if (lookupError || !profiles?.passkey_credential_id) {
        setError("No passkey found for this email. Please use password login or set up a passkey first.")
        setLoading(false)
        return
      }

      // Authenticate with passkey
      const assertion = await authenticateWithPasskey(profiles.passkey_credential_id)

      if (assertion) {
        // Passkey verified - now sign in with a special flow
        // For simplicity, we'll require password for first login, then passkey for document access
        setError("Passkey verified! Please enter your password to complete login.")
      } else {
        setError("Passkey authentication failed. Please try again or use password.")
      }
    } catch (err) {
      setError("Passkey authentication failed. Please try password login.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Log in to access your documents</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="passkey" disabled={passkeySupported === false}>
              <Fingerprint className="mr-2 h-4 w-4" />
              Passkey
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="passkey" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passkey-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passkey-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-dashed p-6 text-center">
                <Fingerprint className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Use your fingerprint or face to log in securely
                </p>
              </div>

              <Button onClick={handlePasskeyLogin} disabled={loading || !formData.email} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Authenticate with Passkey
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-4 rounded-lg bg-muted p-3 text-center">
          <p className="text-xs text-muted-foreground">
            <strong>NGO Workers:</strong>{" "}
            <Link href="/ngo-access/login" className="text-primary hover:underline">
              Access beneficiary documents here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
