import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      navigate('/')
      return
    }
    navigate(`/?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          🎬 MovieApp
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/favourites">Favourites</Link>
        </nav>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies…"
            aria-label="Search movies"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}

export default Header
