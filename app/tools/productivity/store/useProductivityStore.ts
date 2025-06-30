"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  ProductivityState, 
  ProductivityActions,
  MessageThread,
  Message,
  Task,
  TaskComment,
  User,
  Reaction
} from '@/types/productivity'

// Import mock data
import messagesData from '@/data/mock/productivity/messages.json'
import tasksData from '@/data/mock/productivity/tasks.json'
import staffingData from '@/data/mock/staffing/staffing.json'

// Helper function to create user mapping from staffing data
const createUserMapping = (): Record<string, User> => {
  const users: Record<string, User> = {}
  
  // Add system user for HBI
  users['hbi-system'] = {
    id: 'hbi-system',
    name: 'HBI System',
    email: 'system@hbi.com',
    avatar: '🤖',
    role: 'system',
    status: 'online'
  }
  
  // Add current user
  users['current-user'] = {
    id: 'current-user',
    name: 'Current User',
    email: 'user@company.com',
    avatar: '👤',
    role: 'project-manager',
    status: 'online'
  }
  
  // Add users from staffing data
  if (staffingData?.staff) {
    staffingData.staff.forEach((member: any) => {
      users[member.id] = {
        id: member.id,
        name: member.name,
        email: member.email || `${member.name.toLowerCase().replace(' ', '.')}@company.com`,
        avatar: member.avatar || '👤',
        role: member.role || 'team-member',
        status: 'online'
      }
    })
  }
  
  return users
}

// Helper function to initialize data
const initializeData = () => {
  const users = createUserMapping()
  
  // Process message threads (messagesData is an array, not an object with messageThreads property)
  const messageThreads: MessageThread[] = (messagesData as any[]).map((thread: any) => ({
    ...thread,
    lastActivity: new Date(thread.updatedAt || thread.createdAt),
    messages: thread.messages.map((message: any) => ({
      ...message,
      timestamp: new Date(message.createdAt),
      reactions: (message.reactions || []).map((reaction: any) => ({
        ...reaction,
        timestamp: new Date(reaction.timestamp || Date.now())
      }))
    }))
  }))
  
  // Process tasks (tasksData is an array, not an object with tasks property)
  const tasks: Task[] = (tasksData as any[]).map((task: any) => ({
    ...task,
    status: task.status === 'done' ? 'completed' : task.status,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    comments: (task.comments || []).map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      author: comment.sender || comment.author,
      timestamp: new Date(comment.createdAt)
    }))
  }))
  
  return { users, messageThreads, tasks }
}

export const useProductivityStore = create<ProductivityState & ProductivityActions>()(
  persist(
    (set, get) => {
      const initialData = initializeData()
      
      return {
        ...initialData,
        
        // Message actions
        addMessage: (threadId: string, messageData: Omit<Message, 'id' | 'timestamp'>) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            ...messageData,
            timestamp: new Date(),
            reactions: []
          }
          
          set((state: ProductivityState) => ({
            messageThreads: state.messageThreads.map((thread: MessageThread) =>
              thread.id === threadId
                ? {
                    ...thread,
                    messages: [...thread.messages, newMessage],
                    lastActivity: new Date()
                  }
                : thread
            )
          }))
        },

        addReaction: (messageId: string, reaction: Omit<Reaction, 'id'>) => {
          set((state: ProductivityState) => ({
            messageThreads: state.messageThreads.map((thread: MessageThread) => ({
              ...thread,
              messages: thread.messages.map((message: Message) =>
                message.id === messageId
                  ? {
                      ...message,
                      reactions: [
                        ...message.reactions.filter(
                          (r: Reaction) => !(r.userId === reaction.userId && r.emoji === reaction.emoji)
                        ),
                        {
                          id: Date.now().toString(),
                          ...reaction,
                          timestamp: new Date()
                        }
                      ]
                    }
                  : message
              )
            }))
          }))
        },

        removeReaction: (messageId: string, userId: string, emoji: string) => {
          set((state: ProductivityState) => ({
            messageThreads: state.messageThreads.map((thread: MessageThread) => ({
              ...thread,
              messages: thread.messages.map((message: Message) =>
                message.id === messageId
                  ? {
                      ...message,
                      reactions: message.reactions.filter(
                        (r: Reaction) => !(r.userId === userId && r.emoji === emoji)
                      )
                    }
                  : message
              )
            }))
          }))
        },

        // Task actions
        addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
          const newTask: Task = {
            id: Date.now().toString(),
            ...taskData,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: []
          }
          
          set((state: ProductivityState) => ({
            tasks: [...state.tasks, newTask]
          }))
        },

        updateTaskStatus: (taskId: string, status: Task['status'], comment?: string) => {
          set((state: ProductivityState) => ({
            tasks: state.tasks.map((task: Task) => {
              if (task.id === taskId) {
                const updatedTask = {
                  ...task,
                  status,
                  updatedAt: new Date()
                }
                
                if (status === 'completed') {
                  updatedTask.completedAt = new Date()
                }
                
                if (comment) {
                  const newComment: TaskComment = {
                    id: Date.now().toString(),
                    content: comment,
                    author: 'current-user',
                    timestamp: new Date()
                  }
                  updatedTask.comments = [...task.comments, newComment]
                }
                
                return updatedTask
              }
              return task
            })
          }))
        },

        addTaskComment: (taskId: string, commentData: Omit<TaskComment, 'id' | 'timestamp'>) => {
          const newComment: TaskComment = {
            id: Date.now().toString(),
            ...commentData,
            timestamp: new Date()
          }
          
          set((state: ProductivityState) => ({
            tasks: state.tasks.map((task: Task) =>
              task.id === taskId
                ? {
                    ...task,
                    comments: [...task.comments, newComment],
                    updatedAt: new Date()
                  }
                : task
            )
          }))
        },

        // Search and filter functions
        searchThreads: (query: string) => {
          const state = get()
          if (!query.trim()) return state.messageThreads
          
          const lowercaseQuery = query.toLowerCase()
          return state.messageThreads.filter(
            (thread: MessageThread) =>
              thread.title.toLowerCase().includes(lowercaseQuery) ||
              thread.messages.some((message: Message) =>
                message.content.toLowerCase().includes(lowercaseQuery)
              )
          )
        },

        filterTasks: (filters: { assignedTo?: string; status?: Task['status']; linkedType?: string }) => {
          const state = get()
          let filteredTasks = state.tasks
          
          if (filters.assignedTo) {
            filteredTasks = filteredTasks.filter(
              (task: Task) => task.assignedTo === filters.assignedTo
            )
          }
          
          if (filters.status) {
            filteredTasks = filteredTasks.filter(
              (task: Task) => task.status === filters.status
            )
          }
          
          if (filters.linkedType) {
            filteredTasks = filteredTasks.filter(
              (task: Task) => task.linkedTo?.type === filters.linkedType
            )
          }
          
          return filteredTasks
        }
      }
    },
    {
      name: 'productivity-storage',
      partialize: (state: ProductivityState) => ({
        messageThreads: state.messageThreads,
        tasks: state.tasks,
        users: state.users
      })
    }
  )
) 