"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Users,
  Shield,
  Brain,
  Database,
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Settings className="h-5 w-5" style={{ color: "#FA4616" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}

export default function HbIntelManagementCard() {
  return (
    <CardShell title="HB Intel Management">
      <div className="h-full">
        <Tabs defaultValue="general" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai">AI/ML</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">User Management</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">267</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-xs text-muted-foreground">Pending Invites</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Admin Users</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Project Managers</span>
                  <Badge variant="secondary">34</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Field Users</span>
                  <Badge variant="secondary">156</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Deactivated</span>
                  <Badge variant="destructive">7</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Application Security</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">MFA Enforcement</div>
                    <div className="text-xs text-muted-foreground">Required for all admin accounts</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Switch checked={true} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Session Timeout</div>
                    <div className="text-xs text-muted-foreground">Auto-logout after 2 hours</div>
                  </div>
                  <Badge variant="outline">2h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Password Policy</div>
                    <div className="text-xs text-muted-foreground">Complex passwords required</div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Audit Logs</div>
                    <div className="text-xs text-muted-foreground">Full access logging enabled</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium">AI/ML Configuration</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Auto Data Ingestion</div>
                    <div className="text-xs text-muted-foreground">Automatic pipeline processing</div>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium mb-2">Active AI Models</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>GPT-4 (Document Analysis)</span>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Claude (Cost Estimation)</span>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Otter AI (Transcription)</span>
                      <Badge variant="outline" className="text-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Scoring Schedule</div>
                    <div className="text-xs text-muted-foreground">Daily at 2:00 AM</div>
                  </div>
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-orange-600" />
                  <h4 className="font-medium">Project Control</h4>
                </div>
                <Button size="sm" className="bg-[#FA4616] hover:bg-[#FA4616]/90">
                  <Plus className="h-3 w-3 mr-1" />
                  New Project
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Recent Projects</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <div className="text-sm font-medium">Highway 35 Expansion</div>
                      <div className="text-xs text-muted-foreground">Owner: Sarah Johnson</div>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <div className="text-sm font-medium">Downtown Office Complex</div>
                      <div className="text-xs text-muted-foreground">Owner: Mike Wilson</div>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      In Setup
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <div className="text-sm font-medium">Retail Center Phase 2</div>
                      <div className="text-xs text-muted-foreground">Owner: Lisa Chen</div>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      Planning
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium">System Configuration</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">App Version</span>
                  <Badge variant="outline">v2.1.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Build Environment</span>
                  <Badge variant="outline">Production</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vercel Deployment</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="text-green-600">
                      Live
                    </Badge>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium mb-2">Environment Variables</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>DATABASE_URL</span>
                      <span className="text-muted-foreground">postgresql://***</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NEXTAUTH_URL</span>
                      <span className="text-muted-foreground">https://hb-report-demo.vercel.app</span>
                    </div>
                    <div className="flex justify-between">
                      <span>OPENAI_API_KEY</span>
                      <span className="text-muted-foreground">sk-***</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CardShell>
  )
}
