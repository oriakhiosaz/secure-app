"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Html5QrcodeScanner } from "html5-qrcode"
import { QrCode, Plus, ArrowLeft, CheckCircle, Shield, Scan, X } from "lucide-react"

function parseOtpAuthUri(uri) {
  try {
    if (!uri.startsWith("otpauth://totp/")) return null
    const [labelPart, paramsPart] = uri.replace("otpauth://totp/", "").split("?")
    const label = decodeURIComponent(labelPart.split(":").pop() || "")
    const params = new URLSearchParams(paramsPart)
    const secret = params.get("secret")
    const issuer = params.get("issuer") || ""
    if (!secret) return null
    return { label, secret, issuer }
  } catch {
    return null
  }
}

export default function AddAccount() {
  const [label, setLabel] = useState("")
  const [secret, setSecret] = useState("")
  const [issuer, setIssuer] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      })

      scanner.render(
        (data) => {
          const parsed = parseOtpAuthUri(data)
          if (parsed) {
            setLabel(parsed.label)
            setSecret(parsed.secret)
            setIssuer(parsed.issuer)
            setShowScanner(false)
            setError("")
            scanner.clear()
          } else {
            setError("Invalid QR code")
          }
        },
        (err) => {
          setError("QR scan failed")
        }
      )

      return () => {
        scanner.clear().catch(() => {})
      }
    }
  }, [showScanner])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    if (!secret) {
      setError("Secret is required (scan QR or enter manually)")
      return
    }
    const accounts = JSON.parse(localStorage.getItem("totp_accounts") || "[]")
    if (accounts.some((acc) => acc.secret === secret)) {
      setError("Account with this secret already exists")
      return
    }
    accounts.push({ label, secret, issuer })
    localStorage.setItem("totp_accounts", JSON.stringify(accounts))
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-green-100">Your TOTP account has been added successfully</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-6">You can now generate authentication codes for this account.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Accounts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-center">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center shadow-lg justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Add TOTP Account</h2>
          <p className="text-blue-100">Secure your accounts with two-factor authentication</p>
        </div>

        <div className="p-4">
          {/* QR Scanner Button */}
          <button
            onClick={() => setShowScanner(!showScanner)}
            className={`w-full mb-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              showScanner
                ? "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {showScanner ? (
              <>
                <X className="w-5 h-5" />
                Close QR Scanner
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5" />
                Scan QR Code
              </>
            )}
          </button>

          {/* QR Scanner */}
          {showScanner && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <Scan className="w-3 h-3" />
                <span className="text-sm font-medium">Position QR code within the frame</span>
              </div>
              <div id="reader" className="rounded-lg overflow-hidden" />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Label</label>
              <input
                type="text"
                placeholder="e.g., john@example.com"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <input
                type="text"
                placeholder="Base32 encoded secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuer (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Google, GitHub, etc."
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-4 py-3 font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
            >
              <Plus className="w-5 h-5" />
              Add Account
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-3 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Accounts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
