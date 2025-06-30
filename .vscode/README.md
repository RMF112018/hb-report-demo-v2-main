# VS Code Workspace Configuration

This directory contains VS Code workspace settings to optimize the development experience for this Next.js + Tailwind CSS project.

## Files Overview

### `settings.json`
Configures VS Code behavior for this workspace:
- **CSS Validation**: Disables default CSS validation to prevent false errors with Tailwind directives
- **Tailwind Support**: Configures the Tailwind CSS extension with proper config file path
- **File Associations**: Associates `.css` files with PostCSS for better syntax highlighting
- **Editor Settings**: Enables format on save, auto imports, and ESLint integration

### `css_custom_data.json`
Teaches VS Code about Tailwind CSS at-rules:
- Defines `@tailwind`, `@apply`, `@layer`, and `@screen` directives
- Provides descriptions and documentation links for each directive
- Eliminates "Unknown at rule" errors in CSS files

### `extensions.json`
Recommends useful VS Code extensions:
- **Tailwind CSS IntelliSense**: Autocomplete, syntax highlighting, and linting
- **PostCSS Language Support**: Better CSS file handling
- **Prettier**: Code formatting
- **TypeScript**: Enhanced TypeScript support

## Resolving CSS Validation Errors

The configuration in this directory resolves these common errors:
- ❌ `Unknown at rule @tailwind`
- ❌ `Unknown at rule @apply`
- ❌ `Unknown at rule @layer`

## Installation

1. **Install Recommended Extensions**: VS Code should prompt you to install recommended extensions
2. **Restart VS Code**: Reload the window to apply all settings
3. **Verify**: CSS validation errors should be resolved

## Additional Setup

The workspace also includes:
- **Prettier configuration** (`.prettierrc`) for consistent code formatting
- **PostCSS configuration** (`postcss.config.mjs`) for Tailwind processing
- **Tailwind configuration** (`tailwind.config.ts`) for design system setup

## Troubleshooting

If you still see CSS validation errors:
1. Ensure the Tailwind CSS IntelliSense extension is installed and enabled
2. Restart VS Code completely
3. Check that `tailwind.config.ts` exists in the project root
4. Verify `postcss.config.mjs` includes the Tailwind plugin 