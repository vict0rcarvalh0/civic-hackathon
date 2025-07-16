import { ArrowRight, Shield, Wallet, Link, BarChart3, CheckCircle, Sparkles, Zap } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black pt-20 relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-purple-500/12 to-pink-500/12 rounded-full blur-xl animate-float" style={{ animationDelay: '0s', animationDuration: '14s' }}></div>
        <div className="absolute top-80 left-10 w-16 h-16 bg-gradient-to-br from-blue-700/15 to-purple-600/15 rounded-full blur-lg animate-float" style={{ animationDelay: '2s', animationDuration: '16s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-blue-700/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s', animationDuration: '18s' }}></div>
        <div className="absolute top-60 left-1/2 w-12 h-12 bg-gradient-to-br from-purple-600/18 to-pink-500/18 rounded-full blur-md animate-float" style={{ animationDelay: '1s', animationDuration: '12s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-br from-blue-700/20 to-purple-500/20 rounded-full blur-sm animate-float" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center relative">
          <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple Process
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">How</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillPass Works
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            From zero to validated professional in minutes. No complex setup, just simple steps to
            start building your reputation through peer validation.
          </p>
        </div>
      </section>

      {/* Main Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
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
                gradient: "purple",
              },
              {
                step: "02",
                title: "Get Your Instant Wallet",
                description:
                  "Receive a non-custodial crypto wallet automatically. No seed phrases to write down, no browser extensions to install.",
                features: ["Non-custodial wallet", "No seed phrases", "Instant generation", "Multi-chain support"],
                icon: Wallet,
                gradient: "blue",
              },
              {
                step: "03",
                title: "Add Your Skills",
                description: "Create your professional profile by adding skills you want validated. Organize them by category and expertise level.",
                features: [
                  "Custom skill categories",
                  "Expertise levels",
                  "Detailed descriptions",
                  "Professional portfolio",
                ],
                icon: Link,
                gradient: "pink",
              },
              {
                step: "04",
                title: "Get Peer Endorsements",
                description:
                  "Colleagues and clients can endorse your skills by staking crypto. This creates meaningful validation backed by real economic value.",
                features: [
                  "Stake-backed endorsements",
                  "Peer validation",
                  "Economic incentives",
                  "Quality assurance",
                ],
                icon: BarChart3,
                gradient: "purple",
              },
            ].map((item, index) => (
              <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center mb-6">
                    <div className={`bg-${item.gradient}-600 text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                      {item.step}
                    </div>
                    <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">{item.description}</p>
                  <div className="space-y-4">
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className={`bg-white/5 border-white/10 backdrop-blur-sm ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <CardContent className="p-8">
                    <div className={`bg-${item.gradient}-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                      <item.icon className="w-8 h-8 text-white" />
                        </div>
                    <h4 className="text-xl font-semibold text-white mb-4">Step {item.step}</h4>
                    <p className="text-gray-400 mb-6">
                      {item.step === "01" && "Secure authentication powered by Civic's decentralized identity platform."}
                      {item.step === "02" && "Your keys, your crypto. We never have access to your wallet or funds."}
                      {item.step === "03" && "Build a comprehensive skill profile that showcases your expertise."}
                      {item.step === "04" && "Real validation from peers who put their reputation and money where their mouth is."}
                    </p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Time to complete</span>
                        <span className="text-purple-300 font-medium">
                          {item.step === "01" && "< 2 minutes"}
                          {item.step === "02" && "Instant"}
                          {item.step === "03" && "5-10 minutes"}
                          {item.step === "04" && "Ongoing"}
                        </span>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02] relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Why Choose SkillPass?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Unlike traditional skill validation systems, SkillPass creates real incentives for honest, quality endorsements.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Trustworthy Validation",
                description: "Endorsements backed by crypto stakes ensure only genuine validations, preventing spam and fake reviews.",
              },
              {
                icon: Zap,
                title: "Instant Recognition",
                description: "Build your professional reputation in real-time as you receive validated endorsements from peers.",
              },
              {
                icon: BarChart3,
                title: "Measurable Impact",
                description: "Track your reputation score and see how your validated skills impact your professional opportunities.",
              },
            ].map((benefit, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">
              Common questions about how SkillPass validation works
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How do staked endorsements work?",
                answer: "When someone endorses your skill, they stake a small amount of crypto. If the endorsement is validated by the community as accurate, they get their stake back plus a reward. If it's deemed inaccurate, they lose their stake.",
              },
              {
                question: "Who can endorse my skills?",
                answer: "Anyone with verified credentials in your field can endorse your skills. This includes colleagues, clients, managers, or other professionals who have worked with you and can vouch for your abilities.",
              },
              {
                question: "How is my reputation score calculated?",
                answer: "Your reputation score is based on the number and quality of validated endorsements, the stakes backing them, and feedback from the community. Higher stakes and endorsements from highly-rated validators carry more weight.",
              },
              {
                question: "Is my data secure?",
                answer: "Yes, your professional data is encrypted and stored on decentralized networks. You control your data and can export or delete it at any time. We never have access to your private keys or funds.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Validate Your Skills?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join professionals who are building trust through peer validation. Start your journey today.
              </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            Create Your Profile
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
        </div>
      </section>
    </div>
  )
}