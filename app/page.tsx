"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot,
  Settings,
  Play,
  ChevronRight,
  Sparkles,
  Brain,
  Network,
  Activity,
  User,
  Save,
  Eye,
  Zap,
} from "lucide-react"
import { useAgentStore } from "@/lib/store"
import FrameworkSelector from "@/components/framework-selector"
import ConfigurationPanel from "@/components/configuration-panel"
import ExecutionMonitor from "@/components/execution-monitor"
import ResultsVisualization from "@/components/results-visualization"
import UserProfile from "@/components/user-profile"
import ThreeBackground from "@/components/three-background"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Dashboard() {
  const { selectedFramework, executionStatus, currentStep, activeTab, setActiveTab, savedConfigurations } =
    useAgentStore()

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (executionStatus === "running") {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 95))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [executionStatus])

  const stats = [
    {
      label: "Active Agents",
      value: "12",
      icon: Bot,
      color: "from-orange-400 to-red-500",
      bg: "bg-orange-500/10",
      change: "+23%",
    },
    {
      label: "Frameworks",
      value: "11",
      icon: Network,
      color: "from-blue-400 to-indigo-500",
      bg: "bg-blue-500/10",
      change: "+2",
    },
    {
      label: "Executions",
      value: "1.2k",
      icon: Activity,
      color: "from-green-400 to-emerald-500",
      bg: "bg-green-500/10",
      change: "+156%",
    },
    {
      label: "Saved Configs",
      value: savedConfigurations.length.toString(),
      icon: Save,
      color: "from-purple-400 to-violet-500",
      bg: "bg-purple-500/10",
      change: `+${savedConfigurations.length}`,
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Three.js 3D Background */}
      <ThreeBackground
        executionStatus={executionStatus}
        activeAgents={12}
        progress={progress}
        selectedFramework={selectedFramework?.name}
      />

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.header
          className="border-b border-white/5 backdrop-blur-2xl bg-black/20 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-300 bg-clip-text text-transparent">
                      AgentOrchestra
                    </h1>
                    <p className="text-xs text-gray-400 font-medium">AI Agent Orchestration Platform</p>
                  </div>
                </motion.div>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30 font-medium px-3 py-1"
                >
                  v2.0 Pro
                </Badge>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center space-y-8">
              <div className="space-y-6">
                <motion.div
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Next-Generation AI Orchestration
                </motion.div>

                <motion.h2
                  className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-white via-orange-200 via-orange-300 to-red-300 bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  Orchestrate
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    AI Agents
                  </span>
                </motion.h2>

                <motion.p
                  className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  Deploy, configure, and monitor AI agents across multiple frameworks.
                  <br />
                  <span className="text-orange-300">Build intelligent systems that work together seamlessly</span> with
                  enterprise-grade reliability.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-semibold shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setActiveTab("frameworks")}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Building
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-orange-500/50 px-10 py-5 rounded-2xl font-semibold bg-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={`dashboard-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group cursor-pointer"
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-2xl hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-500 shadow-2xl hover:shadow-orange-500/10 rounded-2xl">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                      <div
                        className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                      />
                      <div className="relative z-10">
                        <div
                          className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <stat.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-400 font-medium mb-2">{stat.label}</div>
                        <div className="text-xs text-orange-400 font-semibold">{stat.change}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Main Interface */}
            <motion.div variants={itemVariants}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <div className="flex justify-center">
                  <TabsList className="grid grid-cols-5 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <TabsTrigger
                      value="frameworks"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white"
                    >
                      <Network className="w-4 h-4 mr-2" />
                      Frameworks
                    </TabsTrigger>
                    <TabsTrigger
                      value="configure"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </TabsTrigger>
                    <TabsTrigger
                      value="execute"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Execute
                    </TabsTrigger>
                    <TabsTrigger
                      value="results"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Results
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </TabsTrigger>
                  </TabsList>
                </div>

                <AnimatePresence mode="wait">
                  <TabsContent value="frameworks" className="space-y-6">
                    <motion.div
                      key="frameworks"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <FrameworkSelector />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="configure" className="space-y-6">
                    <motion.div
                      key="configure"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ConfigurationPanel />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="execute" className="space-y-6">
                    <motion.div
                      key="execute"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ExecutionMonitor />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="results" className="space-y-6">
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ResultsVisualization />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="profile" className="space-y-6">
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <UserProfile />
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
