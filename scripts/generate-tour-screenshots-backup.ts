#!/usr/bin/env node

import puppeteer, { Browser, Page } from "puppeteer"
import fs from "fs/promises"
import path from "path"
import { TOUR_DEFINITIONS, TourDefinition, TourStep } from "../data/tours/tour-definitions"

interface ScreenshotOptions {
  tour?: string
  all?: boolean
  headless?: boolean
  port?: number
  delay?: number
  help?: boolean
}

interface StepResult {
  tourId: string
  stepIndex: number
  stepId: string
  success: boolean
  filepath?: string
  error?: string
}

class TourScreenshotGenerator {
  private browser: Browser | null = null
  private page: Page | null = null
  private baseUrl: string
  private headless: boolean
  private delay: number

  constructor(options: ScreenshotOptions) {
    this.baseUrl = `http://localhost:${options.port || 3002}`
    this.headless = options.headless !== false // Default to true
    this.delay = options.delay || 2000
  }

  async initialize(): Promise<void> {
    console.log(`🚀 Launching Puppeteer browser (headless: ${this.headless})...`)

    this.browser = await puppeteer.launch({
      headless: this.headless,
      defaultViewport: {
        width: 1200,
        height: 800,
      },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    })

    this.page = await this.browser.newPage()

    // Set user agent and viewport
    await this.page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
    await this.page.setViewport({ width: 1920, height: 1080 })

    console.log("✅ Browser initialized successfully")
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      console.log("🧹 Browser closed")
    }
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
      console.log(`📁 Created directory: ${dirPath}`)
    }
  }

  private getPageUrlForTour(tourId: string): string {
    // Map tour IDs to their corresponding pages
    const tourPageMap: Record<string, string> = {
      "dashboard-overview": "/main-app",
      "financial-hub-overview": "/dashboard/financial-hub",
      "executive-staffing-overview": "/dashboard/staff-planning/executive",
      "project-executive-staffing-overview": "/dashboard/staff-planning/project-executive",
      "project-manager-staffing-overview": "/dashboard/staff-planning/project-manager",
    }

    const pagePath = tourPageMap[tourId] || "/main-app"
    return `${this.baseUrl}${pagePath}`
  }

  private async authenticateForDashboard(): Promise<void> {
    console.log("🔐 Authenticating for dashboard access...")

    try {
      // Navigate to login page first
      await this.page!.goto(`${this.baseUrl}/login`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      })

      // Wait for page to load
      await this.waitForPageStabilization()

      // Look for demo accounts button and click it
      const demoButtonSelectors = ['[data-tour="demo-accounts-toggle"]', 'button[aria-label*="Demo"]']

      let demoButtonFound = false
      for (const selector of demoButtonSelectors) {
        try {
          await this.page!.waitForSelector(selector, { timeout: 2000 })
          await this.page!.click(selector)
          console.log(`✅ Clicked demo accounts button with selector: ${selector}`)
          demoButtonFound = true
          break
        } catch {
          console.log(`⚠️  Demo button selector not found: ${selector}`)
        }
      }

      if (!demoButtonFound) {
        // Try generic approach
        const success = await this.page!.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"))
          const demoButton = buttons.find(
            (btn) =>
              btn.textContent?.toLowerCase().includes("demo") || btn.textContent?.toLowerCase().includes("try demo")
          )
          if (demoButton) {
            ;(demoButton as HTMLElement).click()
            return true
          }
          return false
        })
        if (success) {
          console.log("✅ Found and clicked demo button via text content")
          demoButtonFound = true
        }
      }

      if (demoButtonFound) {
        // Wait for dropdown to appear
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Take a more comprehensive approach to find and click any demo account
        const success = await this.page!.evaluate(() => {
          // First, try to find executive account specifically
          const buttons = Array.from(document.querySelectorAll('button, div[role="button"], [data-role], [onclick]'))

          // Look for executive account
          let targetButton = buttons.find(
            (btn) =>
              btn.textContent?.toLowerCase().includes("executive") ||
              btn.getAttribute("data-role") === "executive" ||
              btn.getAttribute("data-account") === "executive"
          )

          // If no executive, try project-executive
          if (!targetButton) {
            targetButton = buttons.find(
              (btn) =>
                btn.textContent?.toLowerCase().includes("project") &&
                btn.textContent?.toLowerCase().includes("executive")
            )
          }

          // If still no target, try project-manager
          if (!targetButton) {
            targetButton = buttons.find(
              (btn) =>
                btn.textContent?.toLowerCase().includes("project") && btn.textContent?.toLowerCase().includes("manager")
            )
          }

          // If still no target, try admin
          if (!targetButton) {
            targetButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("admin"))
          }

          // If still nothing, try the first demo account button
          if (!targetButton) {
            targetButton = buttons.find(
              (btn) =>
                btn.textContent &&
                btn.textContent.length > 3 &&
                !btn.textContent.toLowerCase().includes("demo") &&
                !btn.textContent.toLowerCase().includes("try") &&
                !btn.textContent.toLowerCase().includes("account")
            )
          }

          if (targetButton) {
            console.log("Found target account button:", targetButton.textContent)
            ;(targetButton as HTMLElement).click()
            return targetButton.textContent || "Unknown Account"
          }
          return false
        })

        if (success) {
          console.log(`✅ Clicked demo account: ${success}`)
          // Wait for authentication and redirect
          await new Promise((resolve) => setTimeout(resolve, 4000))

          // Check if we're still on login page or redirected
          const currentUrl = this.page!.url()
          if (currentUrl.includes("/login")) {
            console.log("⚠️  Still on login page, authentication may have failed")
          } else {
            console.log("✅ Authentication successful, redirected to dashboard")
          }
        } else {
          console.log("❌ Could not find any demo account to click")
        }
      } else {
        console.log("❌ Could not find demo accounts button")
      }
    } catch (error) {
      console.log("⚠️  Authentication failed, trying fallback method:", error)

      // Fallback: Try to set authentication in localStorage directly
      try {
        await this.page!.evaluate(() => {
          // Set mock user in localStorage
          const mockUser = {
            id: "demo-executive",
            firstName: "Demo",
            lastName: "Executive",
            email: "demo@hedrickbrothers.com",
            role: "executive",
            avatar: null,
            permissions: {
              preConAccess: true,
              adminAccess: false,
            },
          }
          localStorage.setItem("hb-user", JSON.stringify(mockUser))
          localStorage.setItem("hb-auth-token", "demo-token-executive")
          localStorage.setItem("hb-tour-available", "true")
        })
        console.log("✅ Set fallback authentication in localStorage")
      } catch (fallbackError) {
        console.log("⚠️  Fallback authentication also failed:", fallbackError)
      }
    }
  }

  private async waitForPageStabilization(): Promise<void> {
    // Wait for network to be idle - using proper Puppeteer timeout
    await new Promise((resolve) => setTimeout(resolve, this.delay))

    // Wait for potential React hydration and async loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if there are any loading spinners and wait for them to disappear
    try {
      await this.page!.waitForSelector('[data-testid="loading-spinner"]', {
        hidden: true,
        timeout: 3000,
      })
    } catch {
      // No loading spinner found, continue
    }

    console.log("⏳ Page stabilized")
  }

  private async handleStepInteractions(tour: TourDefinition, step: TourStep, stepIndex: number): Promise<void> {
    // Handle step-specific interactions before capturing screenshot

    // For login tour step 3 (role selection), click the demo accounts button to show dropdown
    if (tour.id === "login-demo-accounts" && step.id === "role-selection") {
      console.log('🔘 Clicking "Try Demo Accounts" button to show role selection...')

      // Try multiple selectors for the demo accounts button
      const buttonSelectors = [
        '[data-tour="demo-accounts-toggle"]',
        '[aria-label*="Demo Account"]',
        'button[class*="demo"]',
      ]

      let buttonClicked = false
      for (const selector of buttonSelectors) {
        try {
          await this.page!.waitForSelector(selector, { timeout: 2000 })
          await this.page!.click(selector)
          console.log(`✅ Clicked button with selector: ${selector}`)
          buttonClicked = true
          break
        } catch {
          console.log(`⚠️  Button selector not found: ${selector}`)
        }
      }

      if (!buttonClicked) {
        // Try a more generic approach - find any button containing "Demo"
        try {
          const success = await this.page!.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"))
            const demoButton = buttons.find(
              (btn) =>
                btn.textContent?.toLowerCase().includes("demo") || btn.textContent?.toLowerCase().includes("try demo")
            )
            if (demoButton) {
              ;(demoButton as HTMLElement).click()
              return true
            }
            return false
          })
          if (success) {
            console.log("✅ Found and clicked demo button via text content")
            buttonClicked = true
          }
        } catch (error) {
          console.log("⚠️  Could not find demo button via text content")
        }
      }

      if (buttonClicked) {
        // Wait for dropdown/menu to appear
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("✅ Demo accounts dropdown should now be visible")
      } else {
        console.log("❌ Could not find or click demo accounts button")
      }
    }

    // For dashboard tour, handle menu interactions
    if (tour.id === "dashboard-overview") {
      // Step 3: Show Projects Menu
      if (step.id === "projects-menu") {
        console.log("🔘 Clicking Projects menu to show project selection...")

        const projectMenuSelectors = [
          '[data-tour="projects-menu"]',
          '[aria-label="Select project"]',
          'button[aria-expanded="false"]:has([data-tour="projects-menu"])',
        ]

        let menuOpened = false
        for (const selector of projectMenuSelectors) {
          try {
            await this.page!.waitForSelector(selector, { timeout: 2000 })
            await this.page!.click(selector)
            console.log(`✅ Clicked projects menu with selector: ${selector}`)
            menuOpened = true
            break
          } catch {
            console.log(`⚠️  Projects menu selector not found: ${selector}`)
          }
        }

        if (!menuOpened) {
          // Try generic approach
          try {
            const success = await this.page!.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll("button"))
              const projectButton = buttons.find(
                (btn) =>
                  btn.textContent?.toLowerCase().includes("project") ||
                  btn.querySelector('[data-tour="projects-menu"]') ||
                  btn.getAttribute("aria-label")?.toLowerCase().includes("project")
              )
              if (projectButton) {
                ;(projectButton as HTMLElement).click()
                return true
              }
              return false
            })
            if (success) {
              console.log("✅ Found and clicked projects menu via text content")
              menuOpened = true
            }
          } catch (error) {
            console.log("⚠️  Could not find projects menu via text content")
          }
        }

        if (menuOpened) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          console.log("✅ Projects menu should now be visible")
        } else {
          console.log("❌ Could not find or click projects menu")
        }
      }

      // Step 4: Show Tools Menu
      if (step.id === "tools-menu") {
        console.log("🔘 Clicking Tools menu to show tool categories...")

        const toolMenuSelectors = [
          '[data-tour="tools-menu"]',
          '[aria-label="Select tool"]',
          'button[aria-expanded="false"]:has([data-tour="tools-menu"])',
        ]

        let menuOpened = false
        for (const selector of toolMenuSelectors) {
          try {
            await this.page!.waitForSelector(selector, { timeout: 2000 })
            await this.page!.click(selector)
            console.log(`✅ Clicked tools menu with selector: ${selector}`)
            menuOpened = true
            break
          } catch {
            console.log(`⚠️  Tools menu selector not found: ${selector}`)
          }
        }

        if (!menuOpened) {
          // Try generic approach
          try {
            const success = await this.page!.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll("button"))
              const toolButton = buttons.find(
                (btn) =>
                  btn.textContent?.toLowerCase().includes("tool") ||
                  btn.querySelector('[data-tour="tools-menu"]') ||
                  btn.getAttribute("aria-label")?.toLowerCase().includes("tool")
              )
              if (toolButton) {
                ;(toolButton as HTMLElement).click()
                return true
              }
              return false
            })
            if (success) {
              console.log("✅ Found and clicked tools menu via text content")
              menuOpened = true
            }
          } catch (error) {
            console.log("⚠️  Could not find tools menu via text content")
          }
        }

        if (menuOpened) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          console.log("✅ Tools menu should now be visible")
        } else {
          console.log("❌ Could not find or click tools menu")
        }
      }

      // Step 8: Show More Actions Menu
      if (step.id === "customization-features") {
        console.log("🔘 Clicking More Actions menu to show customization options...")

        const moreMenuSelectors = [
          '[data-tour="more-actions-menu"]',
          'button[aria-expanded="false"]:has([data-tour="more-actions-menu"])',
          "button:has(.lucide-ellipsis-vertical)",
        ]

        let menuOpened = false
        for (const selector of moreMenuSelectors) {
          try {
            await this.page!.waitForSelector(selector, { timeout: 2000 })
            await this.page!.click(selector)
            console.log(`✅ Clicked more actions menu with selector: ${selector}`)
            menuOpened = true
            break
          } catch {
            console.log(`⚠️  More actions menu selector not found: ${selector}`)
          }
        }

        if (!menuOpened) {
          // Try generic approach for ellipsis button
          try {
            const success = await this.page!.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll("button"))
              const moreButton = buttons.find(
                (btn) =>
                  btn.querySelector("svg") &&
                  (btn.querySelector("svg")?.getAttribute("data-lucide") === "ellipsis-vertical" ||
                    btn.querySelector("svg")?.classList.contains("lucide-ellipsis-vertical"))
              )
              if (moreButton) {
                ;(moreButton as HTMLElement).click()
                return true
              }
              return false
            })
            if (success) {
              console.log("✅ Found and clicked more actions menu via SVG icon")
              menuOpened = true
            }
          } catch (error) {
            console.log("⚠️  Could not find more actions menu via SVG icon")
          }
        }

        if (menuOpened) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          console.log("✅ More actions menu should now be visible")
        } else {
          console.log("❌ Could not find or click more actions menu")
        }
      }
    }
  }

  private async findElementWithFallbacks(step: TourStep): Promise<string | null> {
    const selectors = [
      step.target, // Legacy target selector
      `[data-tour-id="${step.id}"]`,
      `[data-tour="${step.id}"]`,
      `[id="${step.id}"]`,
      `.${step.id}`,
      `[aria-label*="${step.title}"]`,
      // Additional selectors for demo accounts button
      `[data-tour="demo-accounts-toggle"]`,
      `button:has-text("Try Demo Accounts")`,
      `button:has-text("Demo Account")`,
      `[aria-label*="Demo Account"]`,
    ].filter(Boolean)

    for (const selector of selectors) {
      try {
        await this.page!.waitForSelector(selector, { timeout: 2000 })
        console.log(`✅ Found element with selector: ${selector}`)

        // Log coordinates for debugging
        const element = await this.page!.$(selector)
        if (element) {
          const boundingBox = await element.boundingBox()
          if (boundingBox) {
            console.log(
              `📍 Element coordinates: { x: ${Math.round(boundingBox.x)}, y: ${Math.round(
                boundingBox.y
              )}, width: ${Math.round(boundingBox.width)}, height: ${Math.round(boundingBox.height)} }`
            )
          }
        }

        return selector
      } catch {
        console.log(`⚠️  Selector not found: ${selector}`)
      }
    }

    return null
  }

  private async captureElementScreenshot(selector: string, outputPath: string, step: TourStep): Promise<boolean> {
    try {
      const element = await this.page!.$(selector)
      if (!element) {
        console.log(`❌ Element not found for selector: ${selector}`)
        return false
      }

      // Scroll element into view
      await this.page!.evaluate((el) => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        })
      }, element)

      // Wait for scroll to complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add highlight styles if needed
      await this.page!.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (el) {
          const htmlEl = el as HTMLElement
          htmlEl.style.outline = "2px solid #f59e0b"
          htmlEl.style.outlineOffset = "2px"
        }
      }, selector)

      // Capture screenshot of the element with some padding
      const boundingBox = await element.boundingBox()
      if (boundingBox) {
        const padding = 20
        await this.page!.screenshot({
          path: outputPath,
          clip: {
            x: Math.max(0, boundingBox.x - padding),
            y: Math.max(0, boundingBox.y - padding),
            width: Math.min(1920, boundingBox.width + padding * 2),
            height: Math.min(1080, boundingBox.height + padding * 2),
          },
        })
      } else {
        // Fallback to element screenshot
        await element.screenshot({ path: outputPath })
      }

      // Remove highlight styles
      await this.page!.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (el) {
          const htmlEl = el as HTMLElement
          htmlEl.style.outline = ""
          htmlEl.style.outlineOffset = ""
        }
      }, selector)

      return true
    } catch (error) {
      console.error(`❌ Failed to capture element screenshot:`, error)
      return false
    }
  }

  private async captureFullPageScreenshot(outputPath: string): Promise<boolean> {
    try {
      await this.page!.screenshot({
        path: outputPath,
        fullPage: true,
      })
      console.log(`📸 Captured full page screenshot: ${outputPath}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to capture full page screenshot:`, error)
      return false
    }
  }

  async generateStepScreenshot(tour: TourDefinition, stepIndex: number): Promise<StepResult> {
    const step = tour.steps[stepIndex]
    const outputDir = path.join(process.cwd(), "public", "tours", tour.page || tour.id)
    const filename = `step-${stepIndex + 1}.png`
    const outputPath = path.join(outputDir, filename)

    console.log(`\n📸 Generating screenshot for ${tour.name} - Step ${stepIndex + 1}: ${step.title}`)

    try {
      // Ensure output directory exists
      await this.ensureDirectoryExists(outputDir)

      // Handle authentication for dashboard tours on first step
      if (tour.id !== "login-demo-accounts" && stepIndex === 0) {
        await this.authenticateForDashboard()
      }

      // Navigate to the tour page
      const pageUrl = this.getPageUrlForTour(tour.id)
      console.log(`🌐 Navigating to: ${pageUrl}`)

      await this.page!.goto(pageUrl, {
        waitUntil: "networkidle0",
        timeout: 30000,
      })

      // Wait for page stabilization
      await this.waitForPageStabilization()

      // Handle step-specific interactions before screenshot
      await this.handleStepInteractions(tour, step, stepIndex)

      // Try to find the target element
      let selector: string | null = null
      if (step.target) {
        selector = await this.findElementWithFallbacks(step)
      }

      let success = false
      if (selector) {
        // Capture element-specific screenshot
        success = await this.captureElementScreenshot(selector, outputPath, step)
        if (success) {
          console.log(`✅ Element screenshot saved: ${outputPath}`)
        }
      }

      if (!success) {
        // Fallback to full page screenshot
        console.log(`⚠️  Falling back to full page screenshot`)
        success = await this.captureFullPageScreenshot(outputPath)
      }

      return {
        tourId: tour.id,
        stepIndex,
        stepId: step.id,
        success,
        filepath: success ? outputPath : undefined,
      }
    } catch (error) {
      console.error(`❌ Error generating screenshot for step ${stepIndex + 1}:`, error)
      return {
        tourId: tour.id,
        stepIndex,
        stepId: step.id,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  async generateTourScreenshots(tourId: string): Promise<StepResult[]> {
    const tour = TOUR_DEFINITIONS.find((t) => t.id === tourId)
    if (!tour) {
      throw new Error(`Tour not found: ${tourId}`)
    }

    console.log(`\n🎯 Generating screenshots for tour: ${tour.name}`)
    console.log(`📊 Total steps: ${tour.steps.length}`)

    const results: StepResult[] = []

    for (let i = 0; i < tour.steps.length; i++) {
      const result = await this.generateStepScreenshot(tour, i)
      results.push(result)

      // Add delay between screenshots
      if (i < tour.steps.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  async generateAllTourScreenshots(): Promise<Record<string, StepResult[]>> {
    console.log(`\n🌟 Generating screenshots for all tours`)
    console.log(`📊 Total tours: ${TOUR_DEFINITIONS.length}`)

    const allResults: Record<string, StepResult[]> = {}

    for (const tour of TOUR_DEFINITIONS) {
      try {
        const results = await this.generateTourScreenshots(tour.id)
        allResults[tour.id] = results
      } catch (error) {
        console.error(`❌ Failed to generate screenshots for tour ${tour.id}:`, error)
        allResults[tour.id] = [
          {
            tourId: tour.id,
            stepIndex: -1,
            stepId: "error",
            success: false,
            error: error instanceof Error ? error.message : String(error),
          },
        ]
      }
    }

    return allResults
  }
}

function parseArgs(): ScreenshotOptions {
  const args = process.argv.slice(2)
  const options: ScreenshotOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === "--help" || arg === "-h") {
      options.help = true
    } else if (arg === "--all") {
      options.all = true
    } else if (arg.startsWith("--tour=")) {
      options.tour = arg.split("=")[1]
    } else if (arg === "--no-headless") {
      options.headless = false
    } else if (arg.startsWith("--port=")) {
      options.port = parseInt(arg.split("=")[1])
    } else if (arg.startsWith("--delay=")) {
      options.delay = parseInt(arg.split("=")[1])
    }
  }

  return options
}

function printHelp(): void {
  console.log(`
🎯 Tour Screenshot Generator

Usage:
  npx tsx scripts/generate-tour-screenshots.ts [options]

Options:
  --tour=<id>       Generate screenshots for specific tour (e.g., --tour=login-demo-accounts)
  --all             Generate screenshots for all tours
  --no-headless     Run browser in non-headless mode (for debugging)
  --port=<number>   Local server port (default: 3002)
  --delay=<ms>      Delay between operations (default: 2000ms)
  --help, -h        Show this help message

Examples:
  npx tsx scripts/generate-tour-screenshots.ts --tour=login-demo-accounts
  npx tsx scripts/generate-tour-screenshots.ts --all
  npx tsx scripts/generate-tour-screenshots.ts --tour=dashboard-overview --no-headless

Available Tours:
${TOUR_DEFINITIONS.map((tour) => `  - ${tour.id} (${tour.name})`).join("\n")}
  `)
}

function printResults(results: StepResult[] | Record<string, StepResult[]>): void {
  console.log("\n📊 Screenshot Generation Results:")
  console.log("=".repeat(50))

  if (Array.isArray(results)) {
    // Single tour results
    const successful = results.filter((r) => r.success).length
    const total = results.length

    console.log(`Tour: ${results[0]?.tourId || "Unknown"}`)
    console.log(`Success: ${successful}/${total} screenshots`)

    results.forEach((result) => {
      const status = result.success ? "✅" : "❌"
      const message = result.success
        ? `Step ${result.stepIndex + 1} (${result.stepId})`
        : `Step ${result.stepIndex + 1} (${result.stepId}) - ${result.error}`
      console.log(`  ${status} ${message}`)
    })
  } else {
    // All tours results
    let totalSuccessful = 0
    let totalSteps = 0

    Object.entries(results).forEach(([tourId, stepResults]) => {
      const successful = stepResults.filter((r) => r.success).length
      const total = stepResults.length
      totalSuccessful += successful
      totalSteps += total

      console.log(`\nTour: ${tourId}`)
      console.log(`Success: ${successful}/${total} screenshots`)

      stepResults.forEach((result) => {
        if (result.stepIndex >= 0) {
          const status = result.success ? "✅" : "❌"
          const message = result.success
            ? `Step ${result.stepIndex + 1} (${result.stepId})`
            : `Step ${result.stepIndex + 1} (${result.stepId}) - ${result.error}`
          console.log(`  ${status} ${message}`)
        }
      })
    })

    console.log("\n" + "=".repeat(50))
    console.log(`📈 Overall: ${totalSuccessful}/${totalSteps} screenshots generated successfully`)
  }
}

async function main(): Promise<void> {
  const options = parseArgs()

  if (options.help) {
    printHelp()
    return
  }

  if (!options.tour && !options.all) {
    console.error("❌ Please specify --tour=<id> or --all")
    console.log("Use --help for more information")
    process.exit(1)
  }

  const generator = new TourScreenshotGenerator(options)

  try {
    await generator.initialize()

    let results: StepResult[] | Record<string, StepResult[]>

    if (options.tour) {
      results = await generator.generateTourScreenshots(options.tour)
    } else {
      results = await generator.generateAllTourScreenshots()
    }

    printResults(results)
  } catch (error) {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  } finally {
    await generator.cleanup()
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { TourScreenshotGenerator, ScreenshotOptions, StepResult }
