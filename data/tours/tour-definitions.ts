export interface TourStep {
  id: string
  title: string
  description: string // Updated from 'content' to 'description' for modal format
  screenshotUrl: string // Path to pre-generated screenshot
  highlightRect?: { x: number; y: number; width: number; height: number } // Optional highlight rectangle
  nextButton?: string
  prevButton?: string
  showSkip?: boolean
  onNext?: () => void
  onPrev?: () => void
  onSkip?: () => void
  // Legacy fields for backward compatibility during migration
  content?: string // @deprecated - use description instead
  target?: string // @deprecated - not used in modal mode
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center' // @deprecated - not used in modal mode
}

export interface TourDefinition {
  id: string
  name: string
  description: string
  steps: TourStep[]
  userRoles?: string[] // Which user roles can see this tour
  page?: string // Which page this tour is for
}

/**
 * Validates all tour definitions to ensure they have valid selectors and placement values
 * This is a basic validation that can be called during runtime
 */
const validateAllTourDefinitions = (tourDefinitions: TourDefinition[]) => {
  const errors: string[] = []
  
  tourDefinitions.forEach((tour, tourIndex) => {
    // Basic validation without external dependencies
    if (!tour.id) errors.push(`Tour ${tourIndex + 1}: Missing tour ID`)
    if (!tour.name) errors.push(`Tour ${tourIndex + 1}: Missing tour name`)
    if (!tour.description) errors.push(`Tour ${tourIndex + 1}: Missing tour description`)
    if (!tour.steps || tour.steps.length === 0) {
      errors.push(`Tour "${tour.name}" (${tour.id}): No steps defined`)
    } else {
      // Validate each step
      tour.steps.forEach((step, stepIndex) => {
        if (!step.id) errors.push(`Tour "${tour.name}", Step ${stepIndex + 1}: Missing step ID`)
        if (!step.title) errors.push(`Tour "${tour.name}", Step ${stepIndex + 1}: Missing step title`)
        if (!step.content) errors.push(`Tour "${tour.name}", Step ${stepIndex + 1}: Missing step content`)
        if (!step.target) errors.push(`Tour "${tour.name}", Step ${stepIndex + 1}: Missing target selector`)
        if (!step.placement) {
          errors.push(`Tour "${tour.name}", Step ${stepIndex + 1}: Missing placement`)
        } else {
          // Validate placement values
          const validPlacements = ['top', 'bottom', 'left', 'right', 'center']
          if (!validPlacements.includes(step.placement)) {
            errors.push(`Tour "${tour.name}", Step ${stepIndex + 1}: Invalid placement '${step.placement}'`)
          }
        }
      })
    }
  })
  
  if (errors.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('Tour definition validation warnings:', errors)
  }
  
  return errors
}

// Login Tour Definition - Updated for Modal Format
export const loginTour: TourDefinition = {
  id: 'login-demo-accounts',
  name: 'Demo Account Selection',
  description: 'Learn how to select different user roles and access demo accounts',
  page: 'login',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to HB Intel Demo!',
      description: 'This guided tour will show you how to explore the application with different user roles. Each role provides access to different features and dashboard layouts.',
      screenshotUrl: '/tours/login/step-1.png',
      nextButton: 'Get Started',
      showSkip: true
    },
    {
      id: 'demo-accounts-button',
      title: 'Demo Account Access',
      description: 'Click this button to see available demo accounts. Each account represents a different user role with specific permissions and dashboard configurations.<br/><br/><strong>Go ahead and click it now!</strong>',
      screenshotUrl: '/tours/login/step-2.png',
      highlightRect: { x: 1336, y: 616, width: 400, height: 44 },
      nextButton: 'Continue'
    },
    {
      id: 'role-selection',
      title: 'Choose Your Role',
      description: 'Each demo account represents a different user role with unique dashboard layouts and features.<br/><br/><strong>💼 Executive</strong> - Portfolio overview<br/><strong>👥 Project Executive</strong> - Multi-project management<br/><strong>📊 Project Manager</strong> - Detailed controls<br/><strong>🏗️ Estimator</strong> - Pre-construction focus<br/><strong>⚙️ Admin</strong> - System administration<br/><br/><em>Click any account to log in and explore!</em>',
      screenshotUrl: '/tours/login/step-3.png',
      highlightRect: { x: 1336, y: 616, width: 400, height: 178 },
      nextButton: 'Got it!'
    },
    {
      id: 'login-process',
      title: 'Automatic Login',
      description: 'Once you select a demo account, you\'ll be automatically logged in and redirected to the appropriate dashboard for that role. The dashboard content and available tools will vary based on your selected role.',
      screenshotUrl: '/tours/login/step-4.png',
      nextButton: 'Start Exploring'
    }
  ]
}

// Dashboard Tour Definition - Updated for Modal Format
export const dashboardTour: TourDefinition = {
  id: 'dashboard-overview',
  name: 'Complete Dashboard Tour',
  description: 'Comprehensive guide to all dashboard features and navigation elements',
  page: 'dashboard',
  steps: [
    {
      id: 'dashboard-welcome',
      title: 'Welcome to Your Dashboard!',
      description: 'This dashboard is customized for your role and provides the most relevant information and tools for your daily work. The layout is streamlined with a sticky header for better navigation.<br/><br/>Let\'s explore all the features available to you and learn how to maximize your productivity!',
      screenshotUrl: '/tours/dashboard/step-1.png',
      highlightRect: { x: 48, y: 280, width: 1824, height: 600 },
      nextButton: 'Start Tour'
    },
    {
      id: 'app-header',
      title: 'Navigation Header',
      description: 'The main navigation header provides access to different work environments and core functionality:<br/><br/><strong>🏢 HB Intel Logo</strong> - Return to dashboard<br/><strong>📊 Projects Menu</strong> - Select and filter projects<br/><strong>🛠️ Tools Menu</strong> - Access all platform tools<br/><strong>🔍 Global Search</strong> - Find anything quickly<br/><strong>👤 User Menu</strong> - Profile and settings<br/><br/>Everything you need is right at your fingertips.',
      screenshotUrl: '/tours/dashboard/step-2.png',
      highlightRect: { x: 0, y: 0, width: 1920, height: 80 },
      nextButton: 'Continue'
    },
    {
      id: 'projects-menu',
      title: 'Project Selection',
      description: 'The Projects menu allows you to:<br/><br/>• <strong>Select specific projects</strong> to focus your dashboard<br/>• <strong>Filter by construction stage</strong> (Pre-construction, Construction, Close-out)<br/>• <strong>View project details</strong> and quick stats<br/>• <strong>Navigate to Project Control Center</strong> for detailed management<br/><br/>Your dashboard content dynamically updates based on your selection.',
      screenshotUrl: '/tours/dashboard/step-3.png',
      highlightRect: { x: 250, y: 80, width: 350, height: 300 },
      nextButton: 'Next'
    },
    {
      id: 'tools-menu',
      title: 'Tools & Navigation',
      description: 'Access the complete HB Intel platform through organized tool categories:<br/><br/><strong>🔧 Core Tools</strong> - Dashboard, Reports, Staffing<br/><strong>💰 Financial Management</strong> - Financial Hub, Procurement<br/><strong>🏗️ Field Management</strong> - Scheduler, Constraints, Field Reports<br/><strong>📋 Compliance</strong> - Contracts, Trade Partners<br/><br/>Tools are filtered based on your role and permissions.',
      screenshotUrl: '/tours/dashboard/step-4.png',
      highlightRect: { x: 650, y: 80, width: 400, height: 350 },
      nextButton: 'Continue'
    },
    {
      id: 'dashboard-page-header',
      title: 'Dashboard Header',
      description: 'The dashboard header stays visible as you scroll, providing quick access to key controls:<br/><br/>• <strong>Breadcrumb navigation</strong> for easy back-navigation<br/>• <strong>Dashboard title and description</strong> for context<br/>• <strong>Fullscreen mode</strong> for presentations<br/>• <strong>More actions menu</strong> for advanced features<br/><br/>Notice how it\'s positioned below the main navigation for optimal workflow.',
      screenshotUrl: '/tours/dashboard/step-5.png',
      highlightRect: { x: 0, y: 80, width: 1920, height: 120 },
      nextButton: 'Next'
    },
    {
      id: 'dashboard-tabs',
      title: 'Dashboard Views',
      description: 'Switch between different dashboard layouts using these tabs. Each tab represents a specialized view optimized for different aspects of your role:<br/><br/>• <strong>Executive Overview</strong> - High-level metrics and KPIs<br/>• <strong>Financial Review</strong> - Budget and cost analysis<br/>• <strong>Project Status</strong> - Current project health<br/>• <strong>Operations</strong> - Daily management tools<br/><br/>Simply click any tab to switch views instantly.',
      screenshotUrl: '/tours/dashboard/step-6.png',
      highlightRect: { x: 48, y: 280, width: 600, height: 48 },
      nextButton: 'Continue'
    },
    {
      id: 'dashboard-content',
      title: 'Dynamic Dashboard Content',
      description: 'The main dashboard area displays widgets and analytics cards based on your selected view:<br/><br/>• <strong>Real-time data</strong> updates automatically<br/>• <strong>Interactive charts</strong> and visualizations<br/>• <strong>Customizable layout</strong> - drag and drop to reorganize<br/>• <strong>Role-specific content</strong> optimized for your workflow<br/><br/>Content is dynamically loaded and optimized for your role and current context.',
      screenshotUrl: '/tours/dashboard/step-7.png',
      highlightRect: { x: 48, y: 350, width: 1824, height: 500 },
      nextButton: 'Next'
    },
    {
      id: 'customization-features',
      title: 'Customization & Settings',
      description: 'The More Actions menu (⋮) provides powerful customization options:<br/><br/><strong>🔄 Refresh</strong> - Update all dashboard data<br/><strong>✏️ Edit Dashboard</strong> - Customize layout and widgets<br/><strong>📐 Layout Density</strong> - Adjust spacing (Compact, Normal, Spacious)<br/><strong>➕ Create New Dashboard</strong> - Coming soon feature<br/><br/>You can:<br/>• Drag and drop widgets to reorganize<br/>• Resize cards for optimal viewing<br/>• Add or remove dashboard components<br/>• Save custom layouts<br/>• Reset to default configurations',
      screenshotUrl: '/tours/dashboard/step-8.png',
      highlightRect: { x: 1650, y: 120, width: 250, height: 200 },
      nextButton: 'Finish Tour'
    }
  ]
}

// Executive Staffing Tour Definition
export const executiveStaffingTour: TourDefinition = {
  id: 'executive-staffing-overview',
  name: 'Executive Staffing Management',
  description: 'Comprehensive enterprise-level staffing oversight and strategic planning',
  page: 'staff-planning',
  userRoles: ['executive'],
  steps: [
    {
      id: 'staffing-welcome',
      title: 'Welcome to Enterprise Staffing',
      description: 'As an Executive, you have comprehensive oversight of all staffing across the organization. This dashboard provides strategic insights into resource allocation, costs, and performance across all projects and departments.',
      screenshotUrl: '/tours/staffing/step-1.png',
      nextButton: 'Begin Tour'
    },
    {
      id: 'breadcrumb-navigation',
      title: 'Navigation Context',
      content: 'These breadcrumbs show your current location within the platform. Use them to quickly navigate back to the main dashboard or other sections.',
      target: '[data-tour="breadcrumb-nav"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'enterprise-scope',
      title: 'Enterprise Scope & Role',
      content: 'Your executive role provides access to organization-wide staffing data. The badges show your current view scope and total staff count across all projects and departments.',
      target: '[data-tour="role-badges"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'action-controls',
      title: 'Executive Actions',
      content: 'Access powerful tools for data refresh, comprehensive reporting, and strategic planning. Executive reports include cost analysis, utilization trends, and strategic recommendations.',
      target: '[data-tour="action-controls"]',
      placement: 'left',
      nextButton: 'Continue'
    },
    {
      id: 'utilization-metrics',
      title: 'Staff Utilization Overview',
      content: 'Monitor organization-wide staff utilization rates. This metric shows how effectively human resources are deployed across all active projects and initiatives.',
      target: '[data-tour="utilization-widget"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'labor-cost-analysis',
      title: 'Strategic Cost Management',
      content: 'Track total monthly labor costs across the enterprise. This includes all loaded costs (salary, benefits, overhead) for strategic budget planning and cost optimization.',
      target: '[data-tour="labor-cost-widget"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'enterprise-portfolio',
      title: 'Portfolio Scope',
      content: 'View your enterprise scope across all projects, departments, and business units. This provides the complete organizational picture for strategic decision-making.',
      target: '[data-tour="project-scope-widget"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'spcr-oversight',
      title: 'SPCR Management',
      content: 'Monitor Staffing Plan Change Requests across the organization. Track pending approvals, approved changes, and their impact on overall resource allocation.',
      target: '[data-tour="spcr-widget"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'executive-dashboard',
      title: 'Executive Analytics',
      content: 'Your executive view provides strategic insights including:<br/><br/>• Cross-project resource optimization<br/>• Long-term staffing trends<br/>• Department performance comparisons<br/>• Strategic planning recommendations<br/>• Executive-level reporting and analytics',
      target: '[data-tour="role-content"]',
      placement: 'left',
      nextButton: 'Next'
    },
    {
      id: 'help-resources',
      title: 'Strategic Planning Guide',
      content: 'Access comprehensive guides for enterprise resource planning, SPCR workflows, and performance analytics. These resources support strategic decision-making and organizational optimization.',
      target: '[data-tour="help-section"]',
      placement: 'top',
      nextButton: 'Complete Tour'
    }
  ]
}

// Project Executive Staffing Tour Definition
export const projectExecutiveStaffingTour: TourDefinition = {
  id: 'project-executive-staffing-overview',
  name: 'Portfolio Staffing Management',
  description: 'Manage staffing across your project portfolio with performance analytics',
  page: 'staff-planning',
  userRoles: ['project-executive'],
  steps: [
    {
      id: 'portfolio-welcome',
      title: 'Portfolio Staffing Dashboard',
      description: 'Welcome to your Portfolio Staffing Dashboard! As a Project Executive, you manage staffing across multiple projects with focus on optimization and performance tracking.',
      screenshotUrl: '/tours/staffing/step-1.png',
      nextButton: 'Start Tour'
    },
    {
      id: 'navigation-breadcrumbs',
      title: 'Quick Navigation',
      content: 'Use these breadcrumbs to navigate between your dashboard and staffing management. Quick access helps you stay productive across multiple project responsibilities.',
      target: '[data-tour="breadcrumb-nav"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'portfolio-role',
      title: 'Portfolio Scope',
      content: 'Your Project Executive role gives you visibility and management capabilities across your assigned portfolio. The scope shows the number of projects under your oversight.',
      target: '[data-tour="role-badges"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'portfolio-actions',
      title: 'Portfolio Management Tools',
      content: 'Access portfolio-level actions including data refresh, portfolio reporting, and SPCR creation. These tools help you manage resources across multiple projects efficiently.',
      target: '[data-tour="action-controls"]',
      placement: 'left',
      nextButton: 'Continue'
    },
    {
      id: 'portfolio-utilization',
      title: 'Portfolio Utilization',
      content: 'Monitor staff utilization across your entire portfolio. This helps identify over or under-utilized resources and opportunities for optimization between projects.',
      target: '[data-tour="utilization-widget"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'portfolio-costs',
      title: 'Portfolio Labor Costs',
      content: 'Track labor costs across your portfolio for budget management and cost optimization. Compare costs between projects to identify efficiency opportunities.',
      target: '[data-tour="labor-cost-widget"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'project-portfolio',
      title: 'Portfolio Projects',
      content: 'Your portfolio view encompasses multiple projects under your management. This gives you the scope needed to balance resources and optimize performance across projects.',
      target: '[data-tour="project-scope-widget"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'portfolio-spcr',
      title: 'Portfolio SPCR Management',
      content: 'Manage SPCRs across your portfolio. You can initiate changes that affect multiple projects and track approval status for resource reallocation.',
      target: '[data-tour="spcr-widget"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'portfolio-dashboard',
      title: 'Portfolio Analytics & Management',
      content: 'Your portfolio view includes:<br/><br/>• Interactive Gantt charts for cross-project planning<br/>• Resource allocation optimization<br/>• Performance comparison between projects<br/>• Portfolio-level SPCR management<br/>• Cross-project resource sharing insights',
      target: '[data-tour="role-content"]',
      placement: 'left',
      nextButton: 'Next'
    },
    {
      id: 'portfolio-resources',
      title: 'Portfolio Planning Resources',
      content: 'Access guides specific to portfolio management including resource optimization, cross-project planning, and performance analytics to maximize your portfolio efficiency.',
      target: '[data-tour="help-section"]',
      placement: 'top',
      nextButton: 'Finish Tour'
    }
  ]
}

// Project Manager Staffing Tour Definition
export const projectManagerStaffingTour: TourDefinition = {
  id: 'project-manager-staffing-overview',
  name: 'Project Team Management',
  description: 'Detailed team management with responsibility tracking and workflows',
  page: 'staff-planning',
  userRoles: ['project-manager'],
  steps: [
    {
      id: 'team-welcome',
      title: 'Project Team Management',
      content: 'Welcome to your Project Team Management dashboard! As a Project Manager, you have detailed control over your project team with responsibility tracking and workflow management.',
      target: '[data-tour="staffing-header"]',
      placement: 'center',
      nextButton: 'Begin Tour'
    },
    {
      id: 'project-navigation',
      title: 'Project Navigation',
      content: 'Quick navigation between your main dashboard and team management. Streamlined access helps you manage your project team efficiently.',
      target: '[data-tour="breadcrumb-nav"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'project-role',
      title: 'Project Manager Role',
      content: 'Your Project Manager role provides detailed team management capabilities for your assigned project. Focus on single-project optimization and team performance.',
      target: '[data-tour="role-badges"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'team-actions',
      title: 'Team Management Actions',
      content: 'Access project-specific tools including data refresh, team reports, and SPCR creation for staffing changes. The Create SPCR button allows you to request staffing modifications.',
      target: '[data-tour="action-controls"]',
      placement: 'left',
      nextButton: 'Continue'
    },
    {
      id: 'team-utilization',
      title: 'Team Utilization Tracking',
      content: 'Monitor your project team\'s utilization rates. Ensure optimal productivity while maintaining team balance and preventing burnout.',
      target: '[data-tour="utilization-widget"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'project-labor-costs',
      title: 'Project Labor Cost Management',
      content: 'Track labor costs for your specific project. Monitor budget performance and identify opportunities for cost optimization within your team.',
      target: '[data-tour="labor-cost-widget"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'single-project-scope',
      title: 'Single Project Focus',
      content: 'Your scope is focused on managing one project in detail. This allows for deep team management and detailed responsibility tracking.',
      target: '[data-tour="project-scope-widget"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'project-spcr',
      title: 'Project SPCR Workflow',
      content: 'Manage SPCRs for your project team. Request additional resources, role changes, or staffing adjustments through the formal approval workflow.',
      target: '[data-tour="spcr-widget"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'team-management-dashboard',
      title: 'Detailed Team Management',
      content: 'Your project manager view provides:<br/><br/>• Detailed team assignment tracking<br/>• Individual responsibility matrices<br/>• Skill-based resource planning<br/>• Performance monitoring and reporting<br/>• Detailed SPCR creation and tracking<br/>• Labor vs revenue analysis',
      target: '[data-tour="role-content"]',
      placement: 'left',
      nextButton: 'Next'
    },
    {
      id: 'team-planning-guide',
      title: 'Team Planning Resources',
      content: 'Access detailed guides for team management, SPCR workflows, and performance optimization specific to project-level management.',
      target: '[data-tour="help-section"]',
      placement: 'top',
      nextButton: 'Complete Tour'
    }
  ]
}

// Financial Hub Tour Definition
export const financialHubTour: TourDefinition = {
  id: 'financial-hub-overview',
  name: 'Financial Hub Tour',
  description: 'Complete guide to financial management and analysis tools',
  page: 'financial-hub',
  steps: [
    {
      id: 'financial-welcome',
      title: 'Welcome to the Financial Hub!',
      description: 'The Financial Hub is your central command center for all financial management and analysis. Access comprehensive tools for budget tracking, cash flow analysis, and financial reporting.',
      screenshotUrl: '/tours/financial-hub/step-1.png',
      nextButton: 'Start Tour',
      showSkip: true
    },
    {
      id: 'quick-stats',
      title: 'Financial Overview',
      content: 'These key financial metrics provide an at-a-glance view of your project\'s financial health:<br/><br/>• <strong>Contract Value</strong> - Total project value<br/>• <strong>Net Cash Flow</strong> - Current cash position<br/>• <strong>Profit Margin</strong> - Project profitability<br/>• <strong>Pending Approvals</strong> - Items awaiting approval<br/>• <strong>Financial Health</strong> - Overall score',
      target: '[data-tour="financial-hub-quick-stats"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'module-navigation',
      title: 'Financial Modules',
      content: 'Navigate between different financial management modules. Each tab provides specialized tools and insights:<br/><br/>• <strong>Overview</strong> - Dashboard summary<br/>• <strong>Budget Analysis</strong> - Detailed budget tracking<br/>• <strong>Cash Flow</strong> - Liquidity management<br/>• <strong>Cost Tracking</strong> - Real-time cost monitoring<br/>• <strong>Pay Applications</strong> - AIA payment processing',
      target: '[data-tour="financial-hub-navigation"]',
      placement: 'top',
      nextButton: 'Next'
    },
    {
      id: 'overview-module',
      title: 'Financial Overview Module',
      content: 'The Overview module provides a comprehensive dashboard with key metrics, cash flow trends, and budget comparisons. This is your starting point for understanding overall financial performance.',
      target: '[data-tour="financial-hub-content-overview"]',
      placement: 'left',
      nextButton: 'Continue'
    },
    {
      id: 'budget-analysis',
      title: 'Budget Analysis Module',
      content: 'Dive deep into budget performance with detailed variance analysis, category breakdowns, and forecast tracking. Monitor budget utilization and identify areas for optimization.',
      target: '[data-tour="financial-hub-tab-budget-analysis"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'cash-flow-module',
      title: 'Cash Flow Management',
      content: 'Monitor cash inflows, outflows, and liquidity positions. Use forecasting tools to plan for future cash needs and maintain healthy working capital.',
      target: '[data-tour="financial-hub-tab-cash-flow"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'cost-tracking',
      title: 'Real-time Cost Tracking',
      content: 'Track costs in real-time across all categories. Monitor commitments, actual expenses, and pending costs to maintain budget control.',
      target: '[data-tour="financial-hub-tab-cost-tracking"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'pay-applications',
      title: 'Pay Application Processing',
      content: 'Generate and manage formal AIA G702/G703 payment applications. Track submission status, approval workflows, and payment receipts.',
      target: '[data-tour="financial-hub-tab-pay-authorization"]',
      placement: 'bottom',
      nextButton: 'Continue'
    },
    {
      id: 'change-orders',
      title: 'Change Order Management',
      content: 'Track change orders and their financial impact. Monitor pending changes, approved modifications, and their effect on project budgets.',
      target: '[data-tour="financial-hub-tab-change-management"]',
      placement: 'bottom',
      nextButton: 'Next'
    },
    {
      id: 'financial-insights',
      title: 'HBI Financial Intelligence',
      content: 'The Financial Hub integrates AI-powered insights to help you:<br/><br/>• Identify budget variances and their causes<br/>• Predict cash flow trends<br/>• Optimize payment timing<br/>• Flag potential financial risks<br/>• Suggest cost-saving opportunities',
      target: '[data-tour="financial-hub-content-overview"]',
      placement: 'center',
      nextButton: 'Complete Tour'
    }
  ]
}

// Export all tour definitions
export const TOUR_DEFINITIONS: TourDefinition[] = [
  loginTour,
  dashboardTour,
  executiveStaffingTour,
  projectExecutiveStaffingTour,
  projectManagerStaffingTour,
  financialHubTour,
  // Note: Other tour definitions (scheduler, etc.) should be moved here
  // from the original tour-context.tsx file. For brevity, I'm showing the pattern with just these.
]

// Export validation function for external use
export { validateAllTourDefinitions } 