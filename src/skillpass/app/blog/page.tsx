import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function BlogPage() {
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
            <span className="text-gray-900">Authora</span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Blog</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Insights, tutorials, and updates from the Authora team on Web3, crypto payments, and creator economy.
          </p>

          <div className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search articles..."
                className="bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <Badge className="bg-white/20 text-white border-0 mb-4">Featured</Badge>
                <h2 className="text-3xl font-bold mb-4">The Future of Web3 Onboarding: Breaking Down Barriers</h2>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  How Authora is revolutionizing the way creators and businesses enter the decentralized economy by
                  eliminating technical barriers and simplifying the crypto experience.
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">June 2, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">Java Jay Bartolome</span>
                  </div>
                </div>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Read Article
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-green-800 opacity-50"></div>
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Web3 Onboarding"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                All
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                Tutorials
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                News
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                Guides
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "How to Set Up Your First Crypto Payment Link",
                excerpt:
                  "A step-by-step guide to creating and sharing your first Authora payment link to start accepting crypto.",
                image: "/placeholder.svg?height=400&width=600",
                date: "May 28, 2024",
                author: "Alex Chen",
                category: "Tutorial",
                categoryColor: "bg-blue-100 text-blue-700",
              },
              {
                title: "Understanding Non-Custodial Wallets: Security and Control",
                excerpt:
                  "Learn why non-custodial wallets are the cornerstone of Web3 security and how Authora implements them.",
                image: "/placeholder.svg?height=400&width=600",
                date: "May 20, 2024",
                author: "Sarah Johnson",
                category: "Guide",
                categoryColor: "bg-green-100 text-green-700",
              },
              {
                title: "Authora Partners with Major Payment Processor",
                excerpt:
                  "Exciting news about our latest partnership that will expand payment options and reduce fees for users.",
                image: "/placeholder.svg?height=400&width=600",
                date: "May 15, 2024",
                author: "Java Jay Bartolome",
                category: "News",
                categoryColor: "bg-purple-100 text-purple-700",
              },
              {
                title: "5 Ways Creators Are Earning More with Crypto Payments",
                excerpt:
                  "Real-world examples of how content creators are increasing their income by accepting cryptocurrency.",
                image: "/placeholder.svg?height=400&width=600",
                date: "May 10, 2024",
                author: "Michael Torres",
                category: "Guide",
                categoryColor: "bg-green-100 text-green-700",
              },
              {
                title: "The Ultimate Guide to Crypto Tax Compliance",
                excerpt:
                  "Everything creators need to know about staying compliant with tax regulations when accepting crypto.",
                image: "/placeholder.svg?height=400&width=600",
                date: "May 5, 2024",
                author: "Emily Watson",
                category: "Guide",
                categoryColor: "bg-green-100 text-green-700",
              },
              {
                title: "New Feature: Multi-Chain Support Now Available",
                excerpt:
                  "Authora now supports multiple blockchains, allowing you to accept payments across different networks.",
                image: "/placeholder.svg?height=400&width=600",
                date: "April 28, 2024",
                author: "Java Jay Bartolome",
                category: "News",
                categoryColor: "bg-purple-100 text-purple-700",
              },
            ].map((post, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-xl border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
              >
                <div className="relative h-48">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge className={post.categoryColor}>{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4">
                  <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-200"
            >
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest articles, tutorials, and updates on Web3 and crypto payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
