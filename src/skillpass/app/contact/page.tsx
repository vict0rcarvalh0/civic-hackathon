import { Mail, Linkedin, Twitter, Send, Clock } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Get in </span>
            <span className="text-purple-400">Touch</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Have questions or need help? Our team is here to assist you with anything related to SkillPass.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: "Email Us",
                description: "Get in touch via email",
                info: "victordecarvalho342@gmail.com",
                action: "Send Email",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Linkedin,
                title: "LinkedIn",
                description: "Connect on LinkedIn",
                info: "www.linkedin.com/in/victor-severiano-de-carvalho",
                action: "View Profile",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: Twitter,
                title: "Follow on X",
                description: "",
                info: "https://x.com/vict0rcarvalh0o",
                action: "Follow",
                color: "from-blue-500 to-purple-500",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <p className="text-lg font-semibold text-purple-400 mb-6">{item.info}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly will I receive a response?",
                answer:
                  "We typically respond to all inquiries within 24 hours during business days. For urgent technical issues related to skills validation or staking, we aim to respond within 4 hours.",
              },
              {
                question: "What information should I include in my message?",
                answer:
                  "Please include as much detail as possible about your question or issue. If it's related to skills validation or endorsements, include your wallet address and any relevant transaction hashes.",
              },
              {
                question: "Do you offer phone support?",
                answer:
                  "Phone support is available for verified community members and partners. All users can reach us via email or our support chat.",
              },
              {
                question: "Can I schedule a demo or consultation?",
                answer:
                  "Yes! We offer personalized demos for organizations interested in implementing skills-based verification. Use the contact form above or email us directly to schedule a consultation.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border border-white/10 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}