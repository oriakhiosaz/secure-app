"use client"

import Link from "next/link"
import { Shield, QrCode, Lock, Eye, Copy, Smartphone, CheckCircle, ArrowRight, Star, Users, Zap } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: QrCode,
      title: "Easy Setup",
      description: "Add TOTP accounts by scanning QR codes or entering secrets manually",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Retain full control over your OTP secrets—never transmitted or exposed to third parties",
    },
    {
      icon: Eye,
      title: "Account Management",
      description: "View a list of all your accounts with rotating 6-digit codes",
    },
    {
      icon: Copy,
      title: "Backup & Migration",
      description: "Copy, remove, or view secrets for backup or migration purposes",
    },
    {
      icon: Smartphone,
      title: "Modern Interface",
      description: "Modern, responsive UI for a seamless experience across all devices",
    },
  ]

  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: Shield, value: "99.9%", label: "Uptime" },
    { icon: Star, value: "4.9/5", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center p-4 pt-12">
        <div className="max-w-6xl w-full">
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">SECURE OTP VAULT</h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                Privacy-first, security-focused authenticator app for managing your one-time passwords
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-100 mb-6">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Instant • Secure • Private</span>
              </div>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Take Control of Your Digital Security</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Effortlessly manage your one-time password (OTP) secrets for all your accounts with complete privacy
                  and security. Your secrets never leave your device.
                </p>
              </div>

              {/* CTA Button */}
              <div className="text-center mb-8">
                <Link
                  href="/vault"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Go to Your Vault
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Powerful Features</h2>
              <p className="text-purple-100">Everything you need for secure authentication</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Promise */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl p-8 text-center text-white mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your Privacy is Our Priority</h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto mb-6">
              All your OTP secrets are stored securely on your device. We never collect, transmit, or have access to your
              sensitive authentication data.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-100">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">100% Secure Storage • Zero Data Collection</span>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Secure Your Accounts?</h3>
              <p className="text-gray-600 mb-6">Start managing your TOTP codes with complete privacy and security.</p>
              <Link
                href="/vault"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <Shield className="w-5 h-5" />
                Access Your Vault
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-500">
        <p className="text-sm">Built with privacy and security in mind • All data stays on your device</p>
      </footer>
    </div>
  )
}
