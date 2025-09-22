import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MultiSelectProps {
  placeholder?: string
  options: string[]
  selectedOptions: string[]
  onOptionToggle: (option: string) => void
  formatOption?: (option: string) => string
  className?: string
}

export function MultiSelect({
  placeholder = "Select options",
  options,
  selectedOptions,
  onOptionToggle,
  formatOption = (option) => option,
  className
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between transition-all duration-200 hover:bg-accent h-9 min-w-0",
            className
          )}
        >
          <span className="text-sm text-muted-foreground truncate">{placeholder}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1" align="start" sideOffset={4} style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <div className="max-h-60 overflow-auto">
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(option)
            const isFirstSelected = isSelected && (index === 0 || !selectedOptions.includes(options[index - 1]))
            const isLastSelected = isSelected && (index === options.length - 1 || !selectedOptions.includes(options[index + 1]))
            const isMiddleSelected = isSelected && !isFirstSelected && !isLastSelected
            
            return (
              <div
                key={option}
                className={cn(
                  "relative flex cursor-default select-none items-center py-1.5 pl-2 pr-8 text-sm outline-none transition-colors",
                  // Base hover and selected states
                  "hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-primary/10 text-primary font-medium",
                  // Border radius adjustments for merged appearance - applied to both hover and selected states
                  isSelected && isFirstSelected && !isLastSelected && "rounded-t-sm rounded-b-none hover:rounded-t-sm hover:rounded-b-none",
                  isSelected && isLastSelected && !isFirstSelected && "rounded-b-sm rounded-t-none hover:rounded-b-sm hover:rounded-t-none", 
                  isSelected && isMiddleSelected && "rounded-none hover:rounded-none",
                  isSelected && isFirstSelected && isLastSelected && "rounded-sm hover:rounded-sm", // Single selected item
                  // Default rounded for non-selected items
                  !isSelected && "rounded-sm hover:rounded-sm"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onOptionToggle(option)
                }}
              >
                <span>{formatOption(option)}</span>
                {isSelected && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
