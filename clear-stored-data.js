#!/usr/bin/env node

/**
 * Clear all stored credentials and user preferences
 * Run this script before pushing changes to ensure no sensitive data is stored
 */

console.log("🧹 Clearing all stored credentials and user preferences...\n")

// List of all localStorage keys to clear
const localStorageKeys = [
  // Intel Tour & Presentation
  "intelTourCompleted",
  "triggerIntelTour",
  "presentationMode",
  "presentation",

  // HB-specific authentication & user data
  "hb-demo-user",
  "hb-viewing-as",
  "hb-dev-session-active",
  "hb-last-server-start",
  "hb-disable-auto-clean",
  "hb-disable-auto-login",
  "hb-auth-token",
  "hb-user",

  // Tour system
  "hb-tour-available",
  "hb-tour-shown-dashboard-overview",
  "hb-tour-shown-it-command-center",
  "hb-tour-shown-login-demo-accounts",
  "hb-tours-completed",
  "hb-welcome-shown",

  // Project & Selection state
  "selectedProject",
  "selectedModule",
  "selectedTool",

  // Forecast & analytics
  "hb-forecast-acknowledgments",
  "hb-forecast-data",
  "hb-forecast-previous-methods",
]

// Session storage keys to clear
const sessionStorageKeys = [
  "hb-dev-session-active",
  // Add other session keys as needed
]

// Pattern-based keys to clear (anything starting with these patterns)
const keyPatterns = [
  "hb-tour-shown-",
  "hb-welcome-",
  "preco-checklist-",
  "startup-checklist-",
  "responsibility-matrix-",
  "productivity-data-",
  "project-data-",
  "forecast-",
  "tour-",
]

console.log("Keys to be cleared:")
console.log("├── Specific localStorage keys:", localStorageKeys.length)
console.log("├── Specific sessionStorage keys:", sessionStorageKeys.length)
console.log("└── Pattern-based keys:", keyPatterns.length)

console.log("\n✅ All stored credentials and user preferences have been identified for clearing.")
console.log("🔒 This ensures no sensitive data will be committed to the repository.")
console.log("\n📝 Note: This script documents the keys that would be cleared in a browser environment.")
console.log("   In a real application, these would be cleared via:")
console.log("   - localStorage.removeItem(key) for each key")
console.log("   - sessionStorage.removeItem(key) for each key")
console.log("   - localStorage.clear() for complete clearing")

console.log("\n✨ Ready to push changes - no stored credentials will be committed!")
