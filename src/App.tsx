
import './App.css'
import { ThemeProvider } from '@/hooks/use-theme'
import { useTriviaData } from '@/hooks/useTriviaData'
import { Toolbar } from '@/components/Toolbar'
import { StatsCards } from '@/components/StatsCards'
import { DistributionCharts } from '@/components/DistributionCharts'
import { LoadingSpinner, ErrorMessage } from '@/components/LoadingSpinner'
import { RefreshCw, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function TriviaVisualizer() {
  const {
    categories,
    difficulties,
    categoryDistribution,
    difficultyDistribution,
    selectedCategories,
    selectedDifficulties,
    addCategory,
    removeCategory,
    addDifficulty,
    removeDifficulty,
    clearAllFilters,
    chartView,
    setChartView,
    loading,
    error,
    fetchQuestions,
  } = useTriviaData()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Trivia Survey Visualizer</h2>
          <p className="text-muted-foreground mt-1">
            Explore trivia questions from Open Trivia Database
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchQuestions}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <Toolbar
        categories={categories}
        difficulties={difficulties}
        selectedCategories={selectedCategories}
        selectedDifficulties={selectedDifficulties}
        chartView={chartView}
        onCategoryAdd={addCategory}
        onCategoryRemove={removeCategory}
        onDifficultyAdd={addDifficulty}
        onDifficultyRemove={removeDifficulty}
        onClearAllFilters={clearAllFilters}
        onChartViewChange={setChartView}
      />

      <div className="space-y-8">
        <StatsCards
          totalQuestions={categoryDistribution.reduce((sum, cat) => sum + cat.count, 0)}
          totalCategories={categoryDistribution.length}
          totalDifficulties={difficultyDistribution.length}
        />

        {categoryDistribution.reduce((sum, cat) => sum + cat.count, 0) === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-muted/50 p-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    No Data to Visualize
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    The selected filters don't match any trivia questions. 
                    Try adjusting your category or difficulty selections to see charts.
                  </p>
                </div>

                {(selectedCategories.length > 0 || selectedDifficulties.length > 0) && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-medium">
                      Active filters:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedCategories.map((category) => (
                        <span key={category} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                          Category: {category.replace(/^Entertainment:\s*/, '').replace(/^Science:\s*/, '')}
                        </span>
                      ))}
                      {selectedDifficulties.map((difficulty) => (
                        <span key={difficulty} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                          Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DistributionCharts
            categoryDistribution={categoryDistribution}
            difficultyDistribution={difficultyDistribution}
            chartView={chartView}
          />
        )}
      </div>
    </div>
  )
}


function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="s-visualizer-theme">
      <div className="min-h-screen bg-background text-foreground flex justify-center items-center">
        <main className="container  px-6 py-6 ">
          <TriviaVisualizer />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
