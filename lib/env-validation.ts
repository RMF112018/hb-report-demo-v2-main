/**
 * Environment variable validation using Zod
 * Ensures all required environment variables are present and properly typed
 *
 * @module EnvValidation
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

import { z } from "zod"

/**
 * Environment variable schema for production deployment
 */
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default("HB Report Demo"),

  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),

  // Database
  DATABASE_URL: z.string().url().optional(),

  // API Keys (optional for demo)
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  API_KEY: z.string().optional(),

  // External Services
  MICROSOFT_GRAPH_CLIENT_ID: z.string().optional(),
  MICROSOFT_GRAPH_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_GRAPH_TENANT_ID: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Security
  CORS_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),

  // Feature Flags
  ENABLE_ANALYTICS: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  ENABLE_DEBUG_MODE: z
    .string()
    .default("false")
    .transform((val) => val === "true"),

  // Build Configuration
  NEXT_PUBLIC_VERSION: z.string().default("3.0.0"),
  NEXT_PUBLIC_BUILD_DATE: z.string().optional(),
})

/**
 * Environment variable types
 */
export type EnvConfig = z.infer<typeof envSchema>

/**
 * Validate and parse environment variables
 * @returns Validated environment configuration
 */
export function validateEnv(): EnvConfig {
  try {
    const env = envSchema.parse(process.env)

    // Log validation success
    console.info("✅ Environment validation successful")

    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:")
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`)
      })
    } else {
      console.error("❌ Environment validation failed:", error)
    }

    // In development, provide helpful defaults
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️  Using development defaults for missing environment variables")
      return {
        NODE_ENV: "development",
        NEXT_PUBLIC_APP_NAME: "HB Report Demo",
        LOG_LEVEL: "debug",
        ENABLE_ANALYTICS: false,
        ENABLE_DEBUG_MODE: true,
        NEXT_PUBLIC_VERSION: "3.0.0",
      } as EnvConfig
    }

    // In production, throw error
    throw new Error("Environment validation failed. Please check your environment variables.")
  }
}

/**
 * Get validated environment configuration
 */
export const env = validateEnv()

/**
 * Check if a feature is enabled
 * @param feature - Feature name
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(feature: keyof Pick<EnvConfig, "ENABLE_ANALYTICS" | "ENABLE_DEBUG_MODE">): boolean {
  return env[feature] === true
}

/**
 * Get application configuration
 * @returns Application configuration object
 */
export function getAppConfig() {
  return {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_VERSION,
    environment: env.NODE_ENV,
    debugMode: isFeatureEnabled("ENABLE_DEBUG_MODE"),
    analytics: isFeatureEnabled("ENABLE_ANALYTICS"),
    url: env.NEXT_PUBLIC_APP_URL,
  }
}
