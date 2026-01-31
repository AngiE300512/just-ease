"use client"

// WebAuthn utilities for passkey authentication
// This uses the browser's built-in WebAuthn API for fingerprint/biometric auth

export interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string
  rp: {
    name: string
    id: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    type: "public-key"
    alg: number
  }>
  timeout?: number
  attestation?: AttestationConveyancePreference
  authenticatorSelection?: {
    authenticatorAttachment?: AuthenticatorAttachment
    requireResidentKey?: boolean
    residentKey?: ResidentKeyRequirement
    userVerification?: UserVerificationRequirement
  }
}

export interface PublicKeyCredentialRequestOptionsJSON {
  challenge: string
  timeout?: number
  rpId?: string
  allowCredentials?: Array<{
    id: string
    type: "public-key"
    transports?: AuthenticatorTransport[]
  }>
  userVerification?: UserVerificationRequirement
}

// Check if WebAuthn is supported
export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  )
}

// Check if platform authenticator (fingerprint/face) is available
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

// Convert base64url to ArrayBuffer
function base64urlToArrayBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
  const padding = "=".repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(base64 + padding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

// Convert ArrayBuffer to base64url
function arrayBufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

// Generate a random challenge
export function generateChallenge(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return arrayBufferToBase64url(array.buffer)
}

// Register a new passkey
export async function registerPasskey(
  userId: string,
  userName: string,
  displayName: string
): Promise<{
  credentialId: string
  publicKey: string
  counter: number
} | null> {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported in this browser")
  }

  const challenge = generateChallenge()

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge: base64urlToArrayBuffer(challenge),
    rp: {
      name: "Just-Ease",
      id: window.location.hostname,
    },
    user: {
      id: new TextEncoder().encode(userId),
      name: userName,
      displayName: displayName,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256
      { type: "public-key", alg: -257 }, // RS256
    ],
    timeout: 60000,
    attestation: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      requireResidentKey: false,
      residentKey: "preferred",
      userVerification: "required",
    },
  }

  try {
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential | null

    if (!credential) {
      return null
    }

    const response = credential.response as AuthenticatorAttestationResponse

    return {
      credentialId: arrayBufferToBase64url(credential.rawId),
      publicKey: arrayBufferToBase64url(response.getPublicKey() || new ArrayBuffer(0)),
      counter: 0,
    }
  } catch (error) {
    console.error("Error creating passkey:", error)
    throw error
  }
}

// Authenticate with an existing passkey
export async function authenticateWithPasskey(
  credentialId: string
): Promise<{
  credentialId: string
  signature: string
  authenticatorData: string
  clientDataJSON: string
} | null> {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported in this browser")
  }

  const challenge = generateChallenge()

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: base64urlToArrayBuffer(challenge),
    timeout: 60000,
    rpId: window.location.hostname,
    allowCredentials: [
      {
        id: base64urlToArrayBuffer(credentialId),
        type: "public-key",
        transports: ["internal"],
      },
    ],
    userVerification: "required",
  }

  try {
    const assertion = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential | null

    if (!assertion) {
      return null
    }

    const response = assertion.response as AuthenticatorAssertionResponse

    return {
      credentialId: arrayBufferToBase64url(assertion.rawId),
      signature: arrayBufferToBase64url(response.signature),
      authenticatorData: arrayBufferToBase64url(response.authenticatorData),
      clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
    }
  } catch (error) {
    console.error("Error authenticating with passkey:", error)
    throw error
  }
}

// Quick biometric verification (for accessing documents)
export async function verifyWithBiometric(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false
  }

  const challenge = generateChallenge()

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: base64urlToArrayBuffer(challenge),
        timeout: 60000,
        rpId: window.location.hostname,
        userVerification: "required",
      },
    })

    return assertion !== null
  } catch {
    return false
  }
}
