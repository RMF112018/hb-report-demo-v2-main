#!/usr/bin/env node

/**
 * Accessibility Audit Script
 *
 * Performs comprehensive accessibility checks including:
 * - Missing alt text on images
 * - Insufficient color contrast
 * - Missing ARIA attributes
 * - Keyboard navigation issues
 * - Focus management problems
 * - Screen reader compatibility
 */

import * as fs from "fs"
import * as path from "path"

interface AuditResult {
  file: string
  line: number
  column: number
  severity: "error" | "warning" | "info"
  message: string
  rule: string
  suggestion?: string
}

interface AuditSummary {
  totalIssues: number
  errors: number
  warnings: number
  info: number
  filesWithIssues: string[]
  criticalIssues: AuditResult[]
  recommendations: string[]
}

/**
 * Performs accessibility audit on the codebase
 */
class AccessibilityAuditor {
  private results: AuditResult[] = []
  private projectRoot: string

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
  }

  /**
   * Runs the complete accessibility audit
   */
  async runAudit(): Promise<AuditSummary> {
    console.log("🔍 Starting accessibility audit...")

    this.results = []

    // Run various audit checks
    await this.checkMissingAltText()
    await this.checkColorContrast()
    await this.checkMissingAriaAttributes()
    await this.checkKeyboardNavigation()
    await this.checkFocusManagement()
    await this.checkScreenReaderCompatibility()
    await this.checkFormAccessibility()
    await this.checkHeadingStructure()
    await this.checkLinkAccessibility()

    return this.generateSummary()
  }

  /**
   * Checks for missing alt text on images
   */
  private async checkMissingAltText(): Promise<void> {
    console.log("  📸 Checking for missing alt text...")

    const imagePatterns = [/<img[^>]*>/gi, /<Image[^>]*>/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of imagePatterns) {
          const matches = line.match(pattern)
          if (matches) {
            for (const match of matches) {
              if (!match.includes("alt=") || match.includes('alt=""')) {
                this.results.push({
                  file,
                  line: i + 1,
                  column: typeof line === "string" && match ? line.indexOf(match) + 1 : 1,
                  severity: "error",
                  message: "Missing or empty alt text on image",
                  rule: "alt-text",
                  suggestion: "Add descriptive alt text for screen readers",
                })
              }
            }
          }
        }
      }
    }
  }

  /**
   * Checks for color contrast issues
   */
  private async checkColorContrast(): Promise<void> {
    console.log("  🎨 Checking color contrast...")

    const contrastPatterns = [
      /text-gray-\d+/gi,
      /text-blue-\d+/gi,
      /text-green-\d+/gi,
      /text-red-\d+/gi,
      /text-yellow-\d+/gi,
    ]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of contrastPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            for (const match of matches) {
              const colorNumber = match.match(/\d+/)?.[0]
              if (colorNumber && parseInt(colorNumber) > 500) {
                this.results.push({
                  file,
                  line: i + 1,
                  column: typeof line === "string" && match ? line.indexOf(match) + 1 : 1,
                  severity: "warning",
                  message: `Potentially insufficient color contrast: ${match}`,
                  rule: "color-contrast",
                  suggestion: "Ensure contrast ratio meets WCAG 2.2 AA standards (4.5:1)",
                })
              }
            }
          }
        }
      }
    }
  }

  /**
   * Checks for missing ARIA attributes
   */
  private async checkMissingAriaAttributes(): Promise<void> {
    console.log("  ♿ Checking ARIA attributes...")

    const ariaPatterns = [/role="(button|dialog|menu|tab|tabpanel|combobox|listbox|grid|tree|treegrid)"/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of ariaPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            for (const match of matches) {
              const role = match.match(/role="([^"]+)"/)?.[1]
              if (role) {
                const requiredAttributes = this.getRequiredAriaAttributes(role)
                const missingAttributes = requiredAttributes.filter((attr) => !line.includes(attr))

                if (missingAttributes.length > 0) {
                  this.results.push({
                    file,
                    line: i + 1,
                    column: typeof line === "string" && match ? line.indexOf(match) + 1 : 1,
                    severity: "error",
                    message: `Missing required ARIA attributes for role "${role}"`,
                    rule: "aria-required-attributes",
                    suggestion: `Add: ${missingAttributes.join(", ")}`,
                  })
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Checks for keyboard navigation issues
   */
  private async checkKeyboardNavigation(): Promise<void> {
    console.log("  ⌨️  Checking keyboard navigation...")

    const keyboardPatterns = [/onClick[^>]*>/gi, /onClick\s*=/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of keyboardPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            // Check if element is focusable
            if (line.includes("div") || line.includes("span")) {
              this.results.push({
                file,
                line: i + 1,
                column: typeof line === "string" && matches[0] ? line.indexOf(matches[0]) + 1 : 1,
                severity: "warning",
                message: "Clickable element may not be keyboard accessible",
                rule: "click-events-have-key-events",
                suggestion: "Add onKeyDown handler or make element focusable",
              })
            }
          }
        }
      }
    }
  }

  /**
   * Checks for focus management issues
   */
  private async checkFocusManagement(): Promise<void> {
    console.log("  🎯 Checking focus management...")

    const focusPatterns = [/useRef<HTMLDivElement>/gi, /useRef<HTMLElement>/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of focusPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            // Check if focus management is implemented
            const hasFocusManagement =
              content.includes("focus()") || content.includes("blur()") || content.includes("tabIndex")

            if (!hasFocusManagement) {
              this.results.push({
                file,
                line: i + 1,
                column: typeof line === "string" && matches[0] ? line.indexOf(matches[0]) + 1 : 1,
                severity: "info",
                message: "Element ref found but no focus management detected",
                rule: "focus-management",
                suggestion: "Consider implementing focus management for better accessibility",
              })
            }
          }
        }
      }
    }
  }

  /**
   * Checks for screen reader compatibility
   */
  private async checkScreenReaderCompatibility(): Promise<void> {
    console.log("  🔊 Checking screen reader compatibility...")

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        // Check for dynamic content without ARIA live regions
        if (line.includes("useState") || line.includes("useEffect")) {
          const hasAriaLive = content.includes("aria-live")
          const hasAnnouncements = content.includes("announce") || content.includes("screenReader")

          if (!hasAriaLive && !hasAnnouncements) {
            this.results.push({
              file,
              line: i + 1,
              column: 1,
              severity: "info",
              message: "Dynamic content may not be announced to screen readers",
              rule: "screen-reader-compatibility",
              suggestion: "Consider adding aria-live regions or screen reader announcements",
            })
          }
        }
      }
    }
  }

  /**
   * Checks for form accessibility
   */
  private async checkFormAccessibility(): Promise<void> {
    console.log("  📝 Checking form accessibility...")

    const formPatterns = [/<input/gi, /<textarea/gi, /<select/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of formPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            // Check for missing labels
            if (!line.includes("aria-label") && !line.includes("aria-labelledby")) {
              this.results.push({
                file,
                line: i + 1,
                column: typeof line === "string" && matches[0] ? line.indexOf(matches[0]) + 1 : 1,
                message: "Form control missing accessible label",
                rule: "form-controls-have-labels",
                severity: "error",
                suggestion: "Add aria-label or associate with a label element",
              })
            }
          }
        }
      }
    }
  }

  /**
   * Checks for heading structure
   */
  private async checkHeadingStructure(): Promise<void> {
    console.log("  📋 Checking heading structure...")

    const headingPatterns = [/<h1/gi, /<h2/gi, /<h3/gi, /<h4/gi, /<h5/gi, /<h6/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      let lastHeadingLevel = 0

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of headingPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            const level = parseInt(matches[0].match(/\d/)?.[0] || "0")

            if (level > lastHeadingLevel + 1) {
              this.results.push({
                file,
                line: i + 1,
                column: typeof line === "string" && matches[0] ? line.indexOf(matches[0]) + 1 : 1,
                severity: "warning",
                message: `Heading level skipped: h${lastHeadingLevel} to h${level}`,
                rule: "heading-structure",
                suggestion: "Maintain logical heading hierarchy",
              })
            }

            lastHeadingLevel = level
          }
        }
      }
    }
  }

  /**
   * Checks for link accessibility
   */
  private async checkLinkAccessibility(): Promise<void> {
    console.log("  🔗 Checking link accessibility...")

    const linkPatterns = [/<a[^>]*>/gi]

    const files = this.getTypeScriptFiles()

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8")
      const lines = content.split("\n")

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (typeof line !== "string") continue

        for (const pattern of linkPatterns) {
          const matches = line.match(pattern)
          if (matches) {
            for (const match of matches) {
              // Check for generic link text
              if (match.includes(">Click here<") || match.includes(">Read more<") || match.includes(">Learn more<")) {
                this.results.push({
                  file,
                  line: i + 1,
                  column: typeof line === "string" && match ? line.indexOf(match) + 1 : 1,
                  severity: "warning",
                  message: "Generic link text may not be descriptive",
                  rule: "link-text",
                  suggestion: "Use descriptive link text that explains the destination",
                })
              }

              // Check for missing href
              if (!match.includes("href=")) {
                this.results.push({
                  file,
                  line: i + 1,
                  column: typeof line === "string" && match ? line.indexOf(match) + 1 : 1,
                  severity: "error",
                  message: "Link missing href attribute",
                  rule: "link-href",
                  suggestion: "Add href attribute or use button element instead",
                })
              }
            }
          }
        }
      }
    }
  }

  /**
   * Gets all TypeScript files in the project
   */
  private getTypeScriptFiles(): string[] {
    const files: string[] = []

    const walkDir = (dir: string) => {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory() && !item.startsWith(".") && item !== "node_modules") {
          walkDir(fullPath)
        } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
          files.push(fullPath)
        }
      }
    }

    walkDir(this.projectRoot)
    return files
  }

  /**
   * Gets required ARIA attributes for a given role
   */
  private getRequiredAriaAttributes(role: string): string[] {
    const requiredAttributes: Record<string, string[]> = {
      button: ["aria-label", "aria-pressed"],
      checkbox: ["aria-checked"],
      combobox: ["aria-expanded", "aria-haspopup"],
      dialog: ["aria-labelledby", "aria-describedby"],
      listbox: ["aria-multiselectable"],
      menuitem: ["aria-haspopup"],
      progressbar: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
      slider: ["aria-valuenow", "aria-valuemin", "aria-valuemax"],
      tab: ["aria-selected"],
      tabpanel: ["aria-labelledby"],
      textbox: ["aria-multiline", "aria-required"],
      treeitem: ["aria-expanded", "aria-level", "aria-setsize", "aria-posinset"],
    }

    return requiredAttributes[role] || []
  }

  /**
   * Generates audit summary
   */
  private generateSummary(): AuditSummary {
    const errors = this.results.filter((r) => r.severity === "error")
    const warnings = this.results.filter((r) => r.severity === "warning")
    const info = this.results.filter((r) => r.severity === "info")

    const filesWithIssues = [...new Set(this.results.map((r) => r.file))]

    const criticalIssues = this.results.filter(
      (r) => r.severity === "error" || (r.severity === "warning" && r.rule.includes("contrast"))
    )

    const recommendations = this.generateRecommendations()

    return {
      totalIssues: this.results.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
      filesWithIssues,
      criticalIssues,
      recommendations,
    }
  }

  /**
   * Generates recommendations based on audit results
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    const errorCount = this.results.filter((r) => r.severity === "error").length
    const warningCount = this.results.filter((r) => r.severity === "warning").length

    if (errorCount > 0) {
      recommendations.push(`Fix ${errorCount} critical accessibility errors`)
    }

    if (warningCount > 0) {
      recommendations.push(`Address ${warningCount} accessibility warnings`)
    }

    if (this.results.some((r) => r.rule === "alt-text")) {
      recommendations.push("Add descriptive alt text to all images")
    }

    if (this.results.some((r) => r.rule === "color-contrast")) {
      recommendations.push("Review color contrast ratios for WCAG 2.2 AA compliance")
    }

    if (this.results.some((r) => r.rule === "aria-required-attributes")) {
      recommendations.push("Add required ARIA attributes to interactive elements")
    }

    if (this.results.some((r) => r.rule === "focus-management")) {
      recommendations.push("Implement proper focus management for modals and dialogs")
    }

    return recommendations
  }

  /**
   * Prints audit results
   */
  printResults(summary: AuditSummary): void {
    console.log("\n📊 Accessibility Audit Results")
    console.log("=".repeat(50))

    console.log(`\n📈 Summary:`)
    console.log(`  Total Issues: ${summary.totalIssues}`)
    console.log(`  Errors: ${summary.errors}`)
    console.log(`  Warnings: ${summary.warnings}`)
    console.log(`  Info: ${summary.info}`)
    console.log(`  Files with Issues: ${summary.filesWithIssues.length}`)

    if (summary.criticalIssues.length > 0) {
      console.log(`\n🚨 Critical Issues:`)
      summary.criticalIssues.forEach((issue) => {
        console.log(`  ${issue.file}:${issue.line}:${issue.column} - ${issue.message}`)
        if (issue.suggestion) {
          console.log(`    💡 ${issue.suggestion}`)
        }
      })
    }

    if (summary.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`)
      summary.recommendations.forEach((rec) => {
        console.log(`  • ${rec}`)
      })
    }

    console.log(`\n✅ Audit completed!`)
  }
}

// Main execution
async function main() {
  const auditor = new AccessibilityAuditor(process.cwd())
  const summary = await auditor.runAudit()
  auditor.printResults(summary)

  // Exit with error code if there are critical issues
  if (summary.errors > 0) {
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { AccessibilityAuditor, type AuditResult, type AuditSummary }
