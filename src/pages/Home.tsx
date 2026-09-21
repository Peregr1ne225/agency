import { useState } from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-10 max-w-2xl">
        <div className="relative mb-8 flex justify-center items-center">
          <img
            src={heroImg}
            className="w-36 sm:w-44 h-auto drop-shadow-md select-none"
            alt="Hero background"
          />
          <img
            src={reactLogo}
            className="absolute -top-1 right-2 sm:right-6 w-10 sm:w-12 h-10 sm:h-12 animate-pulse drop-shadow-sm"
            alt="React logo"
          />
          <img
            src={viteLogo}
            className="absolute bottom-2 left-2 sm:left-6 w-10 sm:w-12 h-10 sm:h-12 drop-shadow-sm transition-transform hover:scale-110"
            alt="Vite logo"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          Agency + Supabase
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
          Fast Vite & React frontend connected directly to your cloud Supabase database.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="px-5 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Count is <span className="font-mono text-purple-600 dark:text-purple-400 font-bold ml-1">{count}</span>
          </button>
          <Link
            to="/rooms"
            className="px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm hover:shadow-md hover:shadow-purple-500/20 active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            View Tables &rarr;
          </Link>
          <Link
            to="/insert"
            className="px-5 py-2.5 rounded-xl font-medium text-sm bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            + Insert Data
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-2xl border-t border-zinc-200 dark:border-zinc-800 my-8"></div>

      {/* Next Steps Grid */}
      <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 pb-12">
        {/* Documentation Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <svg
              className="w-5 h-5 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Documentation
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Guides and official resources to help you build.
          </p>
          <ul className="space-y-2.5">
            <li>
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span>Supabase Docs</span>
                <span className="text-xs text-zinc-400">&rarr;</span>
              </a>
            </li>
            <li>
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={viteLogo} className="w-4 h-4" alt="" />
                  <span>Explore Vite</span>
                </div>
                <span className="text-xs text-zinc-400">&rarr;</span>
              </a>
            </li>
            <li>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={reactLogo} className="w-4 h-4" alt="" />
                  <span>Learn React</span>
                </div>
                <span className="text-xs text-zinc-400">&rarr;</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Community Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <svg
              className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Community
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Join developers building modern web apps.
          </p>
          <ul className="space-y-2.5">
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span>GitHub</span>
                <span className="text-xs text-zinc-400">&rarr;</span>
              </a>
            </li>
            <li>
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span>Discord</span>
                <span className="text-xs text-zinc-400">&rarr;</span>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/vite_js"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span>X / Twitter</span>
                <span className="text-xs text-zinc-400">&rarr;</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
