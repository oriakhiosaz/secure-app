"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { QRCode } from "qrcode.react"
import { SettingsIcon, Eye, EyeOff, Copy, CheckCircle, QrCode, ArrowLeft, Key, Download, Share2 } from "lucide-react"

function getOtpAuthUrl({ label, secret, issuer }) {
  const labelEncoded = encodeURIComponent(label || issuer || "Account")
  const issuerEncoded = encodeURIComponent(issuer || "")
  let url = `otpauth://totp/${labelEncoded}?secret=${secret}`
  if (issuer) url += `&issuer=${issuerEncoded}`
  return url
}

export default function Settings() {
  const [accounts, setAccounts] = useState([])
  const [showSecret, setShowSecret] = useState({})
  const [showQr, setShowQr] = useState({})
  const [copiedSecret, setCopiedSecret] = useState("")

  useEffect(() => {
    setAccounts(JSON.parse(localStorage.getItem("totp_accounts") || "[]"))
  }, [])

  const handleToggle = (secret) => {
    setShowSecret((prev) => ({ ...prev, [secret]: !prev[secret] }))
  }

  const handleCopy = async (secret) => {
    try {
      await navigator.clipboard.writeText(secret)
      setCopiedSecret(secret)
      setTimeout(() => setCopiedSecret(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleToggleQr = (secret) => {
    setShowQr((prev) => ({ ...prev, [secret]: !prev[secret] }))
  }

  const downloadQrCode = (account) => {
    const canvas = document.querySelector(`#qr-${account.secret.slice(0, 8)} canvas`)
    if (canvas) {
      const link = document.createElement("a")
      link.download = `${account.label || account.issuer || "account"}-qr.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const formatSecret = (secret) => {
    return secret.replace(/(.{4})/g, "$1 ").trim()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
            <p className="text-purple-100">Manage your TOTP accounts and security settings</p>
          </div>
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No accounts to manage</h3>
            <p className="text-gray-600 mb-6">Add some TOTP accounts first to manage their settings.</p>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Account
            </Link>
          </div>
        )}

        {/* Accounts List */}
        <div className="space-y-6 mb-8">
          {accounts.map((acc) => (
            <div
              key={acc.secret}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="p-6">
                {/* Account Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{acc.label || acc.issuer || "Account"}</h3>
                  {acc.issuer && acc.label && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Issuer:</span> {acc.issuer}
                    </p>
                  )}
                </div>

                {/* Secret Key Section */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Secret Key</span>
                  </div>

                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="font-mono text-sm text-gray-800 break-all">
                      {showSecret[acc.secret] ? formatSecret(acc.secret) : "•".repeat(32)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(acc.secret)}
                      className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium border border-gray-200"
                    >
                      {showSecret[acc.secret] ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Show
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(acc.secret)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                    >
                      {copiedSecret === acc.secret ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">QR Code</span>
                    </div>
                    <button
                      onClick={() => handleToggleQr(acc.secret)}
                      className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium border border-gray-200"
                    >
                      {showQr[acc.secret] ? "Hide QR" : "Show QR"}
                    </button>
                  </div>

                  {showQr[acc.secret] && (
                    <div className="bg-white rounded-xl p-6 text-center">
                      <div
                        id={`qr-${acc.secret.slice(0, 8)}`}
                        className="inline-block p-4 bg-white rounded-lg shadow-sm"
                      >
                        <QRCode value={getOtpAuthUrl(acc)} size={160} level="M" includeMargin={true} />
                      </div>
                      <p className="text-xs text-gray-500 mt-3 mb-4">Scan this QR code with your authenticator app</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => downloadQrCode(acc)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `${acc.label || acc.issuer || "Account"} - TOTP QR Code`,
                                text: "TOTP Authentication QR Code",
                              })
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Accounts
          </Link>
        </div>

        {/* Security Notice */}
        {accounts.length > 0 && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Security Notice</h4>
                <p className="text-sm text-amber-700">
                  Keep your secret keys and QR codes secure. Never share them publicly or store them in unsecured
                  locations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
