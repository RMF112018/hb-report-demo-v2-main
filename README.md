# HB Report Demo v3.0

## Overview

Enterprise-grade construction project management platform with comprehensive Microsoft Teams integration.

## Microsoft Teams Productivity Integration

### Overview

The HB Report Demo v3.0 includes comprehensive Microsoft Teams integration aligned with the Microsoft Graph Planner API, providing enterprise-grade productivity features for Microsoft 365 customers.

### Key Features

#### Microsoft Planner Integration

- **Plans as Containers**: Plans are contained within Microsoft 365 groups following the official API structure
- **Task Management**: Full CRUD operations for tasks with proper assignments and metadata
- **Board Visualization**: Support for assignee boards, progress boards, and custom bucket boards
- **Task Details**: Rich task descriptions, checklists, and external references
- **Order Hints**: Proper task ordering and positioning as per Microsoft's specification

#### Microsoft Teams Integration

- **Team Operations**: Get teams, team members, and team channels
- **Real-time Messaging**: Send and receive messages through Teams channels
- **Channel Management**: Full channel operations within teams
- **Chat Integration**: Direct messaging and group chat support

#### Calendar Integration

- **Event Management**: Create and manage calendar events
- **Online Meetings**: Automatic Teams meeting creation
- **Attendee Management**: Add attendees and track responses
- **Project Scheduling**: Integrate project milestones with calendar

### Technical Implementation

#### Core Architecture

```typescript
// Microsoft Graph Service
class MicrosoftGraphService {
  // Teams Operations
  async getMyTeams(): Promise<Team[]>
  async getTeamMembers(teamId: string): Promise<TeamMember[]>
  async getTeamChannels(teamId: string): Promise<Channel[]>
  async getChannelMessages(teamId: string, channelId: string): Promise<ChatMessage[]>
  async sendChannelMessage(teamId: string, channelId: string, content: string): Promise<ChatMessage>

  // Planner Operations (aligned with Microsoft API)
  async getPlannerPlans(groupId: string): Promise<PlannerPlan[]>
  async getPlannerTasks(planId: string): Promise<PlannerTask[]>
  async createPlannerTask(
    planId: string,
    title: string,
    bucketId?: string,
    assigneeIds?: string[]
  ): Promise<PlannerTask>
  async updatePlannerTaskProgress(taskId: string, percentComplete: number, etag: string): Promise<PlannerTask>

  // Calendar Operations
  async getCalendarEvents(startDateTime?: string, endDateTime?: string): Promise<CalendarEvent[]>
  async createCalendarEvent(
    subject: string,
    start: string,
    end: string,
    attendeeEmails: string[]
  ): Promise<CalendarEvent>
}
```

#### Microsoft Planner API Alignment

The implementation follows the official Microsoft Planner API structure:

1. **Plans are containers** - Plans are contained within Microsoft 365 groups
2. **Tasks with assignments** - Tasks have proper assignment objects with orderHint
3. **Task details** - Extended task properties for rich content
4. **Buckets for visualization** - Custom columns for board views
5. **Proper order hints** - Task ordering following Microsoft's specification

#### React Hooks Integration

```typescript
// Individual hooks
const { teams, loading, error } = useTeams()
const { members } = useTeamMembers(teamId)
const { channels } = useTeamChannels(teamId)
const { messages, sendMessage } = useChannelMessages(teamId, channelId)
const { plans } = usePlannerPlans(groupId)
const { tasks, createTask, updateTaskProgress } = usePlannerTasks(planId)
const { events, createEvent } = useCalendarEvents()

// Composite hooks
const { currentTeam, members, channels, plans, chats, events } = useTeamsProductivity(teamId)
const { currentChannel, messages, sendMessage } = useTeamsChannel(teamId, channelId)
```

### Component Integration

#### Core Project Tools > Productivity Tab

The Microsoft Teams integration is injected into the Core Project Tools > Productivity tab, replacing the legacy productivity system:

```typescript
// ProjectControlCenterContent.tsx Core > Productivity Tab
<ProjectTabsShell
  projectId={projectId}
  user={user}
  userRole={userRole}
  projectData={projectData}
  onTabChange={onTabChange}
/>
```

#### Teams Productivity Content

The `TeamsProductivityContent` component provides:

- **4-tab interface**: Messages, Tasks, Calendar, Team
- **Real Teams messaging**: Send and receive messages through Teams channels
- **Microsoft Planner tasks**: Create, assign, and track tasks
- **Calendar integration**: Schedule events and meetings
- **Team management**: View and manage team members

#### Legacy Compatibility

The system maintains backward compatibility with the legacy productivity system:

- **Mode toggle**: Switch between Teams mode and legacy mode
- **Deprecation warnings**: Clear indication of legacy system status
- **Upgrade prompts**: Encourage migration to Teams integration

### Enterprise Features

#### Microsoft 365 Integration

- **Single Sign-On**: Seamless authentication with Microsoft 365
- **Graph API**: Full Microsoft Graph API integration
- **Enterprise Security**: Follows Microsoft security best practices
- **Compliance**: Meets enterprise compliance requirements

#### Production-Ready Features

- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Loading States**: Professional loading indicators
- **Performance**: Optimized for enterprise-scale usage
- **Responsive Design**: Works across all device sizes
- **Dark Mode**: Full dark mode support

### Usage

#### Accessing Teams Integration

1. Navigate to Project > Core Project Tools > Productivity
2. Ensure Teams mode is enabled (default)
3. Connect to Microsoft 365 (automatic with SSO)
4. Select your project team and channel
5. Start collaborating with real Teams messaging and Planner tasks

#### Task Management with Microsoft Planner

1. Tasks are organized within Microsoft Planner plans
2. Plans are contained within Microsoft 365 groups (project teams)
3. Tasks can be assigned to team members with proper orderHint
4. Board views support assignee, progress, and custom bucket visualization
5. Task details include descriptions, checklists, and external references

#### Messaging with Teams Channels

1. Messages are sent through actual Microsoft Teams channels
2. Real-time messaging with team members
3. Support for message priorities and mentions
4. Integration with Teams mobile and desktop apps

### Development

#### Environment Setup

```bash
# Install dependencies
npm install

# Configure Microsoft Graph permissions
# Required scopes: Teams.ReadWrite.All, Group.ReadWrite.All, Calendars.ReadWrite, Tasks.ReadWrite
```

#### API Configuration

```typescript
// Microsoft Graph Service Configuration
const microsoftGraphService = MicrosoftGraphService.getInstance()
microsoftGraphService.setAccessToken(accessToken)
```

### Security & Compliance

#### Microsoft Graph Permissions

- **Teams.ReadWrite.All**: Full Teams integration
- **Group.ReadWrite.All**: Microsoft 365 group operations
- **Calendars.ReadWrite**: Calendar and meeting management
- **Tasks.ReadWrite**: Microsoft Planner task operations

#### Data Security

- All data remains within Microsoft 365 tenant
- No data stored outside Microsoft ecosystem
- Enterprise-grade security and compliance
- Audit trail through Microsoft 365 logging

### Support

For Microsoft Teams integration support:

1. Ensure Microsoft 365 subscription includes Teams and Planner
2. Verify Graph API permissions are configured
3. Check enterprise SSO configuration
4. Contact Microsoft support for Graph API issues

---

## Additional Features

### Field Management

- Scheduler with weather integration
- Field reports and daily logs
- Constraints management
- Permit log tracking

### Financial Hub

- Budget analysis and forecasting
- AR aging and cash flow
- Change order management
- Pay application processing

### Pre-Construction Suite

- Estimating with BidManagement integration
- BIM coordination and clash detection
- Permit and regulatory compliance

### Core Project Tools

- Interactive dashboards
- Checklist management
- Responsibility matrix
- Comprehensive reporting

### Compliance & Trade Partners

- Contract document management
- Trade partner scorecards
- Compass API integration
- Certification tracking

### Warranty Management

- Claim processing workflows
- Document repository
- Manufacturer integration
- Labor warranty tracking

---

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React hooks, Context API
- **Microsoft Integration**: Microsoft Graph API, Teams SDK
- **Charts**: Recharts, Chart.js
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Microsoft Graph API credentials
4. Set up environment variables
5. Run development server: `npm run dev`

## License

Enterprise license - Contact HB Development Team for licensing information.
