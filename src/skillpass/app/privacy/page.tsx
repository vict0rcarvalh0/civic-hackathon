import { Shield, Eye, Lock, Users, FileText, Calendar } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black pt-20 relative overflow-hidden">
      {/* Atmospheric Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-pink-500/12 to-blue-500/12 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-32 w-32 h-32 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 left-1/3 w-28 h-28 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Privacy First
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Privacy </span>
            <span className="text-purple-400">Policy</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Your privacy is fundamental to everything we do. Learn how we collect, use, and protect your information and skills data.
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Last updated: July 16, 2025</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span>Version 3.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Privacy Principles</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              These principles guide how we handle your personal information and skills data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Transparency",
                description: "We're clear about what skills data we collect and how reputation scoring works.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Lock,
                title: "Security",
                description: "Your skills and reputation data are protected with enterprise-grade security and on-chain immutability.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: Users,
                title: "Control",
                description: "You have full control over your skills profile, endorsements, and reputation settings.",
                color: "from-blue-500 to-purple-500",
              },
            ].map((principle, index) => (
              <Card
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <principle.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{principle.title}</h3>
                  <p className="text-gray-400">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Information We Collect */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-white mb-3">Personal Information</h4>
                <p className="text-gray-400 mb-4">
                  When you create a SkillPass profile, we collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Name and email address</li>
                  <li>Professional information and bio</li>
                  <li>Skills and competencies you add to your profile</li>
                  <li>Wallet addresses and blockchain transaction data</li>
                  <li>Social media links and portfolio information</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">Skills and Reputation Data</h4>
                <p className="text-gray-400 mb-4">
                  We automatically collect certain information about your skills validation activities:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2">
                  <li>Skills added to your profile and verification status</li>
                  <li>Endorsements received and given to other users</li>
                  <li>Reputation scores and staking activities</li>
                  <li>NFT minting and soulbound credential data</li>
                  <li>Leaderboard rankings and community interactions</li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Provide and maintain our skills validation platform</li>
                  <li>Process endorsements and reputation staking</li>
                  <li>Verify your identity through Civic Auth integration</li>
                  <li>Generate and maintain soulbound NFT credentials</li>
                  <li>Calculate reputation scores and leaderboard rankings</li>
                  <li>Send important updates about your skills and endorsements</li>
                  <li>Improve our platform and user experience</li>
                  <li>Prevent fraud and ensure platform integrity</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">Skills Data Processing</h4>
                <p className="text-gray-400">
                  Your skills and endorsement data are processed to create verifiable professional credentials and
                  reputation scores. This information may be publicly visible as part of your professional profile
                  and on-chain credentials.
                </p>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the
                  following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>
                    <strong>Service Providers:</strong> We share information with trusted partners including Civic for
                    identity verification and blockchain networks for credential storage
                  </li>
                  <li>
                    <strong>Public Skills Data:</strong> Your skills, endorsements, and reputation scores are publicly
                    visible by design as verifiable professional credentials
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                  </li>
                  <li>
                    <strong>Consent:</strong> When you explicitly consent to sharing your information
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">Blockchain Transparency</h4>
                <p className="text-gray-400">
                  Your soulbound NFT credentials and reputation data are stored on public blockchains, making them
                  permanently verifiable but also publicly accessible. This is fundamental to our trust and
                  verification model.
                </p>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>End-to-end encryption for sensitive personal data</li>
                  <li>Secure smart contracts audited for vulnerabilities</li>
                  <li>Immutable on-chain storage for skills credentials</li>
                  <li>Multi-factor authentication and wallet security</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Employee training on data protection practices</li>
                </ul>

                <p className="text-gray-400">
                  While we strive to protect your personal information, blockchain data is immutable by design. Once
                  skills credentials are minted as NFTs, they cannot be deleted, only marked as inactive.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal information we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                  </li>
                  <li>
                    <strong>Profile Control:</strong> Manage visibility of your skills profile and endorsements
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your skills data and credentials
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your personal information
                  </li>
                  <li>
                    <strong>Account Deactivation:</strong> Deactivate your account while preserving on-chain credentials
                  </li>
                </ul>

                <p className="text-gray-400">
                  To exercise these rights, please contact us at {`privacy@${SITE_DOMAIN}`}. Note that some data
                  stored on blockchain cannot be deleted due to its immutable nature.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                <p className="text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-400">
                  <p>
                    <strong>Email:</strong> victordecarvalho342@gmail.com
                  </p>
                  <p>
                    <strong>Address:</strong> São Paulo, Brazil
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}