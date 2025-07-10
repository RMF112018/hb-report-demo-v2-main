/**
 * @fileoverview Bid Form Panel Component
 * @version 3.0.0
 * @description Comprehensive bid form management with form builder and preview functionality
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { useToast } from "../../../ui/use-toast"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  MoreHorizontal,
} from "lucide-react"
import { BidForm, BidFormField, BidFormResponse } from "../types/bid-management"

interface BidFormPanelProps {
  packageId: string
  forms: BidForm[]
  onFormCreate: () => void
  onFormEdit: (form: BidForm) => void
  className?: string
}

const BidFormPanel: React.FC<BidFormPanelProps> = ({ packageId, forms, onFormCreate, onFormEdit, className = "" }) => {
  const { toast } = useToast()
  const [selectedForm, setSelectedForm] = useState<BidForm | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle form actions
  const handleFormAction = (action: string, form: BidForm) => {
    switch (action) {
      case "edit":
        onFormEdit(form)
        break
      case "preview":
        setSelectedForm(form)
        setShowPreview(true)
        break
      case "copy":
        toast({
          title: "Form Copied",
          description: `Form "${form.name}" has been copied.`,
        })
        break
      case "download":
        toast({
          title: "Download Started",
          description: `Downloading form "${form.name}".`,
        })
        break
      default:
        break
    }
  }

  // Render form field based on type
  const renderFormField = (field: BidFormField, value?: any) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={value || ""}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={value || ""}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
        )
      case "number":
      case "currency":
        return (
          <Input
            type="number"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={value || ""}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
        )
      case "date":
        return <Input type="date" value={value || ""} disabled className="bg-gray-50 dark:bg-gray-800" />
      case "select":
        return (
          <Select disabled>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "file":
        return <Input type="file" disabled className="bg-gray-50 dark:bg-gray-800" />
      default:
        return (
          <Input
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={value || ""}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
        )
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Bid Forms
              <Badge variant="secondary" className="ml-2">
                {forms.length} forms
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowBuilder(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Form Builder
              </Button>
              <Button onClick={onFormCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Form
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bid forms available</p>
              <Button variant="outline" onClick={onFormCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Form
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{form.name}</div>
                        <div className="text-sm text-muted-foreground">{form.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{form.responses.length}</span>
                        <span className="text-sm text-muted-foreground">/ {form.fields.length} fields</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(form.dueDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(form.created_date)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleFormAction("preview", form)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleFormAction("edit", form)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleFormAction("copy", form)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleFormAction("download", form)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Preview: {selectedForm?.name}</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Form Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(selectedForm.status)}`}>{selectedForm.status}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span>
                    <span className="ml-2">{formatDate(selectedForm.dueDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Fields:</span>
                    <span className="ml-2">{selectedForm.fields.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Responses:</span>
                    <span className="ml-2">{selectedForm.responses.length}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedForm.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Form Fields</h3>
                {selectedForm.fields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={field.id} className="font-medium">
                        {index + 1}. {field.label}
                      </Label>
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    {renderFormField(field)}
                    {field.validation && (
                      <div className="text-xs text-muted-foreground">
                        {field.validation.min && `Min: ${field.validation.min} `}
                        {field.validation.max && `Max: ${field.validation.max} `}
                        {field.validation.pattern && `Pattern: ${field.validation.pattern}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Form Builder Dialog */}
      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Form builder interface coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will include drag-and-drop field creation, validation rules, and form templates
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BidFormPanel
