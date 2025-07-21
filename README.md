# HB Report Demo v3.0

A comprehensive construction management platform built with Next.js, TypeScript, and modern web technologies.

## 🏗️ Architecture Overview

### Tech Stack

- **Framework**: Next.js 15.4.0 with App Router
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Zustand 4.5.7
- **Form Handling**: React Hook Form 7.48.2
- **Validation**: Zod 4.0.0
- **Icons**: Lucide React 0.454.0
- **Testing**: Vitest 2.1.9
- **Storybook**: 7.6.20

### Core Features

- **Role-based Access Control**: Executive, Project Executive, Project Manager, Estimator, IT Administrator
- **Fluid Navigation System**: 64px collapsed sidebar with 320px expandable panels
- **Real-time Dashboards**: Power BI integration with live data visualization
- **Bid Management**: BuildingConnected platform integration
- **IT Command Center**: Comprehensive IT operations dashboard
- **Accessibility**: WCAG 2.2 AA compliant with focus management
- **Security**: DOMPurify sanitization, input validation, secure authentication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hb-report-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Security
npm run audit            # Security audit
npm run audit:fix        # Fix security issues
npm run security-check   # Comprehensive security check

# Documentation
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook

# Utilities
npm run clear-auth       # Clear authentication cache
npm run generate-tour-screenshots  # Generate tour screenshots
```

## 📁 Project Structure

```
hb-report-demo/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages by role
│   ├── hr-payroll/       # HR & Payroll modules
│   ├── it/               # IT Command Center
│   ├── login/            # Authentication
│   └── project/          # Project-specific pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── cards/            # Dashboard cards
│   ├── charts/           # Data visualization
│   └── [feature]/        # Feature-specific components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
├── styles/               # Global styles
└── docs/                 # Documentation
```

## 🔐 Security Features

### Input Sanitization

- DOMPurify integration for XSS prevention
- Zod schema validation for all forms
- Type-safe API endpoints

### Authentication

- Microsoft Graph API integration
- Role-based access control
- Secure session management

### Security Monitoring

- Automated vulnerability scanning
- Dependency audit workflows
- Security headers configuration

## ♿ Accessibility

### WCAG 2.2 AA Compliance

- Semantic HTML structure
- ARIA attributes and roles
- Keyboard navigation support
- Focus management and trapping
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)

### Accessibility Utilities

- `@/lib/accessibility-utils` - Focus management
- `@/lib/aria-helpers` - ARIA utilities
- `@/components/ui/accessible-modal` - Accessible modals

## 🧪 Testing Strategy

### Test Coverage

- **Unit Tests**: Component testing with Vitest
- **Integration Tests**: API and workflow testing
- **E2E Tests**: Playwright for critical user journeys
- **Accessibility Tests**: Automated a11y testing

### Testing Commands

```bash
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Run E2E tests
```

## 📊 Performance

### Optimization Features

- Next.js App Router with streaming
- Component lazy loading
- Image optimization
- Bundle analysis with `@next/bundle-analyzer`
- Performance monitoring with Sentry

### Performance Monitoring

```bash
npm run analyze           # Bundle analysis
npm run lighthouse        # Performance audit
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

- **Security**: Automated vulnerability scanning
- **Testing**: Unit, integration, and E2E tests
- **Quality**: Linting, type checking, accessibility
- **Deployment**: Automated deployment to staging/production

### Dependabot Configuration

- Automated dependency updates
- Security vulnerability alerts
- Breaking change notifications

## 📚 Documentation

### Comprehensive Documentation

- **Architecture**: System design and patterns
- **Features**: Implementation guides
- **Development**: Setup and contribution guidelines
- **API**: Endpoint documentation
- **Components**: Storybook documentation

### Documentation Structure

```
docs/
├── architecture/         # System architecture
├── features/            # Feature implementations
├── implementations/     # Detailed guides
├── development/         # Development process
└── project-page/        # Project-specific docs
```

## 🛠️ Development Guidelines

### Code Standards

- **TypeScript**: Strict mode with comprehensive types
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### Component Guidelines

- Functional components with hooks
- TypeScript interfaces for all props
- JSDoc documentation
- Accessibility-first design
- Error boundaries for resilience

### State Management

- **Zustand**: Global state management
- **React Context**: Theme and auth providers
- **Local State**: Component-specific state
- **Server State**: React Query for API data

## 🚨 Error Handling

### Error Boundaries

- Global error boundary for unhandled errors
- Component-specific error boundaries
- Graceful degradation strategies
- User-friendly error messages

### Monitoring

- Sentry integration for error tracking
- Performance monitoring
- User analytics
- Security event logging

## 🔧 Maintenance

### Regular Tasks

- **Weekly**: Security audits and dependency updates
- **Monthly**: Performance reviews and optimization
- **Quarterly**: Accessibility audits and compliance checks
- **Annually**: Architecture reviews and technical debt assessment

### Monitoring

- Application performance monitoring
- Error tracking and alerting
- Security vulnerability scanning
- User experience metrics

## 🤝 Contributing

### Development Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Develop** with tests and documentation
4. **Submit** a pull request
5. **Review** and merge

### Code Review Checklist

- [ ] TypeScript types are comprehensive
- [ ] Accessibility requirements met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed

## 📞 Support

### Getting Help

- **Documentation**: Check `/docs` directory
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Security**: Private security reports

### Team Contacts

- **Development**: Development team
- **Product**: Product management
- **Security**: Security team
- **Accessibility**: A11y specialist

## 📄 License

This project is proprietary software. All rights reserved.

---

**Version**: 3.0.0  
**Last Updated**: July 2025  
**Status**: Production Ready ✅
