import { GridRow } from "@/components/ui/protected-grid"

export interface GeneralConditionsRow extends GridRow {
  rowType?: "section" | "subtotal" | "data"
  description: string
  quantity?: number
  unit?: string
  unitCost?: number
  constCost?: number
  percentTime?: number
  remarks?: string
  customizedRate?: number
  laborRateFY2025?: number
  total?: number
}

// Field Labor - Construction Dataset
export const gcFieldLaborConstruction: GeneralConditionsRow[] = [
  {
    id: "pe",
    rowType: "data",
    description: "Project Executive",
    quantity: 39,
    unit: "wks",
    unitCost: 2554,
    constCost: 2554 * 39,
    percentTime: 100,
    remarks: "Full time project executive",
    customizedRate: 2554,
    laborRateFY2025: 2554,
    total: 2554 * 39,
  },
  {
    id: "spm",
    rowType: "data",
    description: "Senior Project Manager",
    quantity: 39,
    unit: "wks",
    unitCost: 2154,
    constCost: 2154 * 39,
    percentTime: 100,
    remarks: "Full time senior PM",
    customizedRate: 2154,
    laborRateFY2025: 2154,
    total: 2154 * 39,
  },
  {
    id: "pm",
    rowType: "data",
    description: "Project Manager",
    quantity: 39,
    unit: "wks",
    unitCost: 1854,
    constCost: 1854 * 39,
    percentTime: 100,
    remarks: "Full time project manager",
    customizedRate: 1854,
    laborRateFY2025: 1854,
    total: 1854 * 39,
  },
]

// Field Labor - Close Out Dataset
export const gcFieldLaborCloseOut: GeneralConditionsRow[] = [
  {
    id: "closeout-pm",
    rowType: "data",
    description: "Close Out Project Manager",
    quantity: 12,
    unit: "wks",
    unitCost: 1854,
    constCost: 1854 * 12,
    percentTime: 50,
    remarks: "Part time close out PM",
    customizedRate: 1854,
    laborRateFY2025: 1854,
    total: 1854 * 12,
  },
  {
    id: "closeout-admin",
    rowType: "data",
    description: "Close Out Administrator",
    quantity: 12,
    unit: "wks",
    unitCost: 1254,
    constCost: 1254 * 12,
    percentTime: 75,
    remarks: "Part time close out admin",
    customizedRate: 1254,
    laborRateFY2025: 1254,
    total: 1254 * 12,
  },
]

// Field Office - Contractor Dataset
export const gcFieldOfficeContractor: GeneralConditionsRow[] = [
  {
    id: "field-office",
    rowType: "data",
    description: "Field Office Setup",
    quantity: 1,
    unit: "ls",
    unitCost: 25000,
    constCost: 25000,
    percentTime: undefined,
    remarks: "Initial field office setup",
    customizedRate: undefined,
    laborRateFY2025: undefined,
    total: 25000,
  },
  {
    id: "office-equipment",
    rowType: "data",
    description: "Office Equipment",
    quantity: 1,
    unit: "ls",
    unitCost: 15000,
    constCost: 15000,
    percentTime: undefined,
    remarks: "Computers, furniture, etc.",
    customizedRate: undefined,
    laborRateFY2025: undefined,
    total: 15000,
  },
]

// Temporary Utilities Dataset
export const gcTemporaryUtilities: GeneralConditionsRow[] = [
  {
    id: "temp-power",
    rowType: "data",
    description: "Temporary Power",
    quantity: 39,
    unit: "wks",
    unitCost: 500,
    constCost: 500 * 39,
    percentTime: undefined,
    remarks: "Weekly temporary power cost",
    customizedRate: undefined,
    laborRateFY2025: undefined,
    total: 500 * 39,
  },
  {
    id: "temp-water",
    rowType: "data",
    description: "Temporary Water",
    quantity: 39,
    unit: "wks",
    unitCost: 200,
    constCost: 200 * 39,
    percentTime: undefined,
    remarks: "Weekly temporary water cost",
    customizedRate: undefined,
    laborRateFY2025: undefined,
    total: 200 * 39,
  },
  {
    id: "temp-phone",
    rowType: "data",
    description: "Temporary Phone/Internet",
    quantity: 39,
    unit: "wks",
    unitCost: 150,
    constCost: 150 * 39,
    percentTime: undefined,
    remarks: "Weekly temporary communications",
    customizedRate: undefined,
    laborRateFY2025: undefined,
    total: 150 * 39,
  },
]
