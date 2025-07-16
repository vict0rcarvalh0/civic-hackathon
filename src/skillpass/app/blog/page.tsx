import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function BlogPage() {
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
            <span className="text-white">SkillPass</span>{" "}
            <span className="text-purple-400">Blog</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            Insights, tutorials, and updates on skills validation, reputation staking, and the future of decentralized professional credentials.
          </p>

          <div className="max-w-xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search articles..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <Badge className="bg-white/20 text-white border-0 mb-4">Featured</Badge>
                <h2 className="text-3xl font-bold mb-4">The Future of Professional Reputation: Skills Validation On-Chain</h2>
                <p className="text-purple-100 mb-6 leading-relaxed">
                  How SkillPass is revolutionizing professional credibility through decentralized skills validation, 
                  reputation staking, and soulbound NFT credentials that can't be faked.
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">December 15, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm">SkillPass Team</span>
                  </div>
                </div>
                <Button className="bg-white text-purple-600 hover:bg-purple-50">
                  Read Article
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-pink-800 opacity-50"></div>
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Skills Validation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                All
              </Button>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                Tutorials
              </Button>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                News
              </Button>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                Guides
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "How to Build Your First Skills Profile",
                excerpt:
                  "A step-by-step guide to creating your SkillPass profile and adding verifiable skills to build professional reputation.",
                image: "/placeholder.svg?height=400&width=600",
                date: "December 10, 2024",
                author: "Alex Chen",
                category: "Tutorial",
                categoryColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
              },
              {
                title: "Understanding Reputation Staking: Skin in the Game",
                excerpt:
                  "Learn how our reputation staking mechanism creates trust through economic incentives and social validation.",
                image: "/placeholder.svg?height=400&width=600",
                date: "December 5, 2024",
                author: "Sarah Johnson",
                category: "Guide",
                categoryColor: "bg-green-500/20 text-green-300 border-green-500/30",
              },
              {
                title: "SkillPass Integrates with Major Web3 Communities",
                excerpt:
                  "Exciting partnerships with leading DAOs and Web3 communities to enable skills-based access and governance.",
                image: "/placeholder.svg?height=400&width=600",
                date: "November 28, 2024",
                author: "SkillPass Team",
                category: "News",
                categoryColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
              },
              {
                title: "5 Ways Soulbound NFTs Change Professional Credentialing",
                excerpt:
                  "Explore how non-transferable NFTs are creating a new paradigm for verified skills and professional reputation.",
                image: "/placeholder.svg?height=400&width=600",
                date: "November 20, 2024",
                author: "Michael Torres",
                category: "Guide",
                categoryColor: "bg-green-500/20 text-green-300 border-green-500/30",
              },
              {
                title: "The Economics of Trust: How Endorsements Work",
                excerpt:
                  "Deep dive into our endorsement system where community members stake reputation on each other's skills.",
                image: "/placeholder.svg?height=400&width=600",
                date: "November 15, 2024",
                author: "Emily Watson",
                category: "Guide",
                categoryColor: "bg-green-500/20 text-green-300 border-green-500/30",
              },
              {
                title: "New Feature: Skills Leaderboards Now Live",
                excerpt:
                  "Discover top-ranked professionals in each skill category and see how the community validates excellence.",
                image: "/placeholder.svg?height=400&width=600",
                date: "November 8, 2024",
                author: "SkillPass Team",
                category: "News",
                categoryColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
              },
            ].map((post, index) => (
              <Card
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 transform hover:scale-105 overflow-hidden"
              >
                <div className="relative h-48">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge className={post.categoryColor}>{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
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
                <CardFooter className="bg-white/5 px-6 py-4 border-t border-white/10">
                  <Link
                    href="#"
                    className="text-purple-400 hover:text-purple-300 font-medium flex items-center transition-colors"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
