"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bot,
  Users,
  Zap,
  Brain,
  Network,
  Cpu,
  Globe,
  Search,
  ChevronRight,
  Star,
  GitBranch,
  Code,
  MessageSquare,
  Sparkles,
  Filter,
  TrendingUp,
} from "lucide-react"
import { useAgentStore, type Framework } from "@/lib/store"

const frameworks: Framework[] = [
  {
    id: "autogen",
    name: "AutoGen",
    description:
      "Multi-agent conversation framework with customizable agents that can collaborate to solve complex tasks.",
    type: "multi-agent",
    icon: "Users",
    color: "from-orange-500 to-red-500",
    features: ["Multi-agent conversations", "Code execution", "Human-in-the-loop", "Customizable roles"],
    complexity: "intermediate",
  },
  {
    id: "metagpt",
    name: "MetaGPT",
    description: "Multi-agent framework that assigns different roles to GPTs to form a collaborative software entity.",
    type: "multi-agent",
    icon: "GitBranch",
    color: "from-purple-500 to-pink-500",
    features: ["Role-based agents", "Software development", "Document generation", "Team collaboration"],
    complexity: "advanced",
  },
  {
    id: "crewai",
    name: "CrewAI",
    description: "Framework for orchestrating role-playing, autonomous AI agents to tackle complex tasks.",
    type: "multi-agent",
    icon: "Network",
    color: "from-blue-500 to-indigo-500",
    features: ["Role-playing agents", "Task delegation", "Hierarchical execution", "Tool integration"],
    complexity: "intermediate",
  },
  {
    id: "autogpt",
    name: "Auto-GPT",
    description: "Autonomous GPT-4 agent that chains together LLM thoughts to autonomously achieve goals.",
    type: "single-agent",
    icon: "Bot",
    color: "from-green-500 to-emerald-500",
    features: ["Autonomous execution", "Goal-oriented", "Memory management", "Web browsing"],
    complexity: "beginner",
  },
  {
    id: "babyagi",
    name: "BabyAGI",
    description: "AI-powered task management system that creates, prioritizes, and executes tasks.",
    type: "single-agent",
    icon: "Brain",
    color: "from-yellow-500 to-orange-500",
    features: ["Task creation", "Prioritization", "Execution loop", "Vector memory"],
    complexity: "beginner",
  },
  {
    id: "langgraph",
    name: "LangGraph",
    description: "Library for building stateful, multi-actor applications with LLMs using graph-based workflows.",
    type: "multi-agent",
    icon: "GitBranch",
    color: "from-indigo-500 to-purple-500",
    features: ["Graph workflows", "State management", "Multi-actor", "Conditional routing"],
    complexity: "advanced",
  },
  {
    id: "camelai",
    name: "Camel-AI",
    description: "Multi-agent framework for role-playing autonomous cooperative agents.",
    type: "multi-agent",
    icon: "MessageSquare",
    color: "from-teal-500 to-cyan-500",
    features: ["Role-playing", "Cooperative agents", "Communication protocols", "Task solving"],
    complexity: "intermediate",
  },
  {
    id: "agentverse",
    name: "AgentVerse",
    description: "Framework for deploying multiple LLM-based agents in various environments.",
    type: "multi-agent",
    icon: "Globe",
    color: "from-pink-500 to-rose-500",
    features: ["Multi-environment", "Agent deployment", "Simulation", "Scalable architecture"],
    complexity: "advanced",
  },
  {
    id: "openagents",
    name: "OpenAgents",
    description: "Open platform for using and hosting language agents in the wild.",
    type: "multi-agent",
    icon: "Code",
    color: "from-cyan-500 to-blue-500",
    features: ["Open platform", "Agent hosting", "Tool integration", "Web interface"],
    complexity: "intermediate",
  },
  {
    id: "miniagi",
    name: "MiniAGI",
    description: "Minimal general-purpose autonomous agent based on GPT-3.5/4.",
    type: "single-agent",
    icon: "Zap",
    color: "from-lime-500 to-green-500",
    features: ["Minimal setup", "General purpose", "GPT-based", "Lightweight"],
    complexity: "beginner",
  },
  {
    id: "orca",
    name: "Orca",
    description: "Progressive learning framework that learns to imitate the reasoning process of LFMs.",
    type: "single-agent",
    icon: "Cpu",
    color: "from-violet-500 to-purple-500",
    features: ["Progressive learning", "Reasoning imitation", "Step-by-step learning", "Explanation tuning"],
    complexity: "advanced",
  },
]

const iconMap = {
  Users,
  Bot,
  Zap,
  Brain,
  Network,
  Cpu,
  Globe,
  GitBranch,
  Code,
  MessageSquare,
}

const complexityColors = {
  beginner: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30",
  intermediate: "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30",
  advanced: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30",
}

export default function FrameworkSelector() {
  const { selectedFramework, setSelectedFramework, setActiveTab } = useAgentStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "multi-agent" | "single-agent">("all")
  const [filterComplexity, setFilterComplexity] = useState<"all" | "beginner" | "intermediate" | "advanced">("all")

  const filteredFrameworks = frameworks.filter((framework) => {
    const matchesSearch =
      framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      framework.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || framework.type === filterType
    const matchesComplexity = filterComplexity === "all" || framework.complexity === filterComplexity

    return matchesSearch && matchesType && matchesComplexity
  })

  const handleSelectFramework = (framework: Framework) => {
    setSelectedFramework(framework)
    setTimeout(() => setActiveTab("configure"), 300)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-6">
        <motion.div
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Choose Your AI Framework
        </motion.div>

        <motion.h2
          className="text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Select Your AI Framework
        </motion.h2>

        <motion.p
          className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Choose from our comprehensive collection of AI agent frameworks, each designed for different use cases and
          complexity levels.{" "}
          <span className="text-orange-300">From simple autonomous agents to complex multi-agent orchestrations.</span>
        </motion.p>
      </div>

      {/* Enhanced Search and Filters */}
      <motion.div
        className="flex flex-col lg:flex-row gap-6 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search frameworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-gradient-to-r from-white/5 to-white/[0.02] border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 rounded-xl backdrop-blur-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {[
              { key: "all", label: "All Types", value: "all" },
              { key: "multi-agent", label: "Multi-Agent", value: "multi-agent" },
              { key: "single-agent", label: "Single-Agent", value: "single-agent" },
            ].map((filterOption) => (
              <Button
                key={`filter-type-${filterOption.key}`}
                variant={filterType === filterOption.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(filterOption.value as typeof filterType)}
                className={
                  filterType === filterOption.value
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg text-white"
                    : "border-white/20 text-gray-300 hover:bg-white/10 bg-transparent backdrop-blur-sm hover:text-white"
                }
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Framework Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence>
          {filteredFrameworks.map((framework, index) => {
            const IconComponent = iconMap[framework.icon as keyof typeof iconMap]

            return (
              <motion.div
                key={`framework-${framework.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="group cursor-pointer"
                onClick={() => handleSelectFramework(framework)}
              >
                <Card
                  className={`h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-2xl hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-500 shadow-2xl hover:shadow-orange-500/10 rounded-2xl ${
                    selectedFramework?.id === framework.id
                      ? "ring-2 ring-orange-500/50 bg-gradient-to-br from-orange-500/10 to-red-500/5 shadow-orange-500/25"
                      : ""
                  }`}
                >
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${framework.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                      </div>
                      <Badge className={`${complexityColors[framework.complexity]} font-medium px-3 py-1`}>
                        {framework.complexity}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <CardTitle className="text-xl text-white group-hover:text-orange-300 transition-colors duration-300">
                        {framework.name}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 text-xs font-medium border-gray-600/30"
                        >
                          {framework.type}
                        </Badge>
                        <div className="flex items-center text-orange-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs ml-1 font-medium">4.{Math.floor(Math.random() * 9) + 1}</span>
                        </div>
                        <div className="flex items-center text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs ml-1 font-medium">+{Math.floor(Math.random() * 50) + 10}%</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-0">
                    <CardDescription className="text-gray-300 text-sm leading-relaxed">
                      {framework.description}
                    </CardDescription>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-200">Key Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {framework.features.slice(0, 3).map((feature, idx) => (
                          <Badge
                            key={`feature-${framework.id}-${idx}`}
                            variant="outline"
                            className="text-xs border-white/20 text-gray-300 hover:border-orange-500/50 hover:text-orange-300 transition-colors duration-200 bg-white/5"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {framework.features.length > 3 && (
                          <Badge
                            key={`more-features-${framework.id}`}
                            variant="outline"
                            className="text-xs border-white/20 text-gray-300 bg-white/5"
                          >
                            +{framework.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white group-hover:shadow-xl group-hover:shadow-orange-500/25 transition-all duration-300 rounded-xl font-semibold py-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectFramework(framework)
                      }}
                    >
                      Select Framework
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filteredFrameworks.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-gray-300 text-xl mb-4">No frameworks match your current filters.</div>
          <Button
            variant="outline"
            className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent backdrop-blur-sm hover:text-white"
            onClick={() => {
              setSearchTerm("")
              setFilterType("all")
              setFilterComplexity("all")
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}
