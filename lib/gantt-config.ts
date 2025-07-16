import "@bryntum/gantt/gantt.module"
import type { GanttConfig as BryntumGanttConfig } from "@bryntum/gantt/gantt.module"

/**
 * Default columns for the Gantt view
 */
const defaultColumns: BryntumGanttConfig["columns"] = [
  { type: "wbs", text: "WBS", width: 80 },
  { type: "name", text: "Task", width: 250 },
  { type: "startdate", text: "Start" },
  { type: "enddate", text: "End" },
  { type: "duration", text: "Dur." },
  { type: "percentdone", text: "% Done", width: 100 },
  { type: "predecessor", text: "Pred." },
  { type: "successor", text: "Succ." },
  { type: "baselinestartdate", text: "Baseline Start" },
  { type: "baselineenddate", text: "Baseline End" },
]

/**
 * Default features enabled for the Gantt view
 */
const defaultFeatures: Partial<BryntumGanttConfig["features"]> = {
  baselines: true,
  dependencies: true,
  dependencyEdit: true,
  taskEdit: true,
  cellEdit: true,
  filter: true,
  filterBar: true,
  group: true,
  groupSummary: true,
  headerMenu: true,
  labels: true,
  nonWorkingTime: true,
  pdfExport: true,
  quickFind: true,
  regionResize: true,
  rowExpander: true,
  rowReorder: true,
  scheduleMenu: true,
  scheduleTooltip: true,
  search: true,
  sort: true,
  stripe: true,
  summary: true,
  taskDrag: true,
  taskDragCreate: true,
  taskMenu: true,
  taskResize: true,
  taskTooltip: true,
  timeRanges: true,
  tree: true,
}

/**
 * Build a Bryntum Gantt config object by merging defaults with overrides.
 *
 * @param tasks Array of task data
 * @param dependencies Array of dependency records
 * @param baselines Array of baseline records
 * @param featureOverrides Partial feature configuration to override defaults
 * @returns A complete Bryntum GanttConfig object
 */
export function buildGanttConfig(
  tasks: any[],
  dependencies: any[],
  baselines: any[],
  featureOverrides: Partial<BryntumGanttConfig["features"]> = {}
): BryntumGanttConfig {
  return {
    project: {
      taskStore: { data: tasks },
      dependencyStore: { data: dependencies },
      stm: { autoRecord: true },
      autoLoad: false,
    },
    columns: defaultColumns,
    features: {
      ...defaultFeatures,
      ...featureOverrides,
    },
    tbar: [{ type: "undoredo" }],
    rowHeight: 50,
    subGridConfigs: {
      locked: { flex: 1 },
      normal: { flex: 1 },
    },
    enableUndoRedoKeys: true,
    viewPreset: "weekAndDay",
  }
}
