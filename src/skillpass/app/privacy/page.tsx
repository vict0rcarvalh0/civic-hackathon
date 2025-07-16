import { Shield, Eye, Lock, Users, FileText, Calendar } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Privacy First
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Privacy </span>
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Policy</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Your privacy is fundamental to everything we do. Learn how we collect, use, and protect your information.
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Last updated: December 1, 2024</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span>Version 2.1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Privacy Principles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide how we handle your personal information
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Transparency",
                description: "We're clear about what data we collect and how we use it.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Lock,
                title: "Security",
                description: "Your data is protected with enterprise-grade security measures.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Users,
                title: "Control",
                description: "You have full control over your personal information and privacy settings.",
                color: "from-purple-500 to-pink-500",
              },
            ].map((principle, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <principle.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Information We Collect */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                <p className="text-gray-600 mb-4">
                  When you create an account with Authora, we collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Name and email address</li>
                  <li>Phone number (for verification purposes)</li>
                  <li>Profile information and social media links</li>
                  <li>Payment preferences and wallet addresses</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h4>
                <p className="text-gray-600 mb-4">
                  We automatically collect certain information about your use of our services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Transaction history and payment data</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and features used</li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and payments</li>
                  <li>Verify your identity through Civic Auth</li>
                  <li>Send important updates and notifications</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Marketing Communications</h4>
                <p className="text-gray-600">
                  We may send you promotional emails about new features, special offers, or other information we think
                  you might find interesting. You can opt out of these communications at any time.
                </p>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the
                  following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>
                    <strong>Service Providers:</strong> We share information with trusted partners who help us operate
                    our services (e.g., Civic for identity verification)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>Consent:</strong> When you explicitly consent to sharing your information
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Civic Auth Integration</h4>
                <p className="text-gray-600">
                  Our identity verification is powered by Civic. When you verify your identity, certain information is
                  shared with Civic in accordance with their privacy policy and our agreement with them.
                </p>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure data centers with 24/7 monitoring</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Employee training on data protection practices</li>
                </ul>

                <p className="text-gray-600">
                  While we strive to protect your personal information, no method of transmission over the internet or
                  electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal information we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request transfer of your data to another service
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your personal information
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of processing in certain circumstances
                  </li>
                </ul>

                <p className="text-gray-600">
                  To exercise these rights, please contact us at {`privacy@${SITE_DOMAIN}`}. We will respond to your request
                  within 30 days.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong> {`privacy@${SITE_DOMAIN}`}
                  </p>
                  <p>
                    <strong>Address:</strong> Quezon City, Philippines
                  </p>
                  <p>
                    <strong>Phone:</strong> +63 9983708168
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