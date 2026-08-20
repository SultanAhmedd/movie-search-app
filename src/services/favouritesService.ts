import type { Movie } from '../types/Movie'

const STORAGE_KEY = 'movie-app.favourites'

function readAll(): Movie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(movies: Movie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies))
}

export async function addFavourite(movie: Movie): Promise<void> {
  const current = readAll()
  if (current.some((m) => m.imdbID === movie.imdbID)) return
  writeAll([...current, movie])
}

export async function removeFavourite(imdbID: string): Promise<void> {
  const current = readAll()
  writeAll(current.filter((m) => m.imdbID !== imdbID))
}

export async function getFavourites(): Promise<Movie[]> {
  return readAll()
}

export function isFavourite(imdbID: string): boolean {
  return readAll().some((m) => m.imdbID === imdbID)
}
