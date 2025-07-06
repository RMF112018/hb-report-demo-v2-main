#!/usr/bin/env node

/**
 * Debug Dashboard Layouts
 * Tests the exact loading mechanism used in the browser
 */

const http = require("http")

// Test layout loading for project-executive role
async function testLayoutLoading() {
  console.log("🧪 Testing Dashboard Layout Loading...\n")

  const layoutFiles = [
    { filename: "project-executive-layout.json", displayName: "Portfolio" },
    { filename: "project-executive-financial-layout.json", displayName: "Financial Review" },
  ]

  const baseUrl = "http://localhost:3000/data/mock/layouts/"

  for (const file of layoutFiles) {
    const url = `${baseUrl}${file.filename}`
    console.log(`🌐 Testing: ${url}`)

    try {
      const response = await fetchUrl(url)
      console.log(`✅ ${file.filename}: Status ${response.statusCode}`)

      if (response.statusCode === 200) {
        try {
          const data = JSON.parse(response.data)
          console.log(`   Layout ID: ${data.id}`)
          console.log(`   Cards: ${data.cards?.length || 0}`)
          console.log(`   Role: ${data.role}`)
        } catch (parseError) {
          console.log(`   ❌ JSON Parse Error: ${parseError.message}`)
        }
      } else {
        console.log(`   ❌ HTTP Error: ${response.statusCode}`)
      }
    } catch (error) {
      console.log(`   ❌ Request Error: ${error.message}`)
    }

    console.log("")
  }
}

// Simple HTTP request function
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let data = ""

      response.on("data", (chunk) => {
        data += chunk
      })

      response.on("end", () => {
        resolve({
          statusCode: response.statusCode,
          data: data,
        })
      })
    })

    request.on("error", (error) => {
      reject(error)
    })

    request.setTimeout(5000, () => {
      request.destroy()
      reject(new Error("Request timeout"))
    })
  })
}

// Test role mapping
function testRoleMapping() {
  console.log("👥 Testing Role Mapping...\n")

  const roles = ["executive", "project-executive", "project-manager", "estimator", "admin"]

  roles.forEach((role) => {
    const layoutFiles = getLayoutFilesForRole(role)
    console.log(
      `${role}:`,
      layoutFiles.map((f) => f.filename)
    )
  })

  console.log("")
}

// Mirror the exact function from the hook
function getLayoutFilesForRole(role) {
  switch (role) {
    case "executive":
      return [
        { filename: "executive-layout.json", displayName: "Overview" },
        { filename: "executive-financial-layout.json", displayName: "Financial Review" },
      ]
    case "project-executive":
      return [
        { filename: "project-executive-layout.json", displayName: "Portfolio" },
        { filename: "project-executive-financial-layout.json", displayName: "Financial Review" },
      ]
    case "project-manager":
      return [
        { filename: "project-manager-layout.json", displayName: "Projects" },
        { filename: "project-manager-financial-layout.json", displayName: "Financial Review" },
      ]
    case "estimator":
      return [{ filename: "estimator-layout.json", displayName: "Dashboard" }]
    case "admin":
      return [{ filename: "it-layout.json", displayName: "IT Command Center" }]
    default:
      return [{ filename: "executive-layout.json", displayName: "Dashboard" }]
  }
}

// Run tests
async function runTests() {
  testRoleMapping()
  await testLayoutLoading()

  console.log("==================================================")
  console.log("✅ Debug tests completed!")
  console.log("")
  console.log("If layouts are loading correctly here but failing in the browser,")
  console.log("check the browser console for the debugging output we added.")
}

runTests().catch(console.error)
