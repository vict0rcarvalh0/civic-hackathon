"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@civic/auth-web3/react"

interface SkillsOverviewProps {
  compact?: boolean
}

export default function SkillsOverview({ compact = false }: SkillsOverviewProps) {
  const { user } = useUser()
  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await fetch("/api/links", { 
        headers: { "x-user-id": user.id || user.email || "" } 
      })
      const json = await res.json()
      setSkills(json.skills || [])
    }
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [user])

  const totalReputation = skills.reduce((s, skill) => s + (skill.reputationScore || 0), 0)
  const totalEndorsements = skills.reduce((s, skill) => s + (skill.endorsements?.length || 0), 0)

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Trophy className="w-5 h-5 text-purple-600" />
          Skills & Reputation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Total Skills</span>
          <span className="font-medium">{skills.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Reputation Score</span>
          <span className="font-medium">
            {totalReputation > 0 ? totalReputation.toLocaleString() : "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total Endorsements</span>
          <span className="font-medium">{totalEndorsements}</span>
        </div>

        {!compact &&
          skills.slice(0, 3).map((skill) => (
            <div key={skill.id} className="flex justify-between text-xs text-gray-600">
              <span className="truncate">{skill.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{skill.reputationScore || 0}</span>
              </div>
            </div>
          ))}

        {!compact && skills.length > 3 && (
          <p className="text-xs text-gray-500">{skills.length - 3}+ more skills</p>
        )}
      </CardContent>
    </Card>
  )
}