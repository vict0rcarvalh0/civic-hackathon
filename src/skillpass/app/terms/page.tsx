import { FileText, Scale, AlertTriangle, Calendar } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TermsPage() {
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
            <Scale className="w-3 h-3 mr-1" />
            Legal Terms
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Terms of </span>
            <span className="text-purple-400">Service</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Please read these terms carefully before using SkillPass. By using our service, you agree to these terms.
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Last updated: December 15, 2024</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span>Version 3.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-orange-500/20 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300">
              <strong>Important:</strong> These terms constitute a legally binding agreement between you and SkillPass.
              Please read them carefully and contact us if you have any questions.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  By accessing or using SkillPass's services, you agree to be bound by these Terms of Service and all
                  applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
                  using or accessing this platform.
                </p>
                <p className="text-gray-400">
                  These terms apply to all visitors, users, and others who access or use the service. We reserve the
                  right to update these terms at any time without prior notice.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  SkillPass is a decentralized skills validation platform that provides the following services:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Identity verification through Civic Auth integration</li>
                  <li>Skills profile creation and management</li>
                  <li>Peer-to-peer skills endorsement with reputation staking</li>
                  <li>Soulbound NFT credential generation and storage</li>
                  <li>Reputation scoring and leaderboard systems</li>
                  <li>Professional skills verification and validation</li>
                </ul>
                <p className="text-gray-400">
                  Our service is designed to create verifiable, trustworthy professional credentials through 
                  community validation and economic incentives, building a reputation-based skills economy.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">3. User Accounts and Registration</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-white mb-3">Account Creation</h4>
                <p className="text-gray-400 mb-4">
                  To use our services, you must create an account by providing accurate and complete information. You
                  are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Maintaining the confidentiality of your wallet and account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring the accuracy of your skills and professional information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">Skills Validation Integrity</h4>
                <p className="text-gray-400">
                  You agree to provide truthful and accurate information about your skills and professional experience. 
                  Misrepresentation of skills or fraudulent activity may result in account suspension and forfeiture 
                  of staked reputation.
                </p>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">4. Acceptable Use Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  You agree not to use our service for any unlawful purpose or in any way that could damage our service
                  or reputation. Prohibited activities include:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Providing false or misleading skills information</li>
                  <li>Creating fake endorsements or manipulating reputation scores</li>
                  <li>Engaging in fraudulent professional activities</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Attempting to hack or compromise our systems</li>
                  <li>Creating multiple accounts to circumvent limitations</li>
                  <li>Harassing or defaming other community members</li>
                </ul>
                <p className="text-gray-400">
                  We reserve the right to suspend or terminate accounts that violate this policy and may impose 
                  penalties on staked reputation.
                </p>
              </CardContent>
            </Card>

            {/* Reputation Staking */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">5. Reputation Staking and Endorsements</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-white mb-3">Staking Mechanism</h4>
                <p className="text-gray-400 mb-4">When you endorse another user's skills, you may stake reputation tokens as a guarantee of their competence. You understand that:</p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Staked tokens may be subject to slashing if the endorsed user engages in fraudulent behavior</li>
                  <li>Reputation staking involves financial risk</li>
                  <li>Endorsements should be based on genuine knowledge of the user's skills</li>
                  <li>False endorsements may result in penalties</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">Dispute Resolution</h4>
                <p className="text-gray-400">
                  Disputes regarding skills validity or endorsement accuracy may be subject to community governance
                  or arbitration processes. We reserve the right to implement automated slashing mechanisms based
                  on verified complaints or community consensus.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">6. Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  The SkillPass platform and its original content, features, and functionality are owned by SkillPass and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>
                <p className="text-gray-400 mb-4">
                  You retain ownership of your skills data and professional information. By using our service, you grant us
                  a limited license to use, store, and display your content as necessary to provide our services and 
                  create verifiable credentials.
                </p>
                <p className="text-gray-400">
                  Your soulbound NFT credentials are owned by you but stored on public blockchains for verification
                  purposes. You may not reproduce, distribute, or modify our platform without prior written consent.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers and Limitations */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">7. Disclaimers and Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4 className="text-lg font-semibold text-white mb-3">Service Disclaimer</h4>
                <p className="text-gray-400 mb-4">
                  Our service is provided "as is" and "as available" without warranties of any kind. We do not guarantee
                  the accuracy of skills validations or the performance of endorsed individuals.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">Blockchain and Staking Risks</h4>
                <p className="text-gray-400 mb-4">
                  Reputation staking and blockchain transactions are irreversible and subject to network risks. 
                  You acknowledge and accept the risks associated with cryptocurrency staking and NFT storage.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">Limitation of Liability</h4>
                <p className="text-gray-400">
                  To the maximum extent permitted by law, SkillPass shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including loss of reputation, staked tokens, or other
                  intangible losses related to skills validation or endorsement activities.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-400 mb-4">
                  You may terminate your account at any time by contacting our support team. We may terminate or suspend
                  your account immediately, without prior notice, for any reason, including:
                </p>
                <ul className="list-disc pl-6 text-gray-400 space-y-2 mb-6">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent skills representation or endorsement manipulation</li>
                  <li>Verified professional misconduct</li>
                  <li>Extended period of inactivity</li>
                </ul>
                <p className="text-gray-400">
                  Upon termination, your right to use the service will cease immediately. However, your soulbound NFT
                  credentials will remain on the blockchain as permanent records. We will provide reasonable notice 
                  and opportunity to export your data before account deletion.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
                <p className="text-gray-400 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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