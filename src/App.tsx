import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import HomeView from './pages/Home/HomeView'
import FavouritesView from './pages/Favourites/FavouritesView'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/favourites" element={<FavouritesView />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
