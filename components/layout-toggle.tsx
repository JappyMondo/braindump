"use client"

import { Button } from "@/components/ui/button"
import { Eye, PencilLine } from "lucide-react"

interface LayoutToggleProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={() => onChange(!value)} title={value ? "Show Preview" : "Show Editor"}>
      {value ? <Eye className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
    </Button>
  )
}

