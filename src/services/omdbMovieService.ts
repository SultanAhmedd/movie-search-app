import type { Movie, OmdbSearchResponse } from '../types/Movie'

const API_URL = 'https://www.omdbapi.com/'
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

export async function searchMovies(query: string): Promise<Movie[]> {
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`OMDb request failed with status ${response.status}`)
  }

  const data: OmdbSearchResponse = await response.json()

  if (data.Response === 'False') {
    throw new Error(data.Error || 'No movies found')
  }

  return data.Search ?? []
}
