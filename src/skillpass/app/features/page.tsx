import { Check, ArrowRight, Shield, Wallet, LinkIcon, Zap, Globe, BarChart3, Lock } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturesPage() {
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
            <Zap className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Everything You Need for</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skill Validation
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            SkillPass combines powerful tools with simplicity to help professionals build and validate their reputation
            in the decentralized economy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore the powerful tools that make SkillPass the ultimate skill validation platform
            </p>
          </div>

          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 grid grid-cols-4 mb-12">
              <TabsTrigger
                value="identity"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white py-3"
              >
                <Shield className="w-5 h-5 mr-2" />
                Identity
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white py-3"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Wallet
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white py-3"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white py-3"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Secure Digital Identity</h3>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Build a verified professional identity that travels with you across the Web3 ecosystem. Your skills, endorsements, and reputation in one secure profile.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Civic-powered authentication",
                      "Decentralized identity management",
                      "Cross-platform compatibility",
                      "Privacy-first design",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-4">Verified Professional Profile</h4>
                    <p className="text-gray-400">
                      Your identity is cryptographically secured and verified, giving employers and clients confidence in your credentials.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Multi-Chain Wallet</h3>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Seamlessly manage your assets across multiple blockchain networks. Receive stake payments and manage your reputation tokens.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Ethereum & Solana support",
                      "Non-custodial security",
                      "Seamless chain switching",
                      "Built-in stake management",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-4">Cross-Chain Assets</h4>
                    <p className="text-gray-400">
                      Manage your reputation stakes and endorsement rewards across multiple blockchain networks from one interface.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Skill Validation System</h3>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Get your skills endorsed by peers who put their reputation on the line. Build credibility through staked endorsements.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Peer-to-peer endorsements",
                      "Stake-backed validation",
                      "Reputation scoring algorithm",
                      "Skill categorization",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="bg-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <LinkIcon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-4">Trusted Endorsements</h4>
                    <p className="text-gray-400">
                      Endorsements backed by crypto stakes ensure validation quality and prevent spam or fake reviews.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">Reputation Analytics</h3>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Track your professional growth with detailed analytics on your skills, endorsements, and reputation score over time.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Real-time reputation tracking",
                      "Skill performance metrics",
                      "Endorsement analytics",
                      "Growth insights",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-4">Growth Insights</h4>
                    <p className="text-gray-400">
                      Understand which skills are most valued in your field and optimize your professional development strategy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02] relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Enterprise-Grade Security</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Your professional reputation is valuable. We protect it with the highest security standards.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "End-to-End Encryption",
                description: "All your data is encrypted both in transit and at rest using military-grade encryption.",
              },
              {
                icon: Lock,
                title: "Non-Custodial",
                description: "You control your keys and data. We never have access to your private information.",
              },
              {
                icon: Globe,
                title: "Decentralized Storage",
                description: "Your reputation data is distributed across multiple networks for maximum resilience.",
              },
            ].map((item, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your Reputation?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of professionals who are already validating their skills on SkillPass.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            Start Building Your Profile
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}