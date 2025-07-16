import { Sparkles, Twitter, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-8">
              Get the latest updates on Web3 onboarding, new features, and crypto payment trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Authora</span>
            </div>
            <p className="text-blue-100 mb-6 max-w-md">
              Frictionless Web3 onboarding for creators, freelancers, and small businesses. Accept crypto payments
              without the complexity.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/10">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/10">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/10">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "/features" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Dashboard", href: "/dashboard" },
                { name: "Pricing", href: "/pricing" },
                { name: "API Docs", href: "/docs" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-blue-200 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { name: "About", href: "/about" },
                { name: "Blog", href: "/blog" },
                { name: "Careers", href: "/careers" },
                { name: "Press", href: "/press" },
                { name: "Partners", href: "/partners" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-blue-200 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Contact Us", href: "/contact" },
                { name: "Status", href: "/status" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-blue-200 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-blue-200">
            <p>&copy; 2025 SkillPass. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                São Paulo, Brazil
              </span>

            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <img src="/partners/civic-logo.svg" alt="Civic" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  )
}
