# Authentication Cache Clearing Guide

This guide explains how to clear cached login credentials and user preferences in the HB Report Demo application when the login screen is being bypassed after deployment.

## Problem

After a successful Vercel build and deployment, the login screen may be bypassed due to cached authentication data in the browser. This happens because the application stores user credentials and preferences in browser storage for a better user experience.

## Where Data is Stored

The application caches data in several browser storage locations:

### LocalStorage Keys

- `hb-demo-user` - Main user authentication data
- `hb-viewing-as` - Presentation mode viewing role
- `selectedProject` - Currently selected project
- `hb-forecast-data` - Financial forecast data
- `hb-forecast-acknowledgments` - Forecast acknowledgments
- `hb-forecast-previous-methods` - Previous forecast methods
- `hb-tours-completed` - Completed application tours
- `hb-tour-available` - Tour availability settings
- `staffing-needing-filter` - Staffing filter preferences
- `hb-disable-auto-login` - Auto-login disable flag
- `hb-last-server-start` - Last server start timestamp
- `hb-disable-auto-clean` - Auto-clean disable flag
- Keys starting with: `report-config-`, `hb-tour-shown-`, `hb-welcome-`, `responsibility-matrix-`, `productivity-data-`, `startup-checklist-`, `preco-checklist-`, `financial-hub-storage`, `pursuits`

### SessionStorage Keys

- `hb-dev-session-active` - Development session tracking
- `hb-welcome-shown` - Welcome message display flag
- `hb-tour-shown-*` - Tour display flags

### Cookies

- Any authentication-related cookies set by the application

## Clearing Methods

### Method 1: Browser Console (Recommended)

1. Open your deployed Vercel app in the browser
2. Open browser Developer Tools (F12 or right-click → Inspect)
3. Go to the Console tab
4. Copy and paste this command:

```javascript
// HB Report Demo - Complete Authentication Cache Clear
;(function () {
  console.log("🧹 Clearing all HB Report authentication cache...")

  // Clear all localStorage data
  const localStorageKeys = [
    "hb-demo-user",
    "hb-viewing-as",
    "selectedProject",
    "hb-forecast-data",
    "hb-forecast-acknowledgments",
    "hb-forecast-previous-methods",
    "hb-tours-completed",
    "hb-tour-available",
    "staffing-needing-filter",
    "hb-disable-auto-login",
    "hb-last-server-start",
    "hb-disable-auto-clean",
  ]

  // Remove predefined keys
  let clearedCount = 0
  localStorageKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
      console.log("✓ Cleared:", key)
      clearedCount++
    }
  })

  // Clear all keys with specific prefixes
  const allKeys = Object.keys(localStorage)
  let additionalCleared = 0
  allKeys.forEach((key) => {
    if (
      key.startsWith("report-config-") ||
      key.startsWith("hb-tour-shown-") ||
      key.startsWith("hb-welcome-") ||
      key.startsWith("responsibility-matrix-") ||
      key.startsWith("productivity-data-") ||
      key.startsWith("startup-checklist-") ||
      key.startsWith("preco-checklist-") ||
      key.startsWith("financial-hub-storage") ||
      key.startsWith("pursuits")
    ) {
      localStorage.removeItem(key)
      additionalCleared++
    }
  })

  // Clear all sessionStorage data
  sessionStorage.clear()
  console.log("✓ Cleared all sessionStorage data")

  // Clear cookies (if any)
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
  })
  console.log("✓ Cleared all cookies")

  console.log("✅ Cache clearing complete!")
  console.log("📊 Cleared " + clearedCount + " auth keys + " + additionalCleared + " additional keys")
  console.log("🔄 Refresh the page to see the login screen")

  // Optional: Refresh the page automatically
  if (confirm("Would you like to refresh the page now to see the login screen?")) {
    window.location.reload()
  }
})()
```

5. Press Enter to execute the command
6. Refresh the page to see the login screen

### Method 2: Browser Storage Tabs

1. Open browser Developer Tools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Click on "Local Storage" → your domain
4. Delete all keys that start with "hb-"
5. Click on "Session Storage" → your domain
6. Delete all keys
7. Click on "Cookies" → your domain
8. Delete all cookies
9. Refresh the page

### Method 3: Incognito/Private Window

1. Open an incognito/private browser window
2. Navigate to your Vercel app
3. This will start with a clean slate (no cached data)

### Method 4: NPM Script

If you have access to the project locally:

```bash
npm run clear-auth
```

This runs the `scripts/clear-auth-cache.js` script which provides detailed instructions.

### Method 5: Development Component (Development Only)

In development mode, a "Clear Auth Cache" button appears in the bottom-right corner of the application. This button:

- Only appears in development environment
- Clears all authentication cache programmatically
- Shows a confirmation dialog before clearing
- Automatically redirects to login after clearing

## Programmatic Usage

For developers working with the codebase, utility functions are available:

```typescript
import {
  clearAllAuthCache,
  clearAuthDataOnly,
  disableAutoLogin,
  hasStoredAuthData,
  getAuthCacheStatus,
} from "@/lib/auth-cache-utils"

// Clear all cache data
const result = await clearAllAuthCache()

// Clear only auth data (preserve preferences)
const authResult = await clearAuthDataOnly()

// Disable auto-login temporarily
disableAutoLogin()

// Check if auth data exists
const hasAuth = hasStoredAuthData()

// Get detailed cache status
const status = getAuthCacheStatus()
```

## Troubleshooting

If the login screen is still bypassed after clearing cache:

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache entirely** in browser settings
3. **Try a different browser** to test
4. **Check for browser extensions** that might auto-fill login data
5. **Verify Service Workers**: Check if there are any service workers caching the application

### Advanced Troubleshooting

#### Check for Service Workers

1. Open Developer Tools
2. Go to Application tab
3. Click on "Service Workers"
4. If any are registered, click "Unregister"

#### Check Network Cache

1. Open Developer Tools
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Refresh the page

#### Check Application Cache

1. Open Developer Tools
2. Go to Application tab
3. Look for any cached resources under "Cache Storage"
4. Clear if necessary

## Prevention

To prevent automatic login in the future:

1. **Use incognito/private windows** for testing fresh user experiences
2. **Set the disable flag** in localStorage: `localStorage.setItem('hb-disable-auto-login', 'true')`
3. **Use the development clear button** during development
4. **Clear cache regularly** during testing phases

## Development Settings

### Disable Auto-Clean (Development)

To prevent automatic cache clearing during development:

```javascript
localStorage.setItem("hb-disable-auto-clean", "true")
```

### Disable Auto-Login (Testing)

To force the login screen to appear:

```javascript
localStorage.setItem("hb-disable-auto-login", "true")
```

## Security Notes

- The authentication system is designed for demo purposes only
- All user data is stored locally in the browser
- No sensitive data is transmitted or stored on servers
- Clearing cache removes all local application data
- The default password for all demo accounts is `demo123`

## Related Files

- `context/auth-context.tsx` - Main authentication context
- `lib/auth-cache-utils.ts` - Cache utility functions
- `components/dev/ClearAuthCache.tsx` - Development clear button
- `scripts/clear-auth-cache.js` - Instruction script
- `app/login/page.tsx` - Login page component
- `app/page.tsx` - Root page with authentication routing
