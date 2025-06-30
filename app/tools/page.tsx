'use client'

import { StandardPageLayout } from '@/components/layout/StandardPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  CheckSquare, 
  Users, 
  Activity,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const tools = [
    {
      id: 'productivity',
      title: 'Productivity Suite',
      description: 'Manage messages, tasks, and team collaboration',
      icon: MessageSquare,
      href: '/tools/productivity',
      status: 'active',
      features: ['Threaded Messaging', 'Task Management', 'Team Collaboration', 'Real-time Updates']
    },
    // Add more tools here in the future
  ]

  const breadcrumbItems = [
    { label: 'Tools', href: '/tools' }
  ]

  return (
    <StandardPageLayout
      title="Tools"
      description="Collection of productivity and management tools"
      breadcrumbs={breadcrumbItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge 
                        variant={tool.status === 'active' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {tool.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckSquare className="w-3 h-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={tool.href}>
                  <Button className="w-full">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Resource Planner</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced resource allocation and workforce planning tools.</p>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Activity className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive project analytics and performance metrics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StandardPageLayout>
  )
} 