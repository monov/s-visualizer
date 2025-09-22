import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MultiSelect } from '@/components/ui/multi-select'
import { ThemeToggle } from '@/components/theme-toggle'
import { BarChart3, PieChart, X } from 'lucide-react'

interface ToolbarProps {
  categories: string[]
  difficulties: string[]
  selectedCategories: string[]
  selectedDifficulties: string[]
  chartView: 'pie' | 'bar'
  onCategoryAdd: (category: string) => void
  onCategoryRemove: (category: string) => void
  onDifficultyAdd: (difficulty: string) => void
  onDifficultyRemove: (difficulty: string) => void
  onClearAllFilters: () => void
  onChartViewChange: (view: 'pie' | 'bar') => void
}

export function Toolbar({
  categories,
  difficulties,
  selectedCategories,
  selectedDifficulties,
  chartView,
  onCategoryAdd,
  onCategoryRemove,
  onDifficultyAdd,
  onDifficultyRemove,
  onClearAllFilters,
  onChartViewChange,
}: ToolbarProps) {
  const formatCategoryName = (category: string) => {
    return category
      .replace(/^Entertainment:\s*/, '')
      .replace(/^Science:\s*/, '')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
  }

  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap">Category:</span>
              <MultiSelect
                placeholder="Select Categories"
                options={categories}
                selectedOptions={selectedCategories}
                onOptionToggle={(category) => {
                  if (selectedCategories.includes(category)) {
                    onCategoryRemove(category)
                  } else {
                    onCategoryAdd(category)
                  }
                }}
                formatOption={formatCategoryName}
                className="w-[200px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap">Difficulty:</span>
              <MultiSelect
                placeholder="Select Difficulty"
                options={difficulties}
                selectedOptions={selectedDifficulties}
                onOptionToggle={(difficulty) => {
                  if (selectedDifficulties.includes(difficulty)) {
                    onDifficultyRemove(difficulty)
                  } else {
                    onDifficultyAdd(difficulty)
                  }
                }}
                formatOption={(difficulty) => difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                className="w-[160px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap">Difficulty View:</span>
              <div className="flex rounded-lg border p-1">
                <Button
                  variant={chartView === 'pie' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onChartViewChange('pie')}
                  className="gap-2"
                >
                  <PieChart className="h-4 w-4" />
                  Pie
                </Button>
                <Button
                  variant={chartView === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onChartViewChange('bar')}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Bar
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>

        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            (selectedCategories.length > 0 || selectedDifficulties.length > 0) 
              ? 'max-h-96 opacity-100 mt-6' 
              : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="flex flex-col gap-3 pt-4 border-t transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAllFilters}
                className="gap-2"
              >
                <X className="h-3 w-3" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge 
                  key={`cat-${category}`} 
                  variant="default" 
                  className="gap-1"
                >
                  <span className="text-xs">Category:</span>
                  {formatCategoryName(category)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCategoryRemove(category)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedDifficulties.map((difficulty) => (
                <Badge 
                  key={`diff-${difficulty}`} 
                  variant="secondary" 
                  className="gap-1"
                >
                  <span className="text-xs">Difficulty:</span>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDifficultyRemove(difficulty)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
