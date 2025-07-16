import { ArrowRight, Shield, Wallet, Link, BarChart3, CheckCircle, Sparkles, Zap } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple Process
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">How</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Authora Works
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            From zero to Web3 hero in minutes. No technical knowledge required, no complex setup, just simple steps to
            start earning crypto.
          </p>
        </div>
      </section>

      {/* Main Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12">
            {[
              {
                step: "01",
                title: "Sign Up with Civic Auth",
                description:
                  "Create your account using our secure, privacy-first authentication system. No passwords to remember, just your email or social login.",
                features: [
                  "One-click social login",
                  "Bank-level security",
                  "Privacy-first approach",
                  "No password required",
                ],
                icon: Shield,
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100",
              },
              {
                step: "02",
                title: "Get Your Instant Wallet",
                description:
                  "Receive a non-custodial crypto wallet automatically. No seed phrases to write down, no browser extensions to install.",
                features: ["Non-custodial wallet", "No seed phrases", "Instant generation", "Multi-chain support"],
                icon: Wallet,
                gradient: "from-green-500 to-green-600",
                bgGradient: "from-green-50 to-green-100",
              },
              {
                step: "03",
                title: "Share Your Payment Link",
description: `Get your personalized payment page at ${SITE_DOMAIN}/@yourname. Share it anywhere to start receiving crypto payments.`,
                features: [
                  "Custom payment page",
                  "QR code generation",
                  "Social media ready",
                  "Professional appearance",
                ],
                icon: Link,
                gradient: "from-yellow-500 to-orange-500",
                bgGradient: "from-yellow-50 to-orange-100",
              },
              {
                step: "04",
                title: "Track Your Earnings",
                description:
                  "Monitor your crypto income with our intuitive dashboard. View transactions, manage tokens, and track your growth.",
                features: ["Real-time balance", "Transaction history", "Multi-token support", "Analytics dashboard"],
                icon: BarChart3,
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-100",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg mr-4`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="text-2xl font-bold text-gray-400 px-4 py-2">
                      {item.step}
                    </Badge>
                  </div>

                  <h2 className="text-4xl font-bold text-gray-900 mb-6">{item.title}</h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">{item.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <Card
                    className={`bg-gradient-to-br ${item.bgGradient} border-0 shadow-2xl transform hover:scale-105 transition-all duration-500`}
                  >
                    <CardContent className="p-12">
                      <div className="text-center">
                        <div
                          className={`w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}
                        >
                          <item.icon className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Step {item.step}</h3>
                        <p className="text-gray-600">{item.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Why Choose Authora?</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            We've eliminated every friction point in Web3 onboarding so you can focus on what matters most - your work.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "No Technical Knowledge",
                description:
                  "Built for creators, not crypto experts. If you can use social media, you can use Authora.",
                icon: Zap,
              },
              {
                title: "Bank-Level Security",
                description: "Civic Auth provides enterprise-grade security without compromising user experience.",
                icon: Shield,
              },
              {
                title: "Instant Setup",
                description: "From signup to first payment in under 5 minutes. No waiting, no complexity.",
                icon: ArrowRight,
              },
            ].map((benefit, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Web3 Journey?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already earning crypto with Authora. No setup fees, no monthly costs,
                just simple Web3 payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4"
                >
                  Watch Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}