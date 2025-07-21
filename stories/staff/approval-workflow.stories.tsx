import type { Meta, StoryObj } from "@storybook/react"
import { ApprovalWorkflow } from "../../components/staff/ApprovalWorkflow"
import { AuthProvider } from "../../lib/auth-context"

// Mock data
import mockSpcrs from "../../data/mock-spcrs.json"

const meta: Meta<typeof ApprovalWorkflow> = {
  title: "Staff Planning/ApprovalWorkflow",
  component: ApprovalWorkflow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Approval Workflow Component

A comprehensive workflow interface for reviewing and approving/rejecting SPCRs with detailed context and approval history.

## Features

- **Detailed Review**: Complete SPCR information with project context
- **Approval History**: Track of all approval actions and comments
- **Bulk Operations**: Approve or reject multiple SPCRs at once
- **Comment System**: Required comments for all approval decisions
- **Role-based Access**: Only authorized users can approve/reject

## Workflow States

- **Single SPCR**: Review individual requests
- **Bulk Mode**: Process multiple requests simultaneously
- **History View**: Track approval progression
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div className="p-6 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ApprovalWorkflow>

const mockActions = {
  onApprove: (spcrId: string, comment: string) => {
    console.log(`Approved SPCR ${spcrId} with comment: ${comment}`)
    alert(`SPCR ${spcrId} approved!`)
  },
  onReject: (spcrId: string, comment: string) => {
    console.log(`Rejected SPCR ${spcrId} with comment: ${comment}`)
    alert(`SPCR ${spcrId} rejected!`)
  },
  onClose: () => {
    console.log("Approval workflow closed")
  },
}

export const PendingSPCR: Story = {
  args: {
    spcr: mockSpcrs.spcrs.find((spcr) => spcr.status === "submitted") || mockSpcrs.spcrs[0]!,
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Single SPCR pending approval with full workflow interface.",
      },
    },
  },
}

export const StaffIncrease: Story = {
  args: {
    spcr: mockSpcrs.spcrs.find((spcr) => spcr.type === "increase" && spcr.status === "submitted") || {
      id: "SPCR-001",
      projectId: "401001",
      projectName: "Hospital Expansion Project",
      type: "increase",
      status: "submitted",
      requestedBy: "Sarah Johnson",
      requestedDate: "2024-01-15",
      position: "Project Manager II",
      budget: 85000,
      justification: "Additional PM support needed for complex MEP coordination",
      urgency: "high",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Approval workflow for a staff increase request.",
      },
    },
  },
}

export const StaffDecrease: Story = {
  args: {
    spcr: mockSpcrs.spcrs.find((spcr) => spcr.type === "decrease") || {
      id: "SPCR-002",
      projectId: "401002",
      projectName: "Office Building Renovation",
      type: "decrease",
      status: "submitted",
      requestedBy: "Mike Chen",
      requestedDate: "2024-01-10",
      position: "Assistant Superintendent",
      budget: -45000,
      justification: "Project scope reduced, can manage with existing team",
      urgency: "medium",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Approval workflow for a staff decrease request.",
      },
    },
  },
}

export const AlreadyApproved: Story = {
  args: {
    spcr: {
      id: "SPCR-003",
      projectId: "401003",
      projectName: "Shopping Center Development",
      type: "increase",
      status: "approved",
      requestedBy: "David Wilson",
      requestedDate: "2024-01-20",
      position: "Site Superintendent",
      budget: 75000,
      justification: "Additional site supervision required for complex foundation work",
      urgency: "medium",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Workflow view for an already approved SPCR (read-only mode).",
      },
    },
  },
}

export const RejectedSPCR: Story = {
  args: {
    spcr: {
      id: "SPCR-004",
      projectId: "401004",
      projectName: "Residential Complex",
      type: "increase",
      status: "rejected",
      requestedBy: "Lisa Brown",
      requestedDate: "2024-01-25",
      position: "Quality Control Manager",
      budget: 65000,
      justification: "Additional QC support for final inspection phase",
      urgency: "low",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Workflow view for a rejected SPCR showing rejection status.",
      },
    },
  },
}

export const BulkApproval: Story = {
  args: {
    spcr: {
      id: "SPCR-006",
      projectId: "401006",
      projectName: "Multi-Building Complex",
      type: "increase",
      status: "submitted",
      requestedBy: "Jennifer Davis",
      requestedDate: "2024-02-01",
      position: "Project Coordinator",
      budget: 95000,
      justification: "Multiple concurrent projects require additional coordination support",
      urgency: "medium",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Bulk approval workflow for processing multiple SPCRs simultaneously.",
      },
    },
  },
}

export const HighBudgetImpact: Story = {
  args: {
    spcr: {
      id: "SPCR-005",
      projectId: "401005",
      projectName: "High-Rise Office Tower",
      type: "increase",
      status: "submitted",
      requestedBy: "Robert Martinez",
      requestedDate: "2024-01-30",
      position: "General Superintendent",
      budget: 150000,
      justification:
        "Critical project phase requires experienced general superintendent to ensure quality and schedule compliance. High-value project with significant risk exposure.",
      urgency: "high",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Approval workflow for high-budget impact SPCR requiring careful review.",
      },
    },
  },
}

export const UrgentRequest: Story = {
  args: {
    spcr: {
      id: "SPCR-007",
      projectId: "401007",
      projectName: "Industrial Facility",
      type: "increase",
      status: "submitted",
      requestedBy: "Michael Thompson",
      requestedDate: "2024-02-05",
      position: "Safety Manager",
      budget: 120000,
      justification:
        "URGENT: Safety incident requires immediate additional safety oversight. Critical for project continuation and regulatory compliance.",
      urgency: "high",
    },
    ...mockActions,
  },
  parameters: {
    docs: {
      description: {
        story: "Urgent SPCR requiring immediate attention and fast-track approval.",
      },
    },
  },
}
