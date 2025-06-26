"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Activity,
  Clock,
  Cpu,
  MemoryStickIcon as Memory,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  MessageSquare,
  TrendingUp,
  Download,
} from "lucide-react"
import { useAgentStore } from "@/lib/store"

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  message: string
  agent?: string
  details?: any
}

interface ExecutionMetrics {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  activeAgents: number
  executionTime: number
  memoryUsage: number
  cpuUsage: number
}

const levelIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
  success: CheckCircle,
}

const levelColors = {
  info: "text-blue-400",
  warning: "text-yellow-400",
  error: "text-red-400",
  success: "text-green-400",
}

export default function ExecutionMonitor() {
  const {
    selectedFramework,
    currentConfiguration,
    executionStatus,
    setExecutionStatus,
    currentExecution,
    setActiveTab,
  } = useAgentStore()

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [metrics, setMetrics] = useState<ExecutionMetrics>({
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    activeAgents: 0,
    executionTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
  })
  const [progress, setProgress] = useState(0)

  // Simulate execution progress and logs
  useEffect(() => {
    if (executionStatus === "running") {
      const interval = setInterval(() => {
        // Update progress
        setProgress((prev) => {
          const newProgress = Math.min(prev + Math.random() * 5, 100)
          if (newProgress >= 100) {
            setExecutionStatus("completed")
          }
          return newProgress
        })

        // Add random log entries
        if (Math.random() > 0.7) {
          const messages = [
            "Initializing agent communication protocols",
            "Processing user request and breaking down into subtasks",
            "Agent collaboration established successfully",
            "Executing task delegation across agent network",
            "Monitoring inter-agent communication patterns",
            "Validating intermediate results and outputs",
            "Optimizing resource allocation for better performance",
            "Handling error recovery and retry mechanisms",
            "Consolidating results from distributed agents",
            "Finalizing execution and preparing output summary",
          ]

          const levels: Array<"info" | "warning" | "error" | "success"> = ["info", "warning", "success"]
          const agents = currentConfiguration?.agents?.map((a) => a.name) || ["Main Agent"]

          const newLog: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            level: levels[Math.floor(Math.random() * levels.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            agent: agents[Math.floor(Math.random() * agents.length)],
          }

          setLogs((prev) => [newLog, ...prev.slice(0, 99)]) // Keep last 100 logs
        }

        // Update metrics
        setMetrics((prev) => ({
          ...prev,
          totalTasks: Math.max(prev.totalTasks, Math.floor(Math.random() * 20) + 10),
          completedTasks: Math.floor((progress / 100) * prev.totalTasks),
          activeAgents: currentConfiguration?.agents?.length || 1,
          executionTime: prev.executionTime + 1,
          memoryUsage: Math.min(Math.max(prev.memoryUsage + (Math.random() - 0.5) * 10, 0), 100),
          cpuUsage: Math.min(Math.max(prev.cpuUsage + (Math.random() - 0.5) * 15, 0), 100),
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [executionStatus, progress, currentConfiguration])

  const handleStart = () => {
    setExecutionStatus("running")
    setProgress(0)
    setLogs([])
    setMetrics({
      totalTasks: Math.floor(Math.random() * 15) + 5,
      completedTasks: 0,
      failedTasks: 0,
      activeAgents: currentConfiguration?.agents?.length || 1,
      executionTime: 0,
      memoryUsage: 20,
      cpuUsage: 10,
    })
  }

  const handlePause = () => {
    setExecutionStatus("idle")
  }

  const handleStop = () => {
    setExecutionStatus("idle")
    setProgress(0)
  }

  const handleReset = () => {
    setExecutionStatus("idle")
    setProgress(0)
    setLogs([])
    setMetrics({
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      activeAgents: 0,
      executionTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
    })
  }

  if (!selectedFramework || !currentConfiguration) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Activity className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Configuration Ready</h3>
        <p className="text-gray-400 mb-6">Please configure your agents before starting execution.</p>
        <Button onClick={() => setActiveTab("configure")} className="bg-purple-600 hover:bg-purple-700">
          Configure Agents
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Execution Monitor</h2>
          <p className="text-gray-400 mt-1">Real-time monitoring of {currentConfiguration.name}</p>
        </div>
        <div className="flex gap-2">
          {executionStatus === "idle" && (
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          )}
          {executionStatus === "running" && (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-lg font-semibold text-white capitalize">{executionStatus}</p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  executionStatus === "running"
                    ? "bg-green-400 animate-pulse"
                    : executionStatus === "completed"
                      ? "bg-blue-400"
                      : executionStatus === "error"
                        ? "bg-red-400"
                        : "bg-gray-400"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-lg font-semibold text-white">{Math.round(progress)}%</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Agents</p>
                <p className="text-lg font-semibold text-white">{metrics.activeAgents}</p>
              </div>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Runtime</p>
                <p className="text-lg font-semibold text-white">
                  {Math.floor(metrics.executionTime / 60)}:{(metrics.executionTime % 60).toString().padStart(2, "0")}
                </p>
              </div>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Execution Progress</h3>
              <Badge
                className={`${
                  executionStatus === "running"
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : executionStatus === "completed"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : executionStatus === "error"
                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                        : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                }`}
              >
                {executionStatus === "running"
                  ? "In Progress"
                  : executionStatus === "completed"
                    ? "Completed"
                    : executionStatus === "error"
                      ? "Error"
                      : "Ready"}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                Tasks: {metrics.completedTasks}/{metrics.totalTasks}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Metrics */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-white">CPU Usage</span>
                </div>
                <span className="text-gray-400">{Math.round(metrics.cpuUsage)}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Memory className="w-4 h-4 text-green-400" />
                  <span className="text-white">Memory Usage</span>
                </div>
                <span className="text-gray-400">{Math.round(metrics.memoryUsage)}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{metrics.totalTasks}</p>
                <p className="text-sm text-gray-400">Total Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{metrics.completedTasks}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Logs */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Execution Logs
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-2">
                <AnimatePresence>
                  {logs.map((log) => {
                    const IconComponent = levelIcons[log.level]
                    return (
                      <motion.div
                        key={`log-${log.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <IconComponent className={`w-4 h-4 mt-0.5 ${levelColors[log.level]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white">{log.message}</p>
                            <span className="text-xs text-gray-400">{log.timestamp.toLocaleTimeString()}</span>
                          </div>
                          {log.agent && <p className="text-xs text-gray-400 mt-1">Agent: {log.agent}</p>}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {logs.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No logs yet. Start execution to see real-time updates.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status (for multi-agent frameworks) */}
      {selectedFramework.type === "multi-agent" && currentConfiguration.agents && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Agent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentConfiguration.agents.map((agent, index) => (
                <motion.div
                  key={`agent-status-${agent.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{agent.name}</h4>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        executionStatus === "running" ? "bg-green-400 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{agent.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.slice(0, 2).map((tool) => (
                      <Badge
                        key={`agent-tool-${agent.id}-${tool}`}
                        variant="outline"
                        className="text-xs border-white/20 text-gray-400"
                      >
                        {tool.replace("_", " ")}
                      </Badge>
                    ))}
                    {agent.tools.length > 2 && (
                      <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                        +{agent.tools.length - 2}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
