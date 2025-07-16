import { Search, Book, MessageCircle, Video, FileText, ArrowRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HelpPage() {
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
            <span className="text-white">Help </span>
            <span className="text-purple-400">Center</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Find answers to your questions, learn how to use SkillPass, and master skills validation and reputation staking.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, guides, and tutorials..."
                className="pl-12 pr-4 py-4 text-lg bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Book,
                title: "Getting Started",
                description: "Learn the basics of SkillPass",
                articles: "12 articles",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: MessageCircle,
                title: "Skills Validation",
                description: "Add and verify your skills",
                articles: "8 articles",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: Video,
                title: "Reputation Staking",
                description: "Endorse others and stake reputation",
                articles: "15 articles",
                color: "from-blue-500 to-purple-500",
              },
              {
                icon: FileText,
                title: "Account & NFTs",
                description: "Manage your soulbound credentials",
                articles: "10 articles",
                color: "from-green-500 to-blue-500",
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105 cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 mb-3">{category.description}</p>
                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                    {category.articles}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Popular Articles</h2>
            <p className="text-xl text-gray-400">Most viewed help articles this week</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: "How to Create Your Skills Profile",
                description:
                  "Step-by-step guide to setting up your SkillPass profile and adding your first verified skills.",
                category: "Getting Started",
                readTime: "5 min read",
                views: "2.1k views",
              },
              {
                title: "Understanding Soulbound NFT Credentials",
                description:
                  "Learn about your non-transferable skill NFTs, how they work, and how to manage your professional credentials.",
                category: "Account & NFTs",
                readTime: "8 min read",
                views: "1.8k views",
              },
              {
                title: "Setting Up Civic Wallet Verification",
                description:
                  "Complete guide to verifying your identity with Civic for enhanced trust and reputation scoring.",
                category: "Account & Security",
                readTime: "6 min read",
                views: "1.5k views",
              },
              {
                title: "How to Endorse and Stake on Skills",
                description: "Learn the reputation staking system and how to endorse other professionals' skills responsibly.",
                category: "Reputation Staking",
                readTime: "4 min read",
                views: "1.3k views",
              },
              {
                title: "Building Your Reputation Score",
                description:
                  "Understand how the reputation algorithm works and strategies to build credibility in your field.",
                category: "Reputation System",
                readTime: "7 min read",
                views: "1.1k views",
              },
              {
                title: "Troubleshooting Common Issues",
                description: "Solutions to the most common problems users encounter when using SkillPass.",
                category: "Troubleshooting",
                readTime: "10 min read",
                views: "950 views",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{article.category}</Badge>
                    <div className="text-sm text-gray-400">{article.views}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <Link
                      href="#"
                      className="text-purple-400 hover:text-purple-300 font-medium flex items-center transition-colors"
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

      {/* Contact Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-12">
              <HelpCircle className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">Still Need Help?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions about skills validation or reputation staking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Contact Support
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
