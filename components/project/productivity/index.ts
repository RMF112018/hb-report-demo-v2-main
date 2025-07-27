/**
 * @fileoverview Productivity Module Exports
 * @module productivity
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 */

export { default as ProductivityModule } from "./ProductivityModule"
export { default as TaskPanel } from "./TaskPanel"
export { default as MessageThread } from "./MessageThread"
export { default as ProductivityFeed } from "./ProductivityFeed"
export { useProductivityData } from "./hooks/useProductivityData"
export type { Task, Message, MessageThread } from "./hooks/useProductivityData"
