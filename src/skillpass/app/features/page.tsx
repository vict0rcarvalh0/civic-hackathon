import { Check, ArrowRight, Shield, Wallet, LinkIcon, Zap, Globe, BarChart3, Lock } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturesPage() {
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
            <Zap className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Everything You Need for</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Web3 Success
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Authora combines powerful tools with simplicity to help creators, freelancers, and businesses thrive in the
            decentralized economy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-200"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the powerful tools that make Authora the ultimate Web3 onboarding platform
            </p>
          </div>

          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid grid-cols-4 mb-12 bg-transparent">
              <TabsTrigger
                value="identity"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 py-3"
              >
                <Shield className="w-5 h-5 mr-2" />
                Identity
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 py-3"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Wallet
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 py-3"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 py-3"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Secure Identity Verification</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Powered by Civic Auth, our identity verification system provides bank-level security without the
                    complexity. Create a verified Web3 identity in seconds, not hours.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "One-click social login with no passwords to remember",
                      "Privacy-first approach that puts you in control of your data",
                      "Enterprise-grade security with multi-factor authentication",
                      "Seamless integration with your existing accounts",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                      <Shield className="w-12 h-12 mb-4" />
                      <h4 className="text-2xl font-bold mb-2">Civic Auth Integration</h4>
                      <p className="text-blue-100">Industry-leading identity verification that respects your privacy</p>
                    </div>
                    <div className="p-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-gray-600">Identity Status</span>
                          <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-gray-600">Security Level</span>
                          <span className="text-sm font-medium text-blue-600">Enterprise</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-gray-600">Setup Time</span>
                          <span className="text-sm font-medium text-green-600">Under 2 minutes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
                      <Wallet className="w-12 h-12 mb-4" />
                      <h4 className="text-2xl font-bold mb-2">Embedded Wallet</h4>
                      <p className="text-green-100">Non-custodial crypto wallet with no technical setup</p>
                    </div>
                    <div className="p-8">
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Wallet Balance</p>
                        <p className="text-2xl font-bold text-gray-900">$2,847.50</p>
                        <p className="text-sm text-green-600">+12.5% this month</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-gray-600">USDC Balance</span>
                          <span className="text-sm font-medium text-gray-900">1,847.50</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-gray-600">ETH Balance</span>
                          <span className="text-sm font-medium text-gray-900">0.5234</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Instant Non-Custodial Wallet</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Get a fully-functional crypto wallet automatically created for you. No seed phrases to write down,
                    no browser extensions to install, just instant access to Web3.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Non-custodial design means you always own your assets",
                      "Multi-chain support for Ethereum, Solana, and more",
                      "Instant wallet generation with no technical setup",
                      "Secure backup and recovery options",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Frictionless Payment Links</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Share your personalized payment page and start receiving crypto payments instantly. No complex
                    addresses to copy, just a simple link that works everywhere.
                  </p>

                  <ul className="space-y-4">
                    {[
                      `Custom payment page at ${SITE_DOMAIN}/@yourname`,
                      "QR code generation for in-person payments",
                      "Support for multiple cryptocurrencies",
                      "Customizable payment forms with your branding",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-8 text-white">
                      <LinkIcon className="w-12 h-12 mb-4" />
                      <h4 className="text-2xl font-bold mb-2">Payment Links</h4>
                      <p className="text-yellow-100">Simple, shareable links for receiving crypto</p>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg mb-4">
                        <span className="text-sm text-gray-600">Your Payment Link</span>
                        <span className="text-sm font-medium text-blue-600">{`${SITE_DOMAIN}/@creator`}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <Globe className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white">
                      <BarChart3 className="w-12 h-12 mb-4" />
                      <h4 className="text-2xl font-bold mb-2">Real-time Analytics</h4>
                      <p className="text-purple-100">Track your earnings and growth with detailed insights</p>
                    </div>
                    <div className="p-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm text-gray-600">Monthly Revenue</span>
                          <span className="text-sm font-medium text-green-600">+24% vs last month</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm text-gray-600">New Customers</span>
                          <span className="text-sm font-medium text-green-600">+12 this week</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm text-gray-600">Average Transaction</span>
                          <span className="text-sm font-medium text-gray-900">$125.50</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Analytics</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Monitor your crypto income with our intuitive dashboard. Track transactions, analyze trends, and
                    gain insights to grow your Web3 business.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Real-time transaction monitoring and notifications",
                      "Detailed reports on earnings, customers, and growth",
                      "Export functionality for accounting and taxes",
                      "Custom dashboard with the metrics that matter to you",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">More Powerful Features</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover all the tools and capabilities that make Authora the ultimate Web3 platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Accessibility",
                description: "Accept payments from anywhere in the world with no geographical restrictions.",
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-level encryption and security protocols to keep your assets safe.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Near-instant transactions with minimal fees across multiple blockchains.",
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Experience Authora?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already earning crypto with Authora. No setup fees, no monthly costs,
                just simple Web3 payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-200 text-lg px-8 py-4"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}