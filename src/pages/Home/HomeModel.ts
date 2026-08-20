import { searchMovies } from '../../services/omdbMovieService'
import type { Movie } from '../../types/Movie'

const SEED_KEYWORDS = [
  'Batman',
  'Avengers',
  'Harry Potter',
  'Star Wars',
  'Spider-Man',
  'Marvel',
  'Disney',
  'Matrix',
  'Lord of the Rings',
  'Fast',
  'Mission Impossible',
  'Pixar',
  'Horror',
  'Comedy',
  'Action',
]

export async function getMovies(query: string): Promise<Movie[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    throw new Error('Search needs at least 2 characters')
  }
  return searchMovies(trimmed)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function initialMovies(): Promise<Movie[]> {
  const keywords = shuffle(SEED_KEYWORDS).slice(0, 5)

  const results = await Promise.all(
    keywords.map((keyword) => searchMovies(keyword).catch(() => []))
  )

  const merged = results.flat()

  const seen = new Set<string>()
  const unique = merged.filter((movie) => {
    if (seen.has(movie.imdbID)) return false
    seen.add(movie.imdbID)
    return true
  })

  return shuffle(unique).slice(0, 20)
}
