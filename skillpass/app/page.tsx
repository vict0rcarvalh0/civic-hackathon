import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Shield, Trophy, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
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
            <Button size="lg" className="px-8 py-4 text-lg animate-subtle-glow">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
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
                  <Users className="w-6 h-6 text-primary" />
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
                  <Shield className="w-6 h-6 text-primary" />
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
                  <Trophy className="w-6 h-6 text-primary" />
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

      {/* Stats Section */}
      <section className="px-6 py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,250+</div>
              <div className="text-muted-foreground">Skills Validated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">850+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Skill Categories</div>
            </div>
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
    </div>
  );
} 