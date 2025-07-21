import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

import type { ResponsibilityTask } from "@/types/responsibility"

interface ResponsibilityExportModalProps {
  isOpen: boolean
  tasks: ResponsibilityTask[]
  roles: Array<{ key: string; name: string; color: string; description: string; enabled: boolean; category: string }>
  onClose: () => void
  onExport: (options: any) => void
}

export function ResponsibilityExportModal({ isOpen, tasks, roles, onClose, onExport }: ResponsibilityExportModalProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("pdf")
  const [includeAnnotations, setIncludeAnnotations] = useState(true)
  const [emailRecipients, setEmailRecipients] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [exportNotes, setExportNotes] = useState("")

  const handleExport = () => {
    const exportOptions = {
      format: exportFormat,
      includeAnnotations,
      emailRecipients: emailRecipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean),
      selectedRoles,
      exportNotes,
      tasks: selectedRoles.length > 0 ? tasks.filter((task) => selectedRoles.includes(task.responsible)) : tasks,
    }
    onExport(exportOptions)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Responsibility Matrix</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: "pdf" | "excel") => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filter by Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {roles
                  .filter((role) => role.enabled)
                  .map((role) => (
                    <div key={role.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={role.key}
                        checked={selectedRoles.includes(role.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRoles([...selectedRoles, role.key])
                          } else {
                            setSelectedRoles(selectedRoles.filter((r) => r !== role.key))
                          }
                        }}
                      />
                      <Label htmlFor={role.key} className="text-sm">
                        {role.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="annotations" checked={includeAnnotations} onCheckedChange={setIncludeAnnotations} />
              <Label htmlFor="annotations">Include annotations and notes</Label>
            </div>

            <div>
              <Label htmlFor="recipients">Email Recipients (comma-separated)</Label>
              <Input
                id="recipients"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="email1@company.com, email2@company.com"
              />
            </div>

            <div>
              <Label htmlFor="notes">Export Notes</Label>
              <Textarea
                id="notes"
                value={exportNotes}
                onChange={(e) => setExportNotes(e.target.value)}
                placeholder="Add any notes about this export..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
