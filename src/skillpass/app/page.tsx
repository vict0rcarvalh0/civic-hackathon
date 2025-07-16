'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@civic/auth-web3/react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export default function HomePage() {
  const { user, signIn } = useUser()
  const router = useRouter()

  const handleGetStarted = async () => {
    if (user) {
      router.push("/dashboard")
    } else {
      try {
        await signIn()
        router.push("/dashboard")
      } catch (e) {
        console.error("Login failed", e)
      }
    }
  }

  const handleCreateProfile = async () => {
    if (user) {
      router.push("/dashboard")
    } else {
      try {
        await signIn()
        router.push("/dashboard")
      } catch (e) {
        console.error("Login failed", e)
      }
    }
  }

  const handleViewLeaderboard = () => {
    router.push("/leaderboard")
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        {/* Background Bubbles */}
        <div className="absolute inset-0">
          {/* Large bubbles */}
          <div className="absolute top-10 right-10 w-60 h-60 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-float-minimal"></div>
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-800/20 to-purple-600/15 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-600/10 to-blue-800/10 rounded-full blur-3xl animate-float-minimal" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-10 left-10 w-70 h-70 bg-gradient-to-br from-blue-800/15 to-purple-600/15 rounded-full blur-3xl animate-float-minimal" style={{ animationDelay: '4s' }}></div>
          
          {/* Medium bubbles */}
          <div className="absolute top-1/3 left-1/3 w-50 h-50 bg-gradient-to-br from-purple-600/15 to-pink-500/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-50 h-50 bg-gradient-to-br from-pink-500/15 to-purple-500/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '5s' }}></div>
          <div className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-gradient-to-br from-pink-600/15 to-purple-600/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '7s' }}></div>
          <div className="absolute top-1/4 right-1/2 w-45 h-45 bg-gradient-to-br from-blue-700/18 to-pink-500/12 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '8s' }}></div>
          
          {/* Small bubbles */}
          <div className="absolute top-1/4 right-1/3 w-30 h-30 bg-gradient-to-br from-purple-500/20 to-blue-800/15 rounded-full blur-xl animate-float-minimal" style={{ animationDelay: '6s' }}></div>
          <div className="absolute top-16 left-1/2 w-25 h-25 bg-gradient-to-br from-pink-500/18 to-purple-600/12 rounded-full blur-xl animate-float-minimal" style={{ animationDelay: '9s' }}></div>
          <div className="absolute bottom-16 right-1/3 w-35 h-35 bg-gradient-to-br from-blue-800/16 to-pink-600/14 rounded-full blur-xl animate-float-minimal" style={{ animationDelay: '10s' }}></div>
          <div className="absolute top-3/4 left-1/4 w-28 h-28 bg-gradient-to-br from-purple-600/17 to-blue-700/13 rounded-full blur-xl animate-float-minimal" style={{ animationDelay: '11s' }}></div>
          
          {/* Extra small scattered bubbles */}
          <div className="absolute top-24 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-600/16 to-purple-500/12 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '12s' }}></div>
          <div className="absolute bottom-24 left-1/3 w-22 h-22 bg-gradient-to-br from-blue-700/15 to-pink-500/11 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '13s' }}></div>
          <div className="absolute top-1/3 right-16 w-18 h-18 bg-gradient-to-br from-purple-500/19 to-blue-800/14 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '14s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-26 h-26 bg-gradient-to-br from-pink-500/17 to-purple-600/13 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '15s' }}></div>
          <div className="absolute top-2/3 left-16 w-24 h-24 bg-gradient-to-br from-blue-800/18 to-pink-600/12 rounded-full blur-lg animate-float-minimal" style={{ animationDelay: '16s' }}></div>
          
          {/* Micro bubbles for richness */}
          <div className="absolute top-12 left-1/4 w-15 h-15 bg-gradient-to-br from-purple-600/22 to-pink-500/14 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '17s' }}></div>
          <div className="absolute bottom-12 right-1/2 w-16 h-16 bg-gradient-to-br from-blue-700/20 to-purple-600/15 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '18s' }}></div>
          <div className="absolute top-1/2 left-12 w-14 h-14 bg-gradient-to-br from-pink-600/21 to-blue-800/16 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '19s' }}></div>
          <div className="absolute bottom-1/3 right-12 w-17 h-17 bg-gradient-to-br from-purple-500/18 to-pink-600/13 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '20s' }}></div>
          <div className="absolute top-1/6 right-2/3 w-19 h-19 bg-gradient-to-br from-blue-800/17 to-purple-500/14 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '21s' }}></div>
          <div className="absolute bottom-1/6 left-2/3 w-21 h-21 bg-gradient-to-br from-pink-500/19 to-blue-700/15 rounded-full blur-md animate-float-minimal" style={{ animationDelay: '22s' }}></div>
          
          {/* Additional corner and edge bubbles */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-purple-600/14 to-pink-500/10 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '23s' }}></div>
          <div className="absolute bottom-8 left-8 w-38 h-38 bg-gradient-to-br from-blue-800/16 to-purple-600/12 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '24s' }}></div>
          <div className="absolute top-32 right-32 w-42 h-42 bg-gradient-to-br from-pink-600/13 to-blue-700/11 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '25s' }}></div>
          <div className="absolute bottom-32 left-32 w-36 h-36 bg-gradient-to-br from-purple-500/15 to-pink-600/12 rounded-full blur-2xl animate-float-minimal" style={{ animationDelay: '26s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            Reputation-Based Skills Validation
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Your Professional
            <span className="block text-gradient">Skills Passport</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Build, validate, and showcase your skills through community endorsements backed by reputation staking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg animate-subtle-glow"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={handleViewLeaderboard}
            >
              View Leaderboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SkillPass Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A decentralized approach to professional validation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-strong">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Build Your Profile</h3>
                <p className="text-muted-foreground">
                  Create a comprehensive skills profile showcasing your expertise and professional journey.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Get Endorsed</h3>
                <p className="text-muted-foreground">
                  Receive endorsements from peers who stake their reputation to validate your skills.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Earn Reputation</h3>
                <p className="text-muted-foreground">
                  Build your reputation score through quality endorsements and community validation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

            {/* Benefits Section */}
            <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose SkillPass?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Decentralized Validation</h3>
                    <p className="text-muted-foreground">
                      No central authority - your skills are validated by the community.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Reputation Staking</h3>
                    <p className="text-muted-foreground">
                      Endorsers stake their reputation, ensuring quality validation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Public Profiles</h3>
                    <p className="text-muted-foreground">
                      Showcase your validated skills to employers and collaborators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="glass-strong">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Join the Future</h3>
                  <p className="text-muted-foreground">
                    Be part of the next generation of professional validation
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-strong">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">Join the Future</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Be part of the next generation of professional validation
              </p>
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={handleCreateProfile}
              >
                Create Your Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}