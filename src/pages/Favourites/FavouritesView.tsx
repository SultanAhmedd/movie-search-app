import { useFavouritesViewModel } from './useFavouritesViewModel'
import MovieCard from '../../components/MovieCard/MovieCard'
import '../Home/Home.css'

function FavouritesView() {
  const { favourites, loading, error, removeMovie } = useFavouritesViewModel()

  return (
    <div className="home-view">
      {loading && <p className="status-message">Loading favourites…</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && favourites.length === 0 && (
        <p className="status-message">
          No favourites yet. Star a movie on the Home page to save it here.
        </p>
      )}

      <div className="movie-grid">
        {favourites.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavourite
            onFavourite={() => {}}
            onRemove={removeMovie}
          />
        ))}
      </div>
    </div>
  )
}

export default FavouritesView
