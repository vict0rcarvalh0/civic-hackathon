import { FileText, Scale, AlertTriangle, Calendar } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TermsPage() {
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
            <Scale className="w-3 h-3 mr-1" />
            Legal Terms
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Terms of </span>
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Service</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Please read these terms carefully before using Authora. By using our service, you agree to these terms.
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

      {/* Important Notice */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Important:</strong> These terms constitute a legally binding agreement between you and Authora.
              Please read them carefully and contact us if you have any questions.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  By accessing or using Authora's services, you agree to be bound by these Terms of Service and all
                  applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
                  using or accessing this site.
                </p>
                <p className="text-gray-600">
                  These terms apply to all visitors, users, and others who access or use the service. We reserve the
                  right to update these terms at any time without prior notice.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  Authora is a Web3 onboarding platform that provides the following services:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Identity verification through Civic Auth integration</li>
                  <li>Non-custodial cryptocurrency wallet creation and management</li>
                  <li>Payment link generation for accepting cryptocurrency payments</li>
                  <li>Transaction tracking and analytics dashboard</li>
                  <li>Customer support and educational resources</li>
                </ul>
                <p className="text-gray-600">
                  Our service is designed to simplify Web3 adoption for creators, freelancers, and businesses without
                  requiring technical expertise in blockchain technology.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">3. User Accounts and Registration</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Creation</h4>
                <p className="text-gray-600 mb-4">
                  To use our services, you must create an account by providing accurate and complete information. You
                  are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your information remains current and accurate</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Identity Verification</h4>
                <p className="text-gray-600">
                  We use Civic Auth for identity verification. By using our service, you consent to Civic's verification
                  process and agree to provide accurate identity information as required by applicable regulations.
                </p>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">4. Acceptable Use Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  You agree not to use our service for any unlawful purpose or in any way that could damage our service
                  or reputation. Prohibited activities include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Engaging in fraudulent or deceptive practices</li>
                  <li>Money laundering or terrorist financing</li>
                  <li>Selling illegal goods or services</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Attempting to hack or compromise our systems</li>
                  <li>Creating multiple accounts to circumvent limitations</li>
                </ul>
                <p className="text-gray-600">
                  We reserve the right to suspend or terminate accounts that violate this policy without prior notice.
                </p>
              </CardContent>
            </Card>

            {/* Fees and Payments */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">5. Fees and Payments</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Fees</h4>
                <p className="text-gray-600 mb-4">Our fee structure is as follows:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Starter Plan: 2% transaction fee</li>
                  <li>Professional Plan: $29/month + 1% transaction fee</li>
                  <li>Business Plan: $99/month + 0.5% transaction fee</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Network Fees</h4>
                <p className="text-gray-600 mb-4">
                  Blockchain network fees (gas fees) are separate from our service fees and are determined by the
                  respective blockchain networks. These fees are not controlled by Authora.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h4>
                <p className="text-gray-600">
                  Subscription fees are billed monthly or annually in advance. Transaction fees are deducted
                  automatically from each transaction. All fees are non-refundable except as required by law.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">6. Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  The Authora service and its original content, features, and functionality are owned by Authora and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>
                <p className="text-gray-600 mb-4">
                  You retain ownership of any content you submit through our service. By using our service, you grant us
                  a limited license to use, store, and display your content as necessary to provide our services.
                </p>
                <p className="text-gray-600">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
                  perform, republish, download, store, or transmit any of our content without our prior written consent.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers and Limitations */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">7. Disclaimers and Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Disclaimer</h4>
                <p className="text-gray-600 mb-4">
                  Our service is provided "as is" and "as available" without warranties of any kind. We do not guarantee
                  that our service will be uninterrupted, secure, or error-free.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cryptocurrency Risks</h4>
                <p className="text-gray-600 mb-4">
                  Cryptocurrency transactions are irreversible and subject to market volatility. You acknowledge and
                  accept the risks associated with cryptocurrency transactions.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h4>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, Authora shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including loss of profits, data, or other intangible
                  losses.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-4">
                  You may terminate your account at any time by contacting our support team. We may terminate or suspend
                  your account immediately, without prior notice, for any reason, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of fees</li>
                  <li>Extended period of inactivity</li>
                </ul>
                <p className="text-gray-600">
                  Upon termination, your right to use the service will cease immediately. We will provide reasonable
                  notice and opportunity to export your data before account deletion.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong> {`legal@${SITE_DOMAIN}`}
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