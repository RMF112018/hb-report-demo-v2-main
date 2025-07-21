/**
 * Performance Utilities for Phase 2 Optimizations
 * Provides optimized memoization, event handling, and memory leak prevention
 *
 * @module PerformanceUtils
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-29
 */

import { useCallback, useMemo, useRef, useEffect } from "react"
import type { RefObject } from "react"

/**
 * Type guard for checking if a value is a function
 * @param value - Value to check
 * @returns True if value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === "function"
}

/**
 * Type guard for checking if a value is an object
 * @param value - Value to check
 * @returns True if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Type guard for checking if a value is an array
 * @param value - Value to check
 * @returns True if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Deep equality check for objects and arrays
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (a == null || b == null) return a === b

  if (typeof a !== typeof b) return false

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }
    return true
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!keysB.includes(key)) return false
      if (!deepEqual(a[key], b[key])) return false
    }
    return true
  }

  return false
}

/**
 * Optimized memoization hook with deep equality check
 * @param factory - Function to memoize
 * @param deps - Dependencies array
 * @returns Memoized value
 */
export function useDeepMemo<T>(factory: () => T, deps: unknown[]): T {
  const prevDeps = useRef<unknown[]>([])
  const prevValue = useRef<T | null>(null)

  const hasChanged = deps.some((dep, index) => !deepEqual(dep, prevDeps.current[index]))

  if (hasChanged || prevValue.current === null) {
    prevDeps.current = deps
    prevValue.current = factory()
  }

  return prevValue.current!
}

/**
 * Optimized callback hook with deep equality check
 * @param callback - Function to memoize
 * @param deps - Dependencies array
 * @returns Memoized callback
 */
export function useDeepCallback<T extends (...args: unknown[]) => unknown>(callback: T, deps: unknown[]): T {
  const prevDeps = useRef<unknown[]>([])
  const prevCallback = useRef<T | null>(null)

  const hasChanged = deps.some((dep, index) => !deepEqual(dep, prevDeps.current[index]))

  if (hasChanged || prevCallback.current === null) {
    prevDeps.current = deps
    prevCallback.current = callback
  }

  return prevCallback.current!
}

/**
 * Hook for optimized event listener management
 * @param eventName - Event name to listen for
 * @param handler - Event handler function
 * @param element - Element to attach listener to (defaults to window)
 * @param options - Event listener options
 */
export function useEventListener<T extends Event>(
  eventName: string,
  handler: (event: T) => void,
  element?: RefObject<Element> | Element | null,
  options?: AddEventListenerOptions
): void {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const targetElement = element && "current" in element ? element.current : element
    if (!targetElement) return

    const eventListener = (event: Event) => savedHandler.current(event as T)

    targetElement.addEventListener(eventName, eventListener, options)

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options])
}

/**
 * Hook for optimized resize observer
 * @param callback - Resize callback function
 * @param element - Element to observe
 */
export function useResizeObserver(
  callback: (entries: ResizeObserverEntry[]) => void,
  element?: RefObject<Element> | Element | null
): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const targetElement = element && "current" in element ? element.current : element
    if (!targetElement) return

    const observer = new ResizeObserver((entries) => {
      savedCallback.current(entries)
    })

    observer.observe(targetElement)

    return () => {
      observer.disconnect()
    }
  }, [element])
}

/**
 * Hook for optimized intersection observer
 * @param callback - Intersection callback function
 * @param element - Element to observe
 * @param options - Intersection observer options
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  element?: RefObject<Element> | Element | null,
  options?: IntersectionObserverInit
): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const targetElement = element && "current" in element ? element.current : element
    if (!targetElement) return

    const observer = new IntersectionObserver((entries) => {
      savedCallback.current(entries)
    }, options)

    observer.observe(targetElement)

    return () => {
      observer.disconnect()
    }
  }, [element, options])
}

/**
 * Hook for optimized mutation observer
 * @param callback - Mutation callback function
 * @param element - Element to observe
 * @param options - Mutation observer options
 */
export function useMutationObserver(
  callback: (mutations: MutationRecord[]) => void,
  element?: RefObject<Element> | Element | null,
  options?: MutationObserverInit
): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const targetElement = element && "current" in element ? element.current : element
    if (!targetElement) return

    const observer = new MutationObserver((mutations) => {
      savedCallback.current(mutations)
    })

    observer.observe(targetElement, options)

    return () => {
      observer.disconnect()
    }
  }, [element, options])
}

/**
 * Debounce utility function
 * @param func - Function to debounce
 * @param wait - Debounce delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle utility function
 * @param func - Function to throttle
 * @param limit - Throttle limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Hook for optimized debounced callback
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @param deps - Dependencies array
 * @returns Debounced callback
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: unknown[] = []
): (...args: Parameters<T>) => void {
  const debouncedCallback = useMemo(() => debounce(callback, delay), [callback, delay, ...deps])

  return debouncedCallback
}

/**
 * Hook for optimized throttled callback
 * @param callback - Function to throttle
 * @param limit - Throttle limit in milliseconds
 * @param deps - Dependencies array
 * @returns Throttled callback
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number,
  deps: unknown[] = []
): (...args: Parameters<T>) => void {
  const throttledCallback = useMemo(() => throttle(callback, limit), [callback, limit, ...deps])

  return throttledCallback
}

/**
 * Performance measurement utility
 * @param name - Measurement name
 * @param fn - Function to measure
 * @returns Function result
 */
export async function measurePerformance<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()

  console.log(`Performance [${name}]: ${(end - start).toFixed(2)}ms`)

  return result
}

/**
 * Hook for performance measurement
 * @param name - Measurement name
 * @param deps - Dependencies array
 * @returns Performance measurement function
 */
export function usePerformanceMeasure(name: string, deps: unknown[] = []) {
  return useCallback(
    async <T>(fn: () => Promise<T> | T): Promise<T> => {
      return measurePerformance(name, fn)
    },
    [name, ...deps]
  )
}
