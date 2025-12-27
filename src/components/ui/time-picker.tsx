
import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  time?: string
  onTimeChange: (time: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ time, onTimeChange, placeholder = "Select time", className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempTime, setTempTime] = React.useState(time || "")

  const handleTimeSelect = () => {
    onTimeChange(tempTime)
    setIsOpen(false)
  }

  const formatDisplayTime = (timeValue: string) => {
    if (!timeValue) return placeholder
    const [hours, minutes] = timeValue.split(':')
    const hour12 = parseInt(hours) % 12 || 12
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime(time || "")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <Input
              type="time"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleTimeSelect}>
              Select
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
