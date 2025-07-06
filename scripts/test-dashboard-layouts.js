#!/usr/bin/env node

/**
 * Dashboard Layout Test Script
 * Tests that all dashboard layout files are accessible and properly formatted
 */

const fs = require("fs")
const path = require("path")

const layoutsDir = path.join(__dirname, "../public/data/mock/layouts")

const expectedLayouts = [
  "executive-layout.json",
  "executive-financial-layout.json",
  "project-executive-layout.json",
  "project-executive-financial-layout.json",
  "project-manager-layout.json",
  "project-manager-financial-layout.json",
  "estimator-layout.json",
  "it-layout.json",
]

async function testLayoutFiles() {
  console.log("🧪 Testing Dashboard Layout Files...\n")

  let allTestsPassed = true

  for (const layoutFile of expectedLayouts) {
    const filePath = path.join(layoutsDir, layoutFile)

    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        console.log(`❌ ${layoutFile}: File not found`)
        allTestsPassed = false
        continue
      }

      // Check file is readable
      const content = fs.readFileSync(filePath, "utf8")
      const layout = JSON.parse(content)

      // Validate structure
      const requiredFields = ["id", "name", "description", "role", "cards"]
      const missingFields = requiredFields.filter((field) => !layout[field])

      if (missingFields.length > 0) {
        console.log(`❌ ${layoutFile}: Missing fields: ${missingFields.join(", ")}`)
        allTestsPassed = false
        continue
      }

      // Validate cards
      if (!Array.isArray(layout.cards)) {
        console.log(`❌ ${layoutFile}: Cards must be an array`)
        allTestsPassed = false
        continue
      }

      // Check each card has required fields
      for (const card of layout.cards) {
        const requiredCardFields = ["id", "type", "title", "position", "span"]
        const missingCardFields = requiredCardFields.filter((field) => !card[field])

        if (missingCardFields.length > 0) {
          console.log(`❌ ${layoutFile}: Card '${card.id}' missing fields: ${missingCardFields.join(", ")}`)
          allTestsPassed = false
          continue
        }
      }

      console.log(`✅ ${layoutFile}: Valid (${layout.cards.length} cards)`)
    } catch (error) {
      console.log(`❌ ${layoutFile}: Error - ${error.message}`)
      allTestsPassed = false
    }
  }

  console.log("\n" + "=".repeat(50))
  if (allTestsPassed) {
    console.log("✅ All dashboard layout tests passed!")
  } else {
    console.log("❌ Some dashboard layout tests failed!")
    process.exit(1)
  }
}

// Run tests
testLayoutFiles().catch(console.error)
