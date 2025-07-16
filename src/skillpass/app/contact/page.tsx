import { Mail, Phone, MapPin, Send, Clock } from "lucide-react"
import { SITE_DOMAIN } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Get in </span>
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Touch</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Have questions or need help? Our team is here to assist you with anything related to Authora.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: "Email Us",
                description: "Get in touch via email",
                info: `support@${SITE_DOMAIN}`,
                action: "Send Email",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Phone,
                title: "Call Us",
                description: "Speak with our team",
                info: "+63 9983708168",
                action: "Call Now",
                color: "from-green-500 to-green-600",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                description: "Our headquarters",
                info: "Quezon City, Philippines",
                action: "Get Directions",
                color: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <p className="text-lg font-semibold text-blue-600 mb-6">{item.info}</p>
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-200"
                  >
                    {item.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 to-green-600 p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. We're here to help with any
                  questions about Authora.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 mr-4 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <p className="text-blue-100">{`support@${SITE_DOMAIN}`}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-4 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Phone</p>
                      <p className="text-blue-100">+63 9983708168</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 mr-4 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Office</p>
                      <p className="text-blue-100">Quezon City, Philippines</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 mr-4 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Hours</p>
                      <p className="text-blue-100">Monday - Friday: 9AM - 5PM PHT</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Subject
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      className="mt-2 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[150px]"
                    />
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white w-full py-6 text-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly will I receive a response?",
                answer:
                  "We typically respond to all inquiries within 24 hours during business days. For urgent technical issues, we aim to respond within 4 hours.",
              },
              {
                question: "What information should I include in my message?",
                answer:
                  "Please include as much detail as possible about your question or issue. If it's a technical problem, include your account email and any error messages you're seeing.",
              },
              {
                question: "Do you offer phone support?",
                answer:
                  "Phone support is available for Business plan customers. Starter and Professional plan users can reach us via email or our in-app chat.",
              },
              {
                question: "Can I schedule a demo or consultation?",
                answer:
                  "Yes! We offer personalized demos for potential customers. Use the contact form above or email us directly to schedule a time that works for you.",
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
    </div>
  )
}