import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHomeViewModel } from './useHomeViewModel'
import MovieCard from '../../components/MovieCard/MovieCard'
import './Home.css'

function HomeView() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const {
    movies,
    loading,
    error,
    handleSearch,
    handleHome,
    handleFavourite,
    isFavourite,
  } = useHomeViewModel()

  useEffect(() => {
    if (query.trim().length >= 2) {
      handleSearch(query)
    } else {
      handleHome()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="home-view">
      {loading && <p className="status-message">Loading movies…</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className="status-message">No movies to show.</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavourite={isFavourite(movie.imdbID)}
            onFavourite={handleFavourite}
          />
        ))}
      </div>
    </div>
  )
}

export default HomeView
