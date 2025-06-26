"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Settings,
  Save,
  Upload,
  Bell,
  Shield,
  Key,
  History,
  Star,
  Activity,
  Brain,
  Clock,
  Trash2,
} from "lucide-react"
import { useAgentStore } from "@/lib/store"

export default function UserProfile() {
  const { userProfile, updateUserProfile, savedConfigurations, deleteConfiguration, executionHistory } = useAgentStore()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    notifications: userProfile.preferences.notifications,
    theme: userProfile.preferences.theme,
    defaultFramework: userProfile.preferences.defaultFramework || "",
  })

  const handleSave = () => {
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      preferences: {
        ...userProfile.preferences,
        notifications: formData.notifications,
        theme: formData.theme,
        defaultFramework: formData.defaultFramework || undefined,
      },
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      notifications: userProfile.preferences.notifications,
      theme: userProfile.preferences.theme,
      defaultFramework: userProfile.preferences.defaultFramework || "",
    })
    setIsEditing(false)
  }

  const stats = [
    { label: "Configurations", value: savedConfigurations.length, icon: Settings, color: "text-blue-400" },
    { label: "Executions", value: executionHistory.length, icon: Activity, color: "text-green-400" },
    { label: "Success Rate", value: "98%", icon: Star, color: "text-yellow-400" },
    { label: "Total Runtime", value: "24h", icon: Clock, color: "text-purple-400" },
  ]

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
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={`user-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm border border-white/10">
          <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="configurations" className="data-[state=active]:bg-purple-600">
            <Settings className="w-4 h-4 mr-2" />
            Configurations
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-600">
            <Bell className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultFramework" className="text-white">
                      Default Framework
                    </Label>
                    <Input
                      id="defaultFramework"
                      value={formData.defaultFramework}
                      onChange={(e) => setFormData({ ...formData, defaultFramework: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., AutoGen, CrewAI"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 disabled:opacity-50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Security */}
            <div>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Two-Factor Auth</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Last Login</span>
                      <span className="text-gray-400 text-sm">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Password</span>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        Change
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      API Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Saved Configurations</CardTitle>
              <CardDescription className="text-gray-400">Manage your saved AI agent configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {savedConfigurations.length > 0 ? (
                    savedConfigurations.map((config, index) => (
                      <motion.div
                        key={`saved-config-${config.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{config.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                                {config.framework}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                Updated {config.updatedAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* action buttons */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={() => {
                              /* navigate user to edit this configuration */
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }}
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteConfiguration(config.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">You have no saved configurations yet.</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
