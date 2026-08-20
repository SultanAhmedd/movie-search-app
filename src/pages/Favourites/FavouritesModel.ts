import {
  getFavourites,
  removeFavourite,
} from '../../services/favouritesService'
import type { Movie } from '../../types/Movie'

export async function loadFavourites(): Promise<Movie[]> {
  return getFavourites()
}

export async function deleteFavourite(imdbID: string): Promise<void> {
  return removeFavourite(imdbID)
}
