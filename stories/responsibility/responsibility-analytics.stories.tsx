import type { Meta, StoryObj } from "@storybook/react"
import { ResponsibilityAnalytics } from "@/components/responsibility/ResponsibilityAnalytics"
import { mockRoles, mockResponsibilityTasks } from "./mock-data"

const meta: Meta<typeof ResponsibilityAnalytics> = {
  title: "Responsibility/ResponsibilityAnalytics",
  component: ResponsibilityAnalytics,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The ResponsibilityAnalytics component provides comprehensive metrics and visualizations
for responsibility matrix data, including workload distribution, completion rates,
and actionable insights.

## Features
- Key performance metrics cards
- Role workload distribution charts
- Task category breakdown
- Assignment trends over time
- Action items for critical issues
- Interactive drill-down capabilities

## Metrics Displayed
- Total tasks and unassigned tasks
- Completion rates and overloaded roles
- Category distribution and trends
- Role workload balance analysis

## Usage
Displayed at the top of the ResponsibilityMatrixPage to provide overview
insights before users interact with detailed task matrices.
        `,
      },
    },
  },
  argTypes: {
    roles: {
      description: "Array of project roles for workload analysis",
    },
    tasks: {
      description: "Tasks array for detailed analysis",
    },
    categories: {
      description: "Array of task categories for filtering",
    },
    onDrillDown: {
      description: "Callback for drilling down into specific metrics",
    },
  },
}

export default meta
type Story = StoryObj<typeof ResponsibilityAnalytics>

export const HealthyProject: Story = {
  args: {
    roles: mockRoles,
    tasks: mockResponsibilityTasks,
    categories: [
      {
        key: "contract",
        name: "Contract Management",
        description: "Contract related tasks",
        color: "#3B82F6",
        enabled: true,
      },
      {
        key: "quality",
        name: "Quality Control",
        description: "Quality control tasks",
        color: "#10B981",
        enabled: true,
      },
      {
        key: "safety",
        name: "Safety Management",
        description: "Safety related tasks",
        color: "#F59E0B",
        enabled: true,
      },
    ],
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics for a healthy project with good completion rates and balanced workload.",
      },
    },
  },
}

export const ProjectWithIssues: Story = {
  args: {
    roles: mockRoles,
    tasks: mockResponsibilityTasks,
    categories: [
      {
        key: "contract",
        name: "Contract Management",
        description: "Contract related tasks",
        color: "#3B82F6",
        enabled: true,
      },
      {
        key: "quality",
        name: "Quality Control",
        description: "Quality control tasks",
        color: "#10B981",
        enabled: true,
      },
      {
        key: "safety",
        name: "Safety Management",
        description: "Safety related tasks",
        color: "#F59E0B",
        enabled: true,
      },
    ],
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics showing project issues: unassigned tasks, low completion rate, and overloaded roles.",
      },
    },
  },
}

export const NewProject: Story = {
  args: {
    roles: mockRoles,
    tasks: mockResponsibilityTasks.slice(0, 5),
    categories: [
      {
        key: "contract",
        name: "Contract Management",
        description: "Contract related tasks",
        color: "#3B82F6",
        enabled: true,
      },
      {
        key: "quality",
        name: "Quality Control",
        description: "Quality control tasks",
        color: "#10B981",
        enabled: true,
      },
      {
        key: "safety",
        name: "Safety Management",
        description: "Safety related tasks",
        color: "#F59E0B",
        enabled: true,
      },
    ],
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics for a new project just getting started with minimal task assignments.",
      },
    },
  },
}

export const CompletedProject: Story = {
  args: {
    roles: mockRoles,
    tasks: mockResponsibilityTasks.map((task) => ({ ...task, status: "completed" as const })),
    categories: [
      {
        key: "contract",
        name: "Contract Management",
        description: "Contract related tasks",
        color: "#3B82F6",
        enabled: true,
      },
      {
        key: "quality",
        name: "Quality Control",
        description: "Quality control tasks",
        color: "#10B981",
        enabled: true,
      },
      {
        key: "safety",
        name: "Safety Management",
        description: "Safety related tasks",
        color: "#F59E0B",
        enabled: true,
      },
    ],
    onDrillDown: (filterType, filterValue) => console.log(`Drill down: ${filterType} = ${filterValue}`),
  },
  parameters: {
    docs: {
      description: {
        story: "Analytics for a completed project with 100% completion rate.",
      },
    },
  },
}
