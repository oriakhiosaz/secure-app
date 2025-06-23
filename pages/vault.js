"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { authenticator } from "otplib"
import { Settings, Plus, Shield, Trash2, Copy, Clock, Eye, EyeOff, CheckCircle, Home } from "lucide-react"

function getAccounts() {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("totp_accounts") || "[]")
}

export default function VaultPage() {
  const [accounts, setAccounts] = useState([])
  const [codes, setCodes] = useState({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [copiedCode, setCopiedCode] = useState("")
  const [hiddenCodes, setHiddenCodes] = useState(new Set())

  useEffect(() => {
    setAccounts(getAccounts())
  }, [])

  useEffect(() => {
    const updateCodes = () => {
      const now = Date.now()
      const newCodes = {}
      for (const acc of accounts) {
        newCodes[acc.secret] = authenticator.generate(acc.secret)
      }
      setCodes(newCodes)

      // Calculate time left until next refresh
      const secondsElapsed = Math.floor(now / 1000) % 30
      setTimeLeft(30 - secondsElapsed)
    }

    updateCodes()
    const interval = setInterval(updateCodes, 1000)
    return () => clearInterval(interval)
  }, [accounts])

  const handleRemove = (secret) => {
    const filtered = accounts.filter((acc) => acc.secret !== secret)
    setAccounts(filtered)
    localStorage.setItem("totp_accounts", JSON.stringify(filtered))
  }

  const handleCopy = async (code, label) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const toggleCodeVisibility = (secret) => {
    const newHidden = new Set(hiddenCodes)
    if (newHidden.has(secret)) {
      newHidden.delete(secret)
    } else {
      newHidden.add(secret)
    }
    setHiddenCodes(newHidden)
  }

  const formatCode = (code) => {
    if (!code) return "------"
    return code.replace(/(.{3})/g, "$1 ").trim()
  }

  const getProgressPercentage = () => {
    return ((30 - timeLeft) / 30) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2">
            <Link
              href="/settings"
              className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5" />
            </Link>

            <Link href="/" className="absolute top-4 left-4 p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <Home className="w-5 h-5 text-white transition" />
              <span className="sr-only">Home</span>
            </Link>

            <div className="text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">OriakhiAuth</h1>
              <p className="text-blue-100">Secure two-factor TOTP authentication codes</p>
            </div>
          </div>

          {/* Timer Progress Bar */}
          {accounts.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Next refresh</span>
                    <span className="text-sm font-mono text-gray-800">{timeLeft}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Account Button */}
          <div className="p-6">
            <Link
              href="/add"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-6 py-4 font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Account
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-6">Add your first TOTP account to get started with secure authentication.</p>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </Link>
          </div>
        )}

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((acc) => (
            <div
              key={acc.secret}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{acc.label || acc.issuer || "Account"}</h3>
                    {acc.issuer && acc.label && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Issuer:</span> {acc.issuer}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(acc.secret)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Remove account"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm font-medium text-gray-600">Authentication Code</span>
                        <button
                          onClick={() => toggleCodeVisibility(acc.secret)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title={hiddenCodes.has(acc.secret) ? "Show code" : "Hide code"}
                        >
                          {hiddenCodes.has(acc.secret) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-3xl font-mono font-bold text-gray-800 tracking-wider">
                        {hiddenCodes.has(acc.secret) ? "••• •••" : formatCode(codes[acc.secret])}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(codes[acc.secret], acc.label)}
                      disabled={hiddenCodes.has(acc.secret)}
                      className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                      title="Copy code"
                    >
                      {copiedCode === codes[acc.secret] ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>

                {copiedCode === codes[acc.secret] && (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      Code copied to clipboard!
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        {accounts.length > 0 && (
          <div className="mt-1 text-center">
            <p className="text-sm text-gray-500">Codes refresh automatically every 30 seconds for enhanced security</p>
          </div>
        )}
      </div>
    </div>
  )
}
