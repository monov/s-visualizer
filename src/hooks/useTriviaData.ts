import { useEffect, useMemo, useRef, useState } from 'react'

interface TriviaQuestion {
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface TriviaResponse {
  response_code: number
  results: TriviaQuestion[]
}

export function useTriviaData() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [chartView, setChartView] = useState<'pie' | 'bar'>('pie')

  const retryTimeoutRef = useRef<number | null>(null)

  const clearRetryTimers = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }

  const fetchQuestions = async () => {
    const RETRY_SECONDS = 6
    try {
      setLoading(true)
      setError(null)
      clearRetryTimers()

      const response = await fetch('https://opentdb.com/api.php?amount=50&encode=url3986')

      if (response.status === 429) {
        retryTimeoutRef.current = window.setTimeout(() => {
          fetchQuestions()
        }, RETRY_SECONDS * 1000)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }

      const data: TriviaResponse = await response.json()

      if (data.response_code !== 0) {
        throw new Error('API returned an error')
      }

      const decodedQuestions: TriviaQuestion[] = data.results.map(({ category, difficulty }) => ({
        category: decodeURIComponent(category),
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      }))


      setQuestions(decodedQuestions)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trivia data')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
    return () => clearRetryTimers()
  }, [])


  const { categoryDistribution, difficultyDistribution, categories, difficulties } = useMemo(() => {
    const filtered = questions.filter(q => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(q.category)

      const matchesDifficulty =
        selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty)

      return matchesCategory && matchesDifficulty
    })

    const allCategories = [...new Set(questions.map(q => q.category))].sort()
    const allDifficulties = [...new Set(questions.map(q => q.difficulty))].sort()
    const totalQuestions = filtered.length

    const categoryCount: Record<string, number> = {}
    filtered.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1
    })
    const categoryDistribution = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)

    const difficultyCount: Record<string, number> = {}
    filtered.forEach(q => {
      difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1
    })
    const difficultyDistribution = allDifficulties
      .map(difficulty => ({
        difficulty,
        count: difficultyCount[difficulty] || 0,
        percentage: totalQuestions > 0
          ? Math.round(((difficultyCount[difficulty] || 0) / totalQuestions) * 100)
          : 0
      }))

    return {
      categoryDistribution,
      difficultyDistribution,
      categories: allCategories,
      difficulties: allDifficulties
    }
  }, [questions, selectedCategories, selectedDifficulties])

  const addCategory = (category: string) => {
    setSelectedCategories(prev => Array.from(new Set([...prev, category])))
  }


  const addDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => Array.from(new Set([...prev, difficulty])))
  }


  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category))
  }

  const removeDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => prev.filter(d => d !== difficulty))
  }


  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedDifficulties([])
  }

  return {
    categoryDistribution,
    difficultyDistribution,
    categories,
    difficulties,
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
    fetchQuestions
  }
}