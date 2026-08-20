import type { Movie } from '../../types/Movie'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
  isFavourite: boolean
  onFavourite: (movie: Movie) => void
  onRemove?: (imdbID: string) => void
}

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="%23E5DECB"/></svg>'

function MovieCard({ movie, isFavourite, onFavourite, onRemove }: MovieCardProps) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER

  return (
    <div className="movie-card">
      <img src={poster} alt={movie.Title} className="movie-poster" />
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p>
          {movie.Year} · {movie.Type}
        </p>
        <div className="movie-actions">
          {onRemove ? (
            <button
              className="remove-btn"
              onClick={() => onRemove(movie.imdbID)}
            >
              Remove
            </button>
          ) : (
            <button
              className={`favourite-btn ${isFavourite ? 'active' : ''}`}
              onClick={() => onFavourite(movie)}
              disabled={isFavourite}
            >
              {isFavourite ? '★ Favourited' : '☆ Favourite'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
