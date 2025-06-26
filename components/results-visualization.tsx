"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  Share,
  Copy,
  Eye,
  Code,
  FileText,
  ImageIcon,
  BarChart3,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Network,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useAgentStore } from "@/lib/store"

interface ExecutionResult {
  id: string
  type: "text" | "code" | "image" | "data" | "analysis"
  title: string
  content: any
  agent?: string
  timestamp: Date
  status: "success" | "error" | "warning"
  metadata?: Record<string, any>
}

const mockResults: ExecutionResult[] = [
  {
    id: "1",
    type: "text",
    title: "Task Analysis Summary",
    content: `# Executive Summary

The AI agent orchestration successfully completed the assigned task with the following key outcomes:

## Key Achievements
- ✅ Successfully processed 15 complex queries
- ✅ Generated comprehensive analysis reports
- ✅ Maintained 98.5% accuracy rate
- ✅ Completed execution within time constraints

## Performance Metrics
- **Total Execution Time**: 4 minutes 32 seconds
- **Tasks Completed**: 15/15
- **Success Rate**: 100%
- **Average Response Time**: 18.2 seconds

## Recommendations
1. Consider increasing parallel processing for larger datasets
2. Implement caching mechanisms for frequently accessed data
3. Add more specialized agents for domain-specific tasks`,
    agent: "Analyst",
    timestamp: new Date(),
    status: "success",
  },
  {
    id: "2",
    type: "code",
    title: "Generated Python Script",
    content: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

def analyze_data(data_path):
    """
    Analyze dataset and build predictive model
    """
    # Load and preprocess data
    df = pd.read_csv(data_path)
    
    # Feature engineering
    X = df.drop('target', axis=1)
    y = df['target']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Evaluate performance
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    
    return {
        'accuracy': accuracy,
        'classification_report': report,
        'feature_importance': dict(zip(X.columns, model.feature_importances_))
    }

# Execute analysis
if __name__ == "__main__":
    results = analyze_data('dataset.csv')
    print(f"Model Accuracy: {results['accuracy']:.3f}")
    print("\\nClassification Report:")
    print(results['classification_report'])`,
    agent: "Code Generator",
    timestamp: new Date(Date.now() - 60000),
    status: "success",
    metadata: {
      language: "python",
      lines: 45,
      functions: 1,
    },
  },
  {
    id: "3",
    type: "data",
    title: "Performance Analytics",
    content: {
      metrics: {
        "Total Requests": 1247,
        "Success Rate": "98.5%",
        "Average Response Time": "1.2s",
        "Peak Throughput": "150 req/min",
        "Error Rate": "1.5%",
        Uptime: "99.9%",
      },
      trends: [
        { period: "Last Hour", requests: 150, success: 148, errors: 2 },
        { period: "Last 6 Hours", requests: 890, success: 876, errors: 14 },
        { period: "Last 24 Hours", requests: 1247, success: 1228, errors: 19 },
      ],
    },
    agent: "Monitor",
    timestamp: new Date(Date.now() - 120000),
    status: "success",
  },
  {
    id: "4",
    type: "analysis",
    title: "Agent Collaboration Report",
    content: {
      summary: "Multi-agent collaboration analysis reveals optimal task distribution and communication patterns.",
      insights: [
        "Agent specialization improved task completion by 34%",
        "Inter-agent communication reduced redundant processing by 28%",
        "Load balancing achieved 95% efficiency across all agents",
        "Error handling mechanisms prevented 12 potential failures",
      ],
      recommendations: [
        "Implement dynamic role assignment based on task complexity",
        "Add predictive load balancing for peak usage periods",
        "Enhance error recovery protocols for critical tasks",
      ],
    },
    agent: "Coordinator",
    timestamp: new Date(Date.now() - 180000),
    status: "success",
  },
]

const typeIcons = {
  text: FileText,
  code: Code,
  image: ImageIcon,
  data: BarChart3,
  analysis: Brain,
}

const statusColors = {
  success: "text-green-400 bg-green-500/20 border-green-500/30",
  error: "text-red-400 bg-red-500/20 border-red-500/30",
  warning: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
}

export default function ResultsVisualization() {
  const { executionStatus, currentConfiguration, selectedFramework } = useAgentStore()
  const [results, setResults] = useState<ExecutionResult[]>([])
  const [selectedResult, setSelectedResult] = useState<ExecutionResult | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (executionStatus === "completed") {
      setResults(mockResults)
    }
  }, [executionStatus])

  const handleCopyResult = (result: ExecutionResult) => {
    const content = typeof result.content === "string" ? result.content : JSON.stringify(result.content, null, 2)
    navigator.clipboard.writeText(content)
  }

  const handleDownloadResult = (result: ExecutionResult) => {
    const content = typeof result.content === "string" ? result.content : JSON.stringify(result.content, null, 2)

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${result.title.toLowerCase().replace(/\s+/g, "-")}.${result.type === "code" ? "py" : "txt"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (executionStatus === "idle" || results.length === 0) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Results Available</h3>
        <p className="text-gray-400 mb-6">
          {executionStatus === "running"
            ? "Execution in progress. Results will appear here when completed."
            : "Execute your AI agents to see results and analysis here."}
        </p>
        {executionStatus === "idle" && (
          <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
            Start New Execution
          </Button>
        )}
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
          <h2 className="text-2xl font-bold text-white">Execution Results</h2>
          <p className="text-gray-400 mt-1">
            Analysis and outputs from {currentConfiguration?.name || "your AI agents"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm border border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="outputs" className="data-[state=active]:bg-purple-600">
            <FileText className="w-4 h-4 mr-2" />
            Outputs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600">
            <Brain className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Results</p>
                    <p className="text-2xl font-bold text-white">{results.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">100%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Execution Time</p>
                    <p className="text-2xl font-bold text-blue-400">4m 32s</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Agents Used</p>
                    <p className="text-2xl font-bold text-purple-400">{currentConfiguration?.agents?.length || 1}</p>
                  </div>
                  <Network className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Results */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Results</CardTitle>
              <CardDescription className="text-gray-400">Latest outputs from your AI agent execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.slice(0, 3).map((result, index) => {
                  const IconComponent = typeIcons[result.type]
                  return (
                    <motion.div
                      key={`recent-result-${result.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{result.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {result.agent && (
                              <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                                {result.agent}
                              </Badge>
                            )}
                            <Badge className={`text-xs ${statusColors[result.status]}`}>{result.status}</Badge>
                            <span className="text-xs text-gray-400">{result.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyResult(result)
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadResult(result)
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outputs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">All Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {results.map((result) => {
                        const IconComponent = typeIcons[result.type]
                        return (
                          <motion.div
                            key={`result-item-${result.id}`}
                            whileHover={{ scale: 1.02 }}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedResult?.id === result.id
                                ? "bg-purple-500/20 border border-purple-500/30"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                            onClick={() => setSelectedResult(result)}
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-4 h-4 text-gray-400" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{result.title}</p>
                                <p className="text-xs text-gray-400">
                                  {result.agent} • {result.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Result Detail */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-white">
                      {selectedResult?.title || "Select a result to view details"}
                    </CardTitle>
                    {selectedResult && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={`text-xs ${statusColors[selectedResult.status]}`}>
                          {selectedResult.status}
                        </Badge>
                        {selectedResult.agent && (
                          <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                            {selectedResult.agent}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedResult && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyResult(selectedResult)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadResult(selectedResult)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {selectedResult ? (
                      <div className="space-y-4">
                        {selectedResult.type === "text" && (
                          <div className="prose prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                              {selectedResult.content}
                            </pre>
                          </div>
                        )}

                        {selectedResult.type === "code" && (
                          <div className="bg-black/50 rounded-lg p-4 border border-white/10">
                            <pre className="text-green-400 text-sm overflow-x-auto">
                              <code>{selectedResult.content}</code>
                            </pre>
                          </div>
                        )}

                        {selectedResult.type === "data" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(selectedResult.content.metrics).map(([key, value], metricIndex) => (
                                <div
                                  key={`metric-${selectedResult.id}-${key}-${metricIndex}`}
                                  className="bg-white/5 rounded-lg p-3"
                                >
                                  <p className="text-sm text-gray-400">{key}</p>
                                  <p className="text-lg font-semibold text-white">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedResult.type === "analysis" && (
                          <div className="space-y-4">
                            <div className="bg-white/5 rounded-lg p-4">
                              <h4 className="font-medium text-white mb-2">Summary</h4>
                              <p className="text-gray-300 text-sm">{selectedResult.content.summary}</p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4">
                              <h4 className="font-medium text-white mb-2">Key Insights</h4>
                              <ul className="space-y-2">
                                {selectedResult.content.insights.map((insight: string, index: number) => (
                                  <li
                                    key={`insight-${selectedResult.id}-${index}`}
                                    className="text-gray-300 text-sm flex items-start"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a result from the list to view its details</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-green-400 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Response Time</span>
                    <span className="text-blue-400 font-semibold">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Processing Time</span>
                    <span className="text-purple-400 font-semibold">4m 32s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Memory Efficiency</span>
                    <span className="text-orange-400 font-semibold">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Result Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    results.reduce(
                      (acc, result) => {
                        acc[result.type] = (acc[result.type] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([type, count], typeIndex) => {
                    const IconComponent = typeIcons[type as keyof typeof typeIcons]
                    const percentage = (count / results.length) * 100
                    return (
                      <div key={`result-type-${type}-${typeIndex}`} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4 text-gray-400" />
                            <span className="text-white capitalize">{type}</span>
                          </div>
                          <span className="text-gray-400">{count}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription className="text-gray-400">
                Automated analysis of your execution results and performance patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Performance Highlights</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">Optimal Resource Utilization</p>
                        <p className="text-gray-400 text-xs">
                          CPU and memory usage remained within optimal ranges throughout execution
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">Efficient Task Distribution</p>
                        <p className="text-gray-400 text-xs">
                          Multi-agent coordination achieved 95% efficiency in task allocation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">Zero Critical Errors</p>
                        <p className="text-gray-400 text-xs">
                          All tasks completed successfully without system failures
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">Parallel Processing</p>
                        <p className="text-gray-400 text-xs">
                          Consider enabling parallel execution for 23% faster completion
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">Caching Strategy</p>
                        <p className="text-gray-400 text-xs">
                          Implement result caching to reduce redundant computations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-white text-sm">Agent Specialization</p>
                        <p className="text-gray-400 text-xs">Add domain-specific agents for improved task handling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="font-medium text-white mb-4">Recommended Next Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h5 className="text-white font-medium mb-2">Scale Configuration</h5>
                    <p className="text-gray-400 text-sm">Your current setup can handle 3x more concurrent tasks</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h5 className="text-white font-medium mb-2">Add Monitoring</h5>
                    <p className="text-gray-400 text-sm">Implement real-time alerts for performance thresholds</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h5 className="text-white font-medium mb-2">Backup Strategy</h5>
                    <p className="text-gray-400 text-sm">Configure automatic result backups for critical executions</p>
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
