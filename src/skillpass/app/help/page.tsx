import { Search, Book, MessageCircle, Video, FileText, ArrowRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HelpPage() {
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
            <span className="text-gray-900">Help </span>
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Center</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Find answers to your questions, learn how to use Authora, and get the most out of your Web3 journey.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, guides, and tutorials..."
                className="pl-12 pr-4 py-4 text-lg bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Book,
                title: "Getting Started",
                description: "Learn the basics of Authora",
                articles: "12 articles",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: MessageCircle,
                title: "Payment Links",
                description: "Create and manage payment links",
                articles: "8 articles",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Video,
                title: "Wallet Management",
                description: "Manage your crypto wallet",
                articles: "15 articles",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: FileText,
                title: "Account & Billing",
                description: "Account settings and billing",
                articles: "10 articles",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {category.articles}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Articles</h2>
            <p className="text-xl text-gray-600">Most viewed help articles this week</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: "How to Create Your First Payment Link",
                description:
                  "Step-by-step guide to setting up your personalized payment page and start accepting crypto payments.",
                category: "Getting Started",
                readTime: "5 min read",
                views: "2.1k views",
              },
              {
                title: "Understanding Your Embedded Wallet",
                description:
                  "Learn about your non-custodial wallet, how it works, and how to manage your crypto assets securely.",
                category: "Wallet Management",
                readTime: "8 min read",
                views: "1.8k views",
              },
              {
                title: "Setting Up Civic Auth Verification",
                description:
                  "Complete guide to verifying your identity with Civic Auth for enhanced security and trust.",
                category: "Account & Security",
                readTime: "6 min read",
                views: "1.5k views",
              },
              {
                title: "Accepting Multiple Cryptocurrencies",
                description: "How to configure your payment links to accept different cryptocurrencies and tokens.",
                category: "Payment Links",
                readTime: "4 min read",
                views: "1.3k views",
              },
              {
                title: "Tracking Your Earnings and Analytics",
                description:
                  "Use the dashboard to monitor your crypto income, track transactions, and analyze your growth.",
                category: "Analytics",
                readTime: "7 min read",
                views: "1.1k views",
              },
              {
                title: "Troubleshooting Common Issues",
                description: "Solutions to the most common problems users encounter when using Authora.",
                category: "Troubleshooting",
                readTime: "10 min read",
                views: "950 views",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">{article.category}</Badge>
                    <div className="text-sm text-gray-500">{article.views}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <Link
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors"
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Video Tutorials</h2>
            <p className="text-xl text-blue-100">Learn by watching our step-by-step video guides</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Started with Authora",
                duration: "3:45",
                thumbnail: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Creating Your Payment Link",
                duration: "2:30",
                thumbnail: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Managing Your Crypto Wallet",
                duration: "5:15",
                thumbnail: "/placeholder.svg?height=300&width=400",
              },
            ].map((video, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full w-16 h-16">
                      <Video className="w-8 h-8" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full">
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-2xl">
            <CardContent className="p-12">
              <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Contact Support
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-200"
                >
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
