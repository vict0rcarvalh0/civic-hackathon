"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, Book, Video, Mail, Phone, Clock, Search, ExternalLink, Send } from "lucide-react"

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [supportSubject, setSupportSubject] = useState("")

  const faqs = [
    {
      question: "How do I create a payment link?",
      answer:
        "To create a payment link, go to your Dashboard > Links and click 'Create New Link'. Fill in the required information including amount, description, and any custom settings. Your link will be generated instantly and ready to share.",
    },
    {
      question: "What cryptocurrencies do you support?",
      answer:
        "We currently support USDC, ETH, SOL, and other major cryptocurrencies. You can view the full list of supported tokens in your wallet settings.",
    },
    {
      question: "How long do payments take to process?",
      answer:
        "Cryptocurrency payments are typically confirmed within 1-5 minutes depending on network congestion. You'll receive real-time notifications when payments are received.",
    },
    {
      question: "Can I customize my payment page?",
      answer:
        "Yes! You can customize your payment page with your branding, colors, logo, and custom messages. Go to Settings > Branding to personalize your payment experience.",
    },
    {
      question: "How do I withdraw my funds?",
      answer:
        "You can withdraw funds directly from your wallet to any external wallet address. Go to Wallet > Send to initiate a withdrawal. Standard network fees apply.",
    },
    {
      question: "Is my account secure?",
      answer:
        "Yes, we use industry-standard security measures including encryption, secure key management, and optional two-factor authentication to protect your account and funds.",
    },
  ]

  const supportTickets = [
    {
      id: "TK-001",
      subject: "Payment not received",
      status: "open",
      priority: "high",
      created: "2024-01-15",
      lastUpdate: "2 hours ago",
    },
    {
      id: "TK-002",
      subject: "API integration help",
      status: "in-progress",
      priority: "medium",
      created: "2024-01-14",
      lastUpdate: "1 day ago",
    },
    {
      id: "TK-003",
      subject: "Account verification",
      status: "resolved",
      priority: "low",
      created: "2024-01-12",
      lastUpdate: "3 days ago",
    },
  ]

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of setting up your account and creating your first payment link",
      type: "guide",
      icon: Book,
      link: "#",
    },
    {
      title: "API Documentation",
      description: "Complete reference for integrating Authora into your applications",
      type: "docs",
      icon: Book,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for common tasks and features",
      type: "video",
      icon: Video,
      link: "#",
    },
    {
      title: "Best Practices",
      description: "Tips and strategies for maximizing your payment success rate",
      type: "guide",
      icon: Book,
      link: "#",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-gray-600 mt-2">Get help, find answers, and contact our support team</p>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, guides, or common questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-xl">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions about Authora</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-gray-200 rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Form */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      rows={6}
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Options */}
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Other ways to reach us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@authora.com</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 9 AM - 6 PM EST</p>
                        <p className="text-xs text-gray-500">Monday - Friday</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg opacity-50">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-500">Phone Support</p>
                        <p className="text-sm text-gray-500">Coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      Support Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>Track the status of your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Created: {ticket.created}</span>
                        <span>Last update: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl bg-white/70 backdrop-blur-xl hover:shadow-2xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <resource.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                        <Button variant="outline" size="sm" className="group">
                          Learn More
                          <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
