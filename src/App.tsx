import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Insert from './pages/Insert'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-zinc-900/75 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Agency
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                Supabase
              </span>
            </div>
            <nav className="flex items-center gap-1 sm:gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                Tables & Joins
              </NavLink>
              <NavLink
                to="/insert"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                + Insert Data
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/insert" element={<Insert />} />
            <Route path="/todos" element={<Navigate to="/rooms" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
