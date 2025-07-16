import { ArrowRight, Heart, Target, Users, Award, Twitter, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
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
            <Heart className="w-3 h-3 mr-1" />
            Our Story
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Building the</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Future of Skills
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            We believe professional validation should be transparent, fair, and community-driven. SkillPass is our mission to
            revolutionize how skills are recognized and trusted.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description:
                  "To create a transparent, stake-based system where professional skills are validated by peers with skin in the game.",
                gradient: "purple",
              },
              {
                icon: Heart,
                title: "Our Vision",
                description:
                  "A world where your skills speak for themselves, backed by a community that invests in your success.",
                gradient: "pink",
              },
              {
                icon: Users,
                title: "Our Values",
                description:
                  "Transparency, community, and merit. We believe the best validation comes from those who truly understand the work.",
                gradient: "blue",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-${item.gradient}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why SkillPass?</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-400 leading-relaxed">
                  Traditional hiring relies on degrees, certifications, and references that can be gamed or don't reflect real-world ability. We saw talented professionals struggling to prove their worth while mediocre candidates advanced based on credentials alone.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  SkillPass changes this by creating a system where your peers validate your skills by putting their own reputation and money at stake. When someone endorses you, they're not just clicking a button – they're making a meaningful investment in your success.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  This creates a virtuous cycle: validators are incentivized to be honest and thorough, while skilled professionals get the recognition they deserve backed by real economic value.
            </p>
          </div>
                  </div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Merit-Based Recognition</h4>
                      <p className="text-gray-400 text-sm">Skills validated by actual practitioners</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Community Driven</h4>
                      <p className="text-gray-400 text-sm">Peer validation with economic incentives</p>
                </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Transparent Process</h4>
                      <p className="text-gray-400 text-sm">All validations recorded on blockchain</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built by Practitioners</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our team has experienced the frustration of broken hiring systems firsthand. We're building the solution we wish existed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Tech Team",
                role: "Engineering & Design",
                description: "Experienced developers and designers who understand the pain of skill-based hiring",
                icon: Github,
              },
              {
                name: "Community",
                role: "Early Adopters",
                description: "Professionals from various fields helping us build a fair validation system",
                icon: Users,
              },
              {
                name: "Advisors",
                role: "Industry Experts",
                description: "Leaders in Web3, HR, and professional development guiding our mission",
                icon: Award,
              },
            ].map((member, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <member.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-300 text-sm mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.description}</p>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-400 mb-10">
            Help us build a fairer, more transparent way to validate professional skills. Your expertise and feedback are invaluable.
              </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Start Your Profile
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            <Button size="lg" variant="outline" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
              Join Community
                </Button>
              </div>

          <div className="flex justify-center space-x-6">
            {[
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Mail, href: "mailto:hello@skillpass.app", label: "Email" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
