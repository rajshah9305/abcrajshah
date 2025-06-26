import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Framework {
  id: string
  name: string
  description: string
  type: "multi-agent" | "single-agent"
  icon: string
  color: string
  features: string[]
  complexity: "beginner" | "intermediate" | "advanced"
}

export interface AgentConfiguration {
  id: string
  name: string
  framework: string
  settings: Record<string, any>
  agents?: Array<{
    id: string
    name: string
    role: string
    instructions: string
    tools: string[]
  }>
  createdAt: Date
  updatedAt: Date
}

export interface ExecutionResult {
  id: string
  configurationId: string
  status: "success" | "error" | "running"
  output: any
  logs: Array<{
    timestamp: Date
    level: "info" | "warning" | "error"
    message: string
    agent?: string
  }>
  startTime: Date
  endTime?: Date
}

interface AgentStore {
  // UI State
  activeTab: string
  setActiveTab: (tab: string) => void

  // Framework Selection
  selectedFramework: Framework | null
  setSelectedFramework: (framework: Framework | null) => void

  // Configuration
  currentConfiguration: AgentConfiguration | null
  setCurrentConfiguration: (config: AgentConfiguration | null) => void
  savedConfigurations: AgentConfiguration[]
  saveConfiguration: (config: AgentConfiguration) => void
  deleteConfiguration: (id: string) => void

  // Execution
  executionStatus: "idle" | "running" | "completed" | "error"
  setExecutionStatus: (status: "idle" | "running" | "completed" | "error") => void
  currentExecution: ExecutionResult | null
  setCurrentExecution: (execution: ExecutionResult | null) => void
  executionHistory: ExecutionResult[]
  addExecutionResult: (result: ExecutionResult) => void

  // Progress
  currentStep: number
  setCurrentStep: (step: number) => void

  // User Profile
  userProfile: {
    name: string
    email: string
    avatar?: string
    preferences: {
      theme: "dark" | "light"
      defaultFramework?: string
      notifications: boolean
    }
  }
  updateUserProfile: (profile: Partial<AgentStore["userProfile"]>) => void
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      // UI State
      activeTab: "frameworks",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Framework Selection
      selectedFramework: null,
      setSelectedFramework: (framework) => set({ selectedFramework: framework }),

      // Configuration
      currentConfiguration: null,
      setCurrentConfiguration: (config) => set({ currentConfiguration: config }),
      savedConfigurations: [],
      saveConfiguration: (config) => {
        const configs = get().savedConfigurations
        const existingIndex = configs.findIndex((c) => c.id === config.id)
        if (existingIndex >= 0) {
          configs[existingIndex] = { ...config, updatedAt: new Date() }
        } else {
          configs.push(config)
        }
        set({ savedConfigurations: [...configs] })
      },
      deleteConfiguration: (id) => {
        const configs = get().savedConfigurations.filter((c) => c.id !== id)
        set({ savedConfigurations: configs })
      },

      // Execution
      executionStatus: "idle",
      setExecutionStatus: (status) => set({ executionStatus: status }),
      currentExecution: null,
      setCurrentExecution: (execution) => set({ currentExecution: execution }),
      executionHistory: [],
      addExecutionResult: (result) => {
        const history = get().executionHistory
        set({ executionHistory: [result, ...history.slice(0, 49)] }) // Keep last 50
      },

      // Progress
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),

      // User Profile
      userProfile: {
        name: "AI Orchestrator",
        email: "user@example.com",
        preferences: {
          theme: "dark",
          notifications: true,
        },
      },
      updateUserProfile: (profile) => {
        const current = get().userProfile
        set({ userProfile: { ...current, ...profile } })
      },
    }),
    {
      name: "agent-orchestrator-store",
      partialize: (state) => ({
        savedConfigurations: state.savedConfigurations,
        executionHistory: state.executionHistory,
        userProfile: state.userProfile,
      }),
    },
  ),
)
