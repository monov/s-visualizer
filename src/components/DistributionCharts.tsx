import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CategoryDistribution, DifficultyDistribution } from '@/types/trivia'

interface DistributionChartsProps {
  categoryDistribution: CategoryDistribution[]
  difficultyDistribution: DifficultyDistribution[]
  chartView: 'pie' | 'bar'
}

const DIFFICULTY_COLORS = {
  easy: '#22c55e',    // Zangori
  medium: '#f59e0b',  // To'q sariq
  hard: '#ef4444'     // Qizil
}


export function DistributionCharts({ 
  categoryDistribution, 
  difficultyDistribution, 
  chartView
}: DistributionChartsProps) {
  const formatCategoryName = (name: string) => {
    if (name.length > 15) {
      return name.substring(0, 15) + '...'
    }
    return name
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Questions: {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary">
            {payload[0].value} questions ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Questions by Category</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
                tickFormatter={formatCategoryName}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(127, 127, 127, 0.3)' }}  content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                fill="rgb(0, 153, 255)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Difficulty Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={350}>
            {chartView === 'pie' ? (
              <PieChart >
                <Pie
                  data={difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage == 0 ? "" : `${percentage}%`}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="difficulty"
                  animationDuration={300}
                  animationBegin={0} 
                >
                  {difficultyDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={DIFFICULTY_COLORS[entry.difficulty as keyof typeof DIFFICULTY_COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={difficultyDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="difficulty" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(127, 127, 127, 0.3)' }} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                >
                  {difficultyDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={DIFFICULTY_COLORS[entry.difficulty as keyof typeof DIFFICULTY_COLORS]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
