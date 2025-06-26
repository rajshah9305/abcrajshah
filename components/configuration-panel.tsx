"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Play, Plus, Trash2, Settings, User, Brain, AlertCircle } from "lucide-react"
import { useAgentStore, type AgentConfiguration } from "@/lib/store"

interface Agent {
  id: string
  name: string
  role: string
  instructions: string
  tools: string[]
}

export default function ConfigurationPanel() {
  const {
    selectedFramework,
    currentConfiguration,
    setCurrentConfiguration,
    saveConfiguration,
    setActiveTab,
    setExecutionStatus,
  } = useAgentStore()

  const [configName, setConfigName] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [maxIterations, setMaxIterations] = useState(10)
  const [temperature, setTemperature] = useState(0.7)
  const [enableLogging, setEnableLogging] = useState(true)
  const [agents, setAgents] = useState<Agent[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (currentConfiguration) {
      setConfigName(currentConfiguration.name)
      setSystemPrompt(currentConfiguration.settings.systemPrompt || "")
      setMaxIterations(currentConfiguration.settings.maxIterations || 10)
      setTemperature(currentConfiguration.settings.temperature || 0.7)
      setEnableLogging(currentConfiguration.settings.enableLogging ?? true)
      setAgents(currentConfiguration.agents || [])
    } else if (selectedFramework) {
      // Initialize with default values
      setConfigName(`${selectedFramework.name} Configuration`)
      setSystemPrompt(getDefaultSystemPrompt(selectedFramework.id))
      setAgents(getDefaultAgents(selectedFramework.id))
    }
  }, [currentConfiguration, selectedFramework])

  const getDefaultSystemPrompt = (frameworkId: string) => {
    const prompts: Record<string, string> = {
      autogen:
        "You are part of a collaborative AI team. Work together to solve complex problems by leveraging each agent's unique capabilities.",
      crewai:
        "You are a specialized agent in a crew. Follow your role's responsibilities and collaborate effectively with other crew members.",
      autogpt:
        "You are an autonomous AI agent. Break down complex goals into manageable tasks and execute them systematically.",
      babyagi: "You are a task management AI. Create, prioritize, and execute tasks to achieve the given objective.",
      default:
        "You are a helpful AI assistant. Follow the instructions and complete the given tasks to the best of your ability.",
    }
    return prompts[frameworkId] || prompts.default
  }

  const getDefaultAgents = (frameworkId: string): Agent[] => {
    if (selectedFramework?.type === "single-agent") return []

    const agentTemplates: Record<string, Agent[]> = {
      autogen: [
        {
          id: "1",
          name: "Planner",
          role: "Task Planner",
          instructions: "Break down complex problems into manageable tasks and create execution plans.",
          tools: ["web_search", "code_execution"],
        },
        {
          id: "2",
          name: "Executor",
          role: "Task Executor",
          instructions: "Execute the planned tasks and provide detailed results.",
          tools: ["code_execution", "file_operations"],
        },
      ],
      crewai: [
        {
          id: "1",
          name: "Researcher",
          role: "Research Specialist",
          instructions: "Conduct thorough research on given topics and provide comprehensive insights.",
          tools: ["web_search", "document_analysis"],
        },
        {
          id: "2",
          name: "Analyst",
          role: "Data Analyst",
          instructions: "Analyze data and provide actionable insights and recommendations.",
          tools: ["data_analysis", "visualization"],
        },
      ],
      default: [
        {
          id: "1",
          name: "Assistant",
          role: "General Assistant",
          instructions: "Provide helpful assistance for various tasks.",
          tools: ["web_search"],
        },
      ],
    }

    return agentTemplates[frameworkId] || agentTemplates.default
  }

  const addAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${agents.length + 1}`,
      role: "Assistant",
      instructions: "Provide helpful assistance for assigned tasks.",
      tools: ["web_search"],
    }
    setAgents([...agents, newAgent])
  }

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(agents.map((agent) => (agent.id === id ? { ...agent, ...updates } : agent)))
  }

  const removeAgent = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
  }

  const validateConfiguration = () => {
    const newErrors: Record<string, string> = {}

    if (!configName.trim()) {
      newErrors.configName = "Configuration name is required"
    }

    if (!systemPrompt.trim()) {
      newErrors.systemPrompt = "System prompt is required"
    }

    if (selectedFramework?.type === "multi-agent" && agents.length === 0) {
      newErrors.agents = "At least one agent is required for multi-agent frameworks"
    }

    agents.forEach((agent, index) => {
      if (!agent.name.trim()) {
        newErrors[`agent_${index}_name`] = "Agent name is required"
      }
      if (!agent.instructions.trim()) {
        newErrors[`agent_${index}_instructions`] = "Agent instructions are required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateConfiguration() || !selectedFramework) return

    const config: AgentConfiguration = {
      id: currentConfiguration?.id || Date.now().toString(),
      name: configName,
      framework: selectedFramework.id,
      settings: {
        systemPrompt,
        maxIterations,
        temperature,
        enableLogging,
      },
      agents: selectedFramework.type === "multi-agent" ? agents : undefined,
      createdAt: currentConfiguration?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    saveConfiguration(config)
    setCurrentConfiguration(config)
  }

  const handleExecute = () => {
    if (!validateConfiguration()) return

    handleSave()
    setExecutionStatus("running")
    setActiveTab("execute")
  }

  if (!selectedFramework) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Framework Selected</h3>
        <p className="text-gray-400 mb-6">Please select a framework first to configure your AI agents.</p>
        <Button onClick={() => setActiveTab("frameworks")} className="bg-purple-600 hover:bg-purple-700">
          Select Framework
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
          <h2 className="text-2xl font-bold text-white">Configure {selectedFramework.name}</h2>
          <p className="text-gray-400 mt-1">Set up your AI agents and execution parameters</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={handleExecute}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Execute
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/10">
          <TabsTrigger value="general" className="data-[state=active]:bg-purple-600">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-purple-600"
            disabled={selectedFramework.type === "single-agent"}
          >
            <User className="w-4 h-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-600">
            <Brain className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Basic Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Configure the basic settings for your AI agent execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="configName" className="text-white">
                  Configuration Name
                </Label>
                <Input
                  id="configName"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="Enter configuration name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
                {errors.configName && <p className="text-red-400 text-sm">{errors.configName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt" className="text-white">
                  System Prompt
                </Label>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt for your agents"
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 resize-none"
                />
                {errors.systemPrompt && <p className="text-red-400 text-sm">{errors.systemPrompt}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxIterations" className="text-white">
                    Max Iterations
                  </Label>
                  <Input
                    id="maxIterations"
                    type="number"
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(Number.parseInt(e.target.value))}
                    min={1}
                    max={100}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-white">
                    Temperature
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                    min={0}
                    max={2}
                    step={0.1}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enableLogging" checked={enableLogging} onCheckedChange={setEnableLogging} />
                <Label htmlFor="enableLogging" className="text-white">
                  Enable detailed logging
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Agent Configuration</h3>
              <p className="text-gray-400">Configure individual agents and their roles</p>
            </div>
            <Button onClick={addAgent} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          </div>

          {errors.agents && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400">{errors.agents}</p>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {agents.map((agent, index) => (
                <motion.div
                  key={`agent-config-${agent.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <CardTitle className="text-white">Agent {index + 1}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAgent(agent.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Agent Name</Label>
                          <Input
                            value={agent.name}
                            onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
                            placeholder="Enter agent name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                          {errors[`agent_${index}_name`] && (
                            <p className="text-red-400 text-sm">{errors[`agent_${index}_name`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Role</Label>
                          <Input
                            value={agent.role}
                            onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
                            placeholder="Enter agent role"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Instructions</Label>
                        <Textarea
                          value={agent.instructions}
                          onChange={(e) => updateAgent(agent.id, { instructions: e.target.value })}
                          placeholder="Enter detailed instructions for this agent"
                          rows={3}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 resize-none"
                        />
                        {errors[`agent_${index}_instructions`] && (
                          <p className="text-red-400 text-sm">{errors[`agent_${index}_instructions`]}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["web_search", "code_execution", "file_operations", "data_analysis", "visualization"].map(
                          (tool, toolIndex) => (
                            <Badge
                              key={`tool-${agent.id}-${tool}-${toolIndex}`}
                              variant={agent.tools.includes(tool) ? "default" : "outline"}
                              className={`cursor-pointer transition-colors ${
                                agent.tools.includes(tool)
                                  ? "bg-purple-600 hover:bg-purple-700"
                                  : "border-white/20 text-gray-400 hover:border-purple-500/50 hover:text-purple-300"
                              }`}
                              onClick={() => {
                                const newTools = agent.tools.includes(tool)
                                  ? agent.tools.filter((t) => t !== tool)
                                  : [...agent.tools, tool]
                                updateAgent(agent.id, { tools: newTools })
                              }}
                            >
                              {tool.replace("_", " ")}
                            </Badge>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {agents.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No agents configured yet</p>
              <Button
                onClick={addAgent}
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Agent
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Advanced Settings</CardTitle>
              <CardDescription className="text-gray-400">Fine-tune execution parameters and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Execution Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Parallel Execution</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Auto-retry on Failure</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Save Intermediate Results</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Resource Limits</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Max Execution Time (minutes)</Label>
                      <Input
                        type="number"
                        defaultValue={30}
                        min={1}
                        max={120}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Memory Limit (MB)</Label>
                      <Input
                        type="number"
                        defaultValue={512}
                        min={128}
                        max={2048}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
