import { Check, ArrowRight, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
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
            Simple Pricing
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Transparent Pricing,</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              No Surprises
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Choose the plan that's right for you. Start for free and scale as you grow with our flexible pricing
            options.
          </p>
        </div>
      </section>

      {/* Pricing Tabs */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-blue-100/50">
                <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="annual" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Annual (Save 20%)
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                    <p className="text-gray-600">Perfect for beginners</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">$0</span>
                      <span className="text-gray-600 ml-2">/ month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Civic Auth Identity",
                        "Basic Embedded Wallet",
                        "1 Payment Link",
                        "Accept up to $1,000/month",
                        "Basic Analytics",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      size="lg"
                    >
                      Get Started Free
                    </Button>
                  </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 border-0 relative">
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge className="bg-yellow-400 text-yellow-900 border-0 px-3 py-1 font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      MOST POPULAR
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                    <p className="text-blue-100">For growing creators</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$29</span>
                      <span className="text-blue-100 ml-2">/ month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Everything in Starter",
                        "Advanced Wallet Features",
                        "5 Custom Payment Links",
                        "Accept up to $10,000/month",
                        "Detailed Analytics Dashboard",
                        "Priority Support",
                        "Custom Branding",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
                      Start Pro Plan
                    </Button>
                  </CardFooter>
                </Card>

                {/* Business Plan */}
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">Business</CardTitle>
                    <p className="text-gray-600">For teams and businesses</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">$99</span>
                      <span className="text-gray-600 ml-2">/ month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Everything in Professional",
                        "Unlimited Payment Links",
                        "Unlimited Transaction Volume",
                        "Team Management",
                        "API Access",
                        "Advanced Security Features",
                        "Dedicated Account Manager",
                        "Custom Integration Support",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      size="lg"
                    >
                      Contact Sales
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="annual">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                    <p className="text-gray-600">Perfect for beginners</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">$0</span>
                      <span className="text-gray-600 ml-2">/ year</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Civic Auth Identity",
                        "Basic Embedded Wallet",
                        "1 Payment Link",
                        "Accept up to $1,000/month",
                        "Basic Analytics",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      size="lg"
                    >
                      Get Started Free
                    </Button>
                  </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 border-0 relative">
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge className="bg-yellow-400 text-yellow-900 border-0 px-3 py-1 font-medium">
                      <Star className="w-3 h-3 mr-1" />
                      MOST POPULAR
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                    <p className="text-blue-100">For growing creators</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$279</span>
                      <span className="text-blue-100 ml-2">/ year</span>
                      <p className="text-sm text-blue-100 mt-1">Save $69 compared to monthly</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Everything in Starter",
                        "Advanced Wallet Features",
                        "5 Custom Payment Links",
                        "Accept up to $10,000/month",
                        "Detailed Analytics Dashboard",
                        "Priority Support",
                        "Custom Branding",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
                      Start Pro Plan
                    </Button>
                  </CardFooter>
                </Card>

                {/* Business Plan */}
                <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">Business</CardTitle>
                    <p className="text-gray-600">For teams and businesses</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">$948</span>
                      <span className="text-gray-600 ml-2">/ year</span>
                      <p className="text-sm text-green-600 mt-1">Save $240 compared to monthly</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {[
                        "Everything in Professional",
                        "Unlimited Payment Links",
                        "Unlimited Transaction Volume",
                        "Team Management",
                        "API Access",
                        "Advanced Security Features",
                        "Dedicated Account Manager",
                        "Custom Integration Support",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      size="lg"
                    >
                      Contact Sales
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing and plans</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Can I switch plans later?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the end of your current billing cycle.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, and cryptocurrency payments including Bitcoin, Ethereum, USDC, and more. Bank transfers are available for annual plans.",
              },
              {
                question: "Is there a free trial for paid plans?",
                answer:
                  "Yes, both the Professional and Business plans come with a 14-day free trial. No credit card is required to start your trial.",
              },
              {
                question: "Are there any transaction fees?",
                answer:
                  "The Starter plan has a 2% transaction fee. The Professional plan has a 1% transaction fee. The Business plan has a 0.5% transaction fee. Network gas fees may apply separately.",
              },
              {
                question: "What happens if I exceed my monthly transaction limit?",
                answer:
                  "If you exceed your monthly transaction limit on the Starter or Professional plan, additional transactions will be charged at 1.5% per transaction. We'll notify you when you're approaching your limit.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators already using Authora to accept crypto payments with zero friction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
            >
              Contact Sales
            </Button>
          </div>
          <p className="text-blue-100 mt-6">No credit card required to start</p>
        </div>
      </section>
    </div>
  )
}
