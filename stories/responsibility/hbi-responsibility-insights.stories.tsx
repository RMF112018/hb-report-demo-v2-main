import type { Meta, StoryObj } from "@storybook/react"
import { HbiResponsibilityInsights } from "@/components/responsibility/HbiResponsibilityInsights"
import { mockRoles, mockResponsibilityTasks } from "./mock-data"

const meta: Meta<typeof HbiResponsibilityInsights> = {
  title: "Responsibility/HbiResponsibilityInsights",
  component: HbiResponsibilityInsights,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The HbiResponsibilityInsights component provides AI-powered analysis and
recommendations for responsibility matrix optimization, identifying risks,
opportunities, and actionable improvements.

## AI-Powered Features
- Risk detection for unassigned tasks and overloaded roles
- Opportunity identification for workload optimization
- Compliance analysis for AIA standards
- Performance recommendations based on completion rates
- Workload distribution analysis

## Insight Types
- **Risk**: Critical issues requiring immediate attention
- **Alert**: Important warnings about project health
- **Recommendation**: Suggestions for improvement
- **Opportunity**: Areas for optimization
- **Success**: Recognition of good performance

## Confidence Scoring
Each insight includes an AI confidence score (0-100%) indicating
the reliability of the analysis and recommendations.

## Usage
Displayed prominently in the ResponsibilityMatrixPage to provide
proactive guidance and early warning of potential issues.
        `,
      },
    },
  },
  argTypes: {
    tasks: {
      description: "Array of responsibility tasks for analysis",
    },
    roles: {
      description: "Array of project roles",
    },
    maxInsights: {
      description: "Maximum number of insights to display",
    },
    onInsightAction: {
      description: "Callback for insight action handling",
    },
  },
}

export default meta
type Story = StoryObj<typeof HbiResponsibilityInsights>

export const HealthyProject: Story = {
  args: {
    tasks: mockResponsibilityTasks.map((task) => ({ ...task, status: "completed" as const })),
    roles: mockRoles,
    maxInsights: 6,
    onInsightAction: (insight) => console.log("Insight action:", insight),
  },
  parameters: {
    docs: {
      description: {
        story: "Insights for a healthy project with excellent performance metrics.",
      },
    },
  },
}

export const ProjectWithRisks: Story = {
  args: {
    tasks: mockResponsibilityTasks,
    roles: mockRoles,
    maxInsights: 6,
    onInsightAction: (insight) => console.log("Insight action:", insight),
  },
  parameters: {
    docs: {
      description: {
        story: "Insights showing multiple risks: unassigned tasks, low completion rate, and overloaded roles.",
      },
    },
  },
}

export const NewProjectSetup: Story = {
  args: {
    tasks: mockResponsibilityTasks.slice(0, 8),
    roles: mockRoles,
    maxInsights: 6,
    onInsightAction: (insight) => console.log("Insight action:", insight),
  },
  parameters: {
    docs: {
      description: {
        story: "Insights for a new project in setup phase with recommendations for task assignment.",
      },
    },
  },
}

export const NoInsights: Story = {
  args: {
    tasks: mockResponsibilityTasks.map((task) => ({
      ...task,
      status: "completed" as const,
      responsible: task.responsible || "PM1",
    })),
    roles: mockRoles,
    maxInsights: 6,
    onInsightAction: (insight) => console.log("Insight action:", insight),
  },
  parameters: {
    docs: {
      description: {
        story: "Perfect project state with no insights needed - shows success message.",
      },
    },
  },
}
