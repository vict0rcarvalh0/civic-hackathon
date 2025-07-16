import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-purple-700 border-white/30 hover:bg-white/30 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                LinkedIn with Skin in the Game
              </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Skills Passport.
            </span>
            <br />
            <span className="text-gray-900">Reputation Staking.</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Verified Talents.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
            Build your Web3 reputation with skill endorsements backed by crypto stakes. Get validated by your peers with skin in the game.
          </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-gray-700 hover:bg-white/30 shadow-lg text-lg px-8 py-4"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative">
              <div className="relative z-10">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Civic Verified</p>
                            <p className="text-sm text-gray-600">Identity Confirmed</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                      </div>

                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-2">Wallet Balance</p>
                        <p className="text-2xl font-bold text-gray-900">$2,847.50</p>
                        <p className="text-sm text-green-600">+12.5% this month</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <span className="text-sm text-gray-600">Payment Link</span>
                          <span className="text-sm font-medium text-purple-600">{`${SITE_DOMAIN}/@you`}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <span className="text-sm text-gray-600">Recent Payment</span>
                          <span className="text-sm font-medium text-green-600">+$125 USDC</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Skill Validation",
                description: "Add your skills and get them endorsed by community members",
                gradient: "from-blue-500 to-purple-600",
              },
              {
                icon: Zap,
                title: "Reputation Staking",
                description: "Others stake crypto to validate your skills with skin in the game",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: ArrowRight,
                title: "Public Profiles",
                description: "Showcase your validated skills and reputation score",
                gradient: "from-pink-500 to-red-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered By Visionaries</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built in partnership with industry leaders who share our vision of accessible Web3
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Hacktivators */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img src="/partners/hacktivators-logo.svg" alt="Hacktivators" className="h-12 w-auto mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Hacktivators</h3>
                    <p className="text-purple-600 font-medium">CODE. CREATE. CONQUER.</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  A rebellion of multidisciplinary professionals, engineers, coders, builders, and dreamers.
                  Hacktivators brings together the brightest minds who see beyond the limitations of today's technology.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We don't adapt to the system — we rewrite it. As creators of the future and architects of rebellion,
                  we stand as the vanguard of technological revolution.
                </p>
              </CardContent>
            </Card>

            {/* Civic */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img src="/partners/civic-logo.svg" alt="Civic" className="h-12 w-auto mr-4 filter brightness-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Civic</h3>
                    <p className="text-purple-600 font-medium">Decentralized Identity Leaders</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Working toward a world where identity is defined not only by documents, but also personality — where
                  unique expression contributes to the security of digital identity that you own and control.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Identity is a fundamental human right and should be universally accessible. As leaders in
                  decentralized identity since 2015, we're building this future with confidence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Enter Web3?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of creators already earning crypto with Authora. No technical knowledge required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Link href="/how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-gray-700 hover:bg-white/30 shadow-lg"
                  >
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}