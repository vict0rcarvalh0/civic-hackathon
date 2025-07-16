import { ArrowRight, Heart, Target, Users, Award, Twitter, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
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
            <Heart className="w-3 h-3 mr-1" />
            Our Story
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Building the</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Future of Web3
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            We believe Web3 should be accessible to everyone, not just crypto experts. Authora is our mission to
            democratize decentralized finance for creators worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To eliminate the technical barriers that prevent creators from accessing Web3 opportunities and earning crypto.",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Heart,
                title: "Our Vision",
                description:
                  "A world where anyone can participate in the decentralized economy without needing technical expertise.",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: Users,
                title: "Our Values",
                description:
                  "Simplicity, security, and accessibility. We put user experience first while maintaining the highest security standards.",
                gradient: "from-yellow-500 to-orange-500",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The driving forces behind Authora's mission to simplify Web3 for everyone.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Founder Card */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="relative">
                    <img
                      src="https://dafi.hacktivators.com/team/dev1.jpg"
                      alt="Java Jay Bartolome"
                      className="w-full h-96 lg:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Java Jay Bartolome</h3>
                      <p className="text-xl text-blue-600 font-medium mb-4">Founder & Developer</p>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        Civic Verified Developer
                      </Badge>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      "I built Authora because I saw too many talented creators struggling with Web3's complexity. As a developer who's worked in both traditional and decentralized systems, I knew there had to be a better way."
                    </p>

                    <div className="flex space-x-4 mt-auto">
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        <Twitter className="w-4 h-4 mr-2" />
                        Follow
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Co-Founder Card */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="relative">
                    <img
                      src="https://avatars.githubusercontent.com/u/140808788?v=4"
                      alt="SyntaxSurge"
                      className="w-full h-96 lg:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">SyntaxSurge</h3>
                      <p className="text-xl text-green-600 font-medium mb-4">Co-Founder</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      "Passionate about building the future of the decentralized web. My focus is on creating intuitive and powerful tools that empower users and developers alike."
                    </p>

                    <div className="flex space-x-4 mt-auto">
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        <Twitter className="w-4 h-4 mr-2" />
                        Follow
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
                <p className="text-xl text-gray-600">Making Web3 accessible, one creator at a time</p>
              </div>

              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "10K+", label: "Creators Onboarded", gradient: "from-blue-500 to-blue-600" },
                  { number: "$2M+", label: "Payments Processed", gradient: "from-green-500 to-green-600" },
                  { number: "50+", label: "Countries Served", gradient: "from-yellow-500 to-orange-500" },
                  { number: "99.9%", label: "Uptime", gradient: "from-red-500 to-pink-500" },
                ].map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered By Industry Leaders</h2>
            <p className="text-xl text-gray-600">Built on trusted, secure infrastructure</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Hacktivators */}
            <Card className="bg-gradient-to-br from-gray-900 to-blue-900 border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img
                    src="/partners/hacktivators-logo.svg"
                    alt="Hacktivators"
                    className="h-12 w-auto mr-4 brightness-150"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Hacktivators</h3>
                    <p className="text-blue-300 font-medium">CODE. CREATE. CONQUER.</p>
                  </div>
                </div>
                <p className="text-gray-200 leading-relaxed mb-4">
                  A rebellion of multidisciplinary professionals, engineers, coders, builders, and dreamers.
                  Hacktivators brings together the brightest minds who see beyond the limitations of today's technology.
                </p>
                <p className="text-gray-200 leading-relaxed">
                  We don't adapt to the system — we rewrite it. As creators of the future and architects of rebellion,
                  we stand as the vanguard of technological revolution.
                </p>
              </CardContent>
            </Card>

            {/* Civic */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img src="/partners/civic-logo.svg" alt="Civic" className="h-12 w-auto mr-4 filter brightness-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Civic</h3>
                    <p className="text-green-600 font-medium">Decentralized Identity Leaders</p>
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
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Be part of the Web3 revolution. Help us make decentralized finance accessible to creators everywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 font-medium"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white text-lg px-8 py-4"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
