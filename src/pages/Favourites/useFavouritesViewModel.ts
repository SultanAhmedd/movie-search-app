import { useEffect, useState } from 'react'
import { loadFavourites, deleteFavourite } from './FavouritesModel'
import type { Movie } from '../../types/Movie'

export function useFavouritesViewModel() {
  const [favourites, setFavourites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadMovies() {
    setLoading(true)
    setError(null)
    try {
      const result = await loadFavourites()
      setFavourites(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function removeMovie(imdbID: string) {
    await deleteFavourite(imdbID)
    setFavourites((prev) => prev.filter((m) => m.imdbID !== imdbID))
  }

  useEffect(() => {
    loadMovies()
  }, [])

  return { favourites, loading, error, loadMovies, removeMovie }
}
