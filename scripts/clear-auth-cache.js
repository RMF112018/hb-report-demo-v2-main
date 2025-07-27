#!/usr/bin/env node

/**
 * HB Report Demo - Clear Authentication Cache Script
 *
 * This script provides instructions for clearing all cached login credentials
 * and user preferences that may cause the login screen to be bypassed.
 *
 * Usage: node scripts/clear-auth-cache.js
 */

console.log("\n🧹 HB Report Demo - Clear Authentication Cache\n")

console.log("This script will help you clear all cached authentication data.")
console.log("Please follow these steps in your browser:\n")

console.log("METHOD 1: Browser Console Commands (Recommended)")
console.log("1. Open your deployed Vercel app in the browser")
console.log("2. Open browser Developer Tools (F12 or right-click → Inspect)")
console.log("3. Go to the Console tab")
console.log("4. Copy and paste this command:\n")

console.log(`
// HB Report Demo - Complete Authentication Cache Clear
(function() {
  console.log('🧹 Clearing all HB Report authentication cache...');
  
  // Clear all localStorage data
  const localStorageKeys = [
    'hb-demo-user',
    'hb-viewing-as', 
    'selectedProject',
    'hb-forecast-data',
    'hb-forecast-acknowledgments',
    'hb-forecast-previous-methods',
    'hb-tours-completed',
    'hb-tour-available',
    'staffing-needing-filter',
    'hb-disable-auto-login',
    'hb-last-server-start',
    'hb-disable-auto-clean'
  ];
  
  // Remove predefined keys
  let clearedCount = 0;
  localStorageKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log('✓ Cleared:', key);
      clearedCount++;
    }
  });
  
  // Clear all keys with specific prefixes
  const allKeys = Object.keys(localStorage);
  let additionalCleared = 0;
  allKeys.forEach(key => {
    if (key.startsWith('report-config-') ||
        key.startsWith('hb-tour-shown-') ||
        key.startsWith('hb-welcome-') ||
        key.startsWith('responsibility-matrix-') ||
        key.startsWith('productivity-data-') ||
        key.startsWith('startup-checklist-') ||
        key.startsWith('preco-checklist-') ||
        key.startsWith('financial-hub-storage') ||
        key.startsWith('pursuits')) {
      localStorage.removeItem(key);
      additionalCleared++;
    }
  });
  
  // Clear all sessionStorage data
  sessionStorage.clear();
  console.log('✓ Cleared all sessionStorage data');
  
  // Clear cookies (if any)
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  console.log('✓ Cleared all cookies');
  
  console.log('✅ Cache clearing complete!');
  console.log('📊 Cleared ' + clearedCount + ' auth keys + ' + additionalCleared + ' additional keys');
  console.log('🔄 Refresh the page to see the login screen');
  
  // Optional: Refresh the page automatically
  if (confirm('Would you like to refresh the page now to see the login screen?')) {
    window.location.reload();
  }
})();
`)

console.log("\n5. Press Enter to execute the command")
console.log("6. Refresh the page to see the login screen\n")

console.log("METHOD 2: Browser Storage Tabs")
console.log("1. Open browser Developer Tools (F12)")
console.log("2. Go to Application tab (Chrome) or Storage tab (Firefox)")
console.log('3. Click on "Local Storage" → your domain')
console.log('4. Delete all keys that start with "hb-"')
console.log('5. Click on "Session Storage" → your domain')
console.log("6. Delete all keys")
console.log('7. Click on "Cookies" → your domain')
console.log("8. Delete all cookies")
console.log("9. Refresh the page\n")

console.log("METHOD 3: Incognito/Private Window")
console.log("1. Open an incognito/private browser window")
console.log("2. Navigate to your Vercel app")
console.log("3. This will start with a clean slate (no cached data)\n")

console.log("TROUBLESHOOTING:")
console.log("If the login screen is still bypassed after clearing cache:")
console.log("1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)")
console.log("2. Clear browser cache entirely in browser settings")
console.log("3. Try a different browser")
console.log("4. Check for browser extensions that might auto-fill login data\n")

console.log("🔗 For more help, check the authentication documentation in the project.\n")
