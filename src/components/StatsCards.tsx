import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, Layers, Target } from 'lucide-react'

interface StatsCardsProps {
  totalQuestions: number
  totalCategories: number
  totalDifficulties: number
}

export function StatsCards({ 
  totalQuestions, 
  totalCategories, 
  totalDifficulties 
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Questions',
      value: totalQuestions,
      icon: HelpCircle,
      description: 'Questions loaded from API'
    },
    {
      title: 'Categories',
      value: totalCategories,
      icon: Layers,
      description: 'Different question categories'
    },
    {
      title: 'Difficulty Levels',
      value: totalDifficulties,
      icon: Target,
      description: 'Available difficulty levels'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
