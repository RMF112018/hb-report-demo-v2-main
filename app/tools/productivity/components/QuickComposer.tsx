"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  MessageSquare, 
  CheckSquare,
  X,
  Link,
  Users,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { useProductivityStore } from '../store/useProductivityStore'
import { LinkedEntity, Task, User } from '@/types/productivity'
import { cn } from '@/lib/utils'

interface QuickComposerProps {
  className?: string
}

export const QuickComposer = ({ className }: QuickComposerProps) => {
  const { users, addTask } = useProductivityStore()
  const [showDialog, setShowDialog] = useState(false)
  
  // Convert users object to array for mapping
  const usersArray = Object.values(users || {})
  const [composerType, setComposerType] = useState<'message' | 'task'>('message')

  // Message thread state
  const [messageTitle, setMessageTitle] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  // Task state
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium')

  // Shared state
  const [linkedEntity, setLinkedEntity] = useState<LinkedEntity | null>(null)
  const [showEntityPicker, setShowEntityPicker] = useState(false)

  const getUserById = (userId: string): User | undefined => {
    return users[userId]
  }

  const getUserInitials = (userId: string): string => {
    const user = getUserById(userId)
    if (!user) return userId.slice(0, 2).toUpperCase()
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const mockEntityOptions: LinkedEntity[] = [
    { type: 'daily-log', id: 'field-log:2025-06-14', label: 'Field Log – June 14, 2025' },
    { type: 'forecast', id: 'draw-forecast:2525844', label: 'Draw Forecast – Project Falcon' },
    { type: 'procurement', id: 'po:VDR-305', label: 'Vendor PO Review – Bid Package 305' },
    { type: 'schedule', id: 'lookahead:week25', label: 'Schedule Lookahead – Week 25' },
    { type: 'inspection', id: 'safety:site-01', label: 'Safety Inspection – Site 01' },
    { type: 'constraint', id: 'constraint:weather-delay', label: 'Weather Delay Constraint' },
    { type: 'permit', id: 'permit:electrical-rough', label: 'Electrical Rough-in Permit' },
    { type: 'financial', id: 'budget:monthly-review', label: 'Monthly Budget Review' },
    { type: 'report', id: 'report:weekly-progress', label: 'Weekly Progress Report' }
  ]

  const getEntityTypeDisplayName = (type: string) => {
    const displayNames: { [key: string]: string } = {
      'daily-log': 'Daily Log',
      'forecast': 'Forecast',
      'procurement': 'Procurement',
      'schedule': 'Schedule',
      'inspection': 'Inspection',
      'constraint': 'Constraint',
      'permit': 'Permit',
      'financial': 'Financial',
      'report': 'Report'
    }
    return displayNames[type] || type
  }

  const getEntityTypeColor = (type: string) => {
    const typeColors = {
      'daily-log': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'forecast': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'procurement': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'schedule': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'inspection': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'constraint': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'permit': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'financial': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'report': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
    return typeColors[type] || typeColors['report']
  }

  const resetForm = () => {
    setMessageTitle('')
    setMessageContent('')
    setSelectedParticipants([])
    setTaskTitle('')
    setTaskDescription('')
    setTaskAssignee('')
    setTaskDueDate('')
    setTaskPriority('medium')
    setLinkedEntity(null)
  }

  const handleOpenDialog = (type: 'message' | 'task') => {
    setComposerType(type)
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    resetForm()
  }

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleCreateMessage = () => {
    if (!messageTitle.trim()) return

    // TODO: Implement message thread creation
    // const threadData = {
    //   title: messageTitle,
    //   participants: selectedParticipants.length > 0 ? selectedParticipants : ['current-user'],
    //   linkedTo: linkedEntity || undefined
    // }

    console.log('Create message thread:', messageTitle, selectedParticipants, linkedEntity)
    
    handleCloseDialog()
  }

  const handleCreateTask = () => {
    if (!taskTitle.trim() || !taskAssignee || !taskDueDate) return

    const taskData = {
      title: taskTitle,
      description: taskDescription || undefined,
      status: 'todo' as const,
      priority: taskPriority,
      createdBy: 'current-user',
      assignedTo: taskAssignee,
      dueDate: new Date(taskDueDate),
      linkedTo: linkedEntity || undefined
    }

    addTask(taskData)
    handleCloseDialog()
  }

  const canCreateMessage = messageTitle.trim().length > 0
  const canCreateTask = taskTitle.trim().length > 0 && taskAssignee && taskDueDate

  return (
    <>
      {/* Floating Action Button */}
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => handleOpenDialog('task')}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <Button
            size="sm"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => handleOpenDialog('message')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Composer Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {composerType === 'message' ? (
                <>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  New Message Thread
                </>
              ) : (
                <>
                  <CheckSquare className="w-5 h-5 mr-2" />
                  New Task
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Linked Entity */}
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Link className="w-4 h-4 mr-2" />
                  Link to Feature (Optional)
                </Label>
                {linkedEntity ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Badge variant="outline" className={getEntityTypeColor(linkedEntity.type)}>
                      {getEntityTypeDisplayName(linkedEntity.type)}
                    </Badge>
                    <span className="text-sm flex-1 mx-3">{linkedEntity.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLinkedEntity(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowEntityPicker(true)}
                    className="w-full justify-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Link to a feature
                  </Button>
                )}
              </div>

              {composerType === 'message' ? (
                // Message Thread Form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="message-title">Thread Title *</Label>
                    <Input
                      id="message-title"
                      value={messageTitle}
                      onChange={(e) => setMessageTitle(e.target.value)}
                      placeholder="What's this conversation about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Participants
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {usersArray.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedParticipants.includes(user.id)}
                            onCheckedChange={() => toggleParticipant(user.id)}
                          />
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(user.id)}
                            </AvatarFallback>
                          </Avatar>
                          <label 
                            htmlFor={`user-${user.id}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {user.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message-content">Initial Message (Optional)</Label>
                    <Textarea
                      id="message-content"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Start the conversation..."
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              ) : (
                // Task Form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title *</Label>
                    <Input
                      id="task-title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="What needs to be done?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description (Optional)</Label>
                    <Textarea
                      id="task-description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Add more details about this task..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Assign To *
                      </Label>
                      <Select value={taskAssignee} onValueChange={setTaskAssignee}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {usersArray.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-xs">
                                    {getUserInitials(user.id)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due Date *
                      </Label>
                      <Input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Priority
                    </Label>
                    <Select value={taskPriority} onValueChange={(value: Task['priority']) => setTaskPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={composerType === 'message' ? handleCreateMessage : handleCreateTask}
              disabled={composerType === 'message' ? !canCreateMessage : !canCreateTask}
            >
              Create {composerType === 'message' ? 'Thread' : 'Task'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Entity Picker Dialog */}
      <Dialog open={showEntityPicker} onOpenChange={setShowEntityPicker}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Link to Feature</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {mockEntityOptions.map((entity) => (
                <Button
                  key={entity.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => {
                    setLinkedEntity(entity)
                    setShowEntityPicker(false)
                  }}
                >
                  <div className="flex flex-col items-start space-y-1">
                    <Badge variant="outline" className={getEntityTypeColor(entity.type)}>
                      {getEntityTypeDisplayName(entity.type)}
                    </Badge>
                    <span className="text-sm">{entity.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
} 