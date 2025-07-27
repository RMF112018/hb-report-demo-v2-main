import React from "react"
import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Badge } from "../../ui/badge"
import { cn } from "../../../lib/utils"

interface EditableFieldProps {
  value: string | number
  onChange: (value: string | number) => void
  type: "text" | "number" | "select" | "date"
  options?: { label: string; value: string | number }[]
  className?: string
  placeholder?: string
  disabled?: boolean
  variant?: "default" | "outline" | "secondary"
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  type,
  options = [],
  className = "",
  placeholder = "",
  disabled = false,
  variant = "outline",
}) => {
  const handleChange = (newValue: string) => {
    if (type === "number") {
      const numValue = parseFloat(newValue)
      onChange(isNaN(numValue) ? 0 : numValue)
    } else {
      onChange(newValue)
    }
  }

  switch (type) {
    case "text":
      return (
        <Input
          type="text"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("h-8 text-sm", className)}
        />
      )

    case "number":
      return (
        <Input
          type="number"
          value={value as number}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("h-8 text-sm", className)}
        />
      )

    case "date":
      return (
        <Input
          type="date"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("h-8 text-sm", className)}
        />
      )

    case "select":
      return (
        <Select value={value as string} onValueChange={(newValue) => handleChange(newValue)} disabled={disabled}>
          <SelectTrigger className={cn("h-8 text-sm", className)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    default:
      return (
        <Badge variant={variant} className={className}>
          {value}
        </Badge>
      )
  }
}

export default EditableField
