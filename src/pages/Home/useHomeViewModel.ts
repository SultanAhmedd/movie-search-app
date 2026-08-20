import { useState } from 'react'
import { getMovies, initialMovies } from './HomeModel'
import { addFavourite, isFavourite } from '../../services/favouritesService'
import type { Movie } from '../../types/Movie'

export function useHomeViewModel() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadInitial() {
    setLoading(true)
    setError(null)
    try {
      const result = await initialMovies()
      setMovies(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(query: string) {
    setLoading(true)
    setError(null)
    try {
      const result = await getMovies(query)
      setMovies(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleFavourite(movie: Movie) {
    await addFavourite(movie)
  }

  return {
    movies,
    loading,
    error,
    handleSearch,
    handleHome: loadInitial,
    handleFavourite,
    isFavourite,
  }
}
