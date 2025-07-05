export interface LinkedEntity {
  type:
    | "daily-log"
    | "forecast"
    | "procurement"
    | "safety"
    | "quality"
    | "rfi"
    | "change-order"
    | "schedule"
    | "budget"
    | "contract"
    | "permit"
    | "startup-checklist"
    | "closeout-checklist"
    | "other"
  id: string
  label: string
  url?: string
}

export interface Reaction {
  id: string
  emoji: string
  userId: string
  timestamp: Date
}

export interface Message {
  id: string
  threadId: string
  parentId?: string
  sender: string
  content: string
  timestamp: Date
  reactions: Reaction[]
}

export interface MessageThread {
  id: string
  title: string
  participants: string[]
  messages: Message[]
  createdAt: string
  lastActivity: Date
  linkedTo?: LinkedEntity
}

export interface TaskComment {
  id: string
  content: string
  author: string
  timestamp: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "blocked" | "completed"
  priority: "low" | "medium" | "high"
  createdBy: string
  assignedTo: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  linkedTo?: LinkedEntity
  comments: TaskComment[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  status: "online" | "away" | "offline"
}

export interface ProductivityState {
  messageThreads: MessageThread[]
  tasks: Task[]
  users: Record<string, User>
}

export interface ProductivityActions {
  // Message actions
  addMessage: (threadId: string, messageData: Omit<Message, "id" | "timestamp">) => void
  addReaction: (messageId: string, reaction: Omit<Reaction, "id">) => void
  removeReaction: (messageId: string, userId: string, emoji: string) => void

  // Task actions
  addTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTaskStatus: (taskId: string, status: Task["status"], comment?: string) => void
  addTaskComment: (taskId: string, commentData: Omit<TaskComment, "id" | "timestamp">) => void

  // Search and filter functions
  searchThreads: (query: string) => MessageThread[]
  filterTasks: (filters: { assignedTo?: string; status?: Task["status"]; linkedType?: string }) => Task[]
}
