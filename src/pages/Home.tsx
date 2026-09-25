import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

interface RecentListing {
  room_id: number
  room_number?: string | number | null
  room_type?: string | null
  size?: number | string | null
  price?: number | null
  bedroom?: number | null
  bathroom?: number | null
  parking?: number | null
  distance?: string | null
  estate?: {
    estate_id: number
    e_name?: string | null
    type?: string | null
  } | null
}

export default function Home() {
  const [stats, setStats] = useState({
    roomsCount: 0,
    estatesCount: 0,
    condoCount: 0,
    townhomeCount: 0,
  })
  const [recentListings, setRecentListings] = useState<RecentListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true)
        const [roomsCountRes, estatesCountRes, recentRoomsRes, estatesListRes] = await Promise.all([
          supabase.from('room').select('*', { count: 'exact', head: true }),
          supabase.from('estate').select('*', { count: 'exact', head: true }),
          supabase
            .from('room')
            .select('room_id, room_number, room_type, size, price, bedroom, bathroom, parking, distance, estate(estate_id, e_name, type)')
            .order('room_id', { ascending: false })
            .limit(6),
          supabase.from('estate').select('type'),
        ])

        const rCount = roomsCountRes.count ?? 0
        const eCount = estatesCountRes.count ?? 0
        const estates = estatesListRes.data || []
        const condoC = estates.filter((e) => e.type?.toLowerCase() === 'condo').length
        const townhomeC = estates.filter((e) => e.type?.toLowerCase() === 'townhome').length

        setStats({
          roomsCount: rCount,
          estatesCount: eCount,
          condoCount: condoC,
          townhomeCount: townhomeC,
        })

        if (recentRoomsRes.data) {
          const normalized: RecentListing[] = (recentRoomsRes.data as any[]).map((r) => ({
            ...r,
            estate: Array.isArray(r.estate) ? r.estate[0] ?? null : r.estate ?? null,
          }))
          setRecentListings(normalized)
        }
      } catch (err) {
        console.error('Error fetching home stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-950/30 dark:via-zinc-900/40 dark:to-transparent border border-purple-100 dark:border-purple-900/40 p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real Estate Database & Agency Hub
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Smart Property &{' '}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Listing Management
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Centralized database platform for condo & townhome communities (<code className="font-mono text-indigo-600 dark:text-indigo-400">public.estate</code>), unit listings (<code className="font-mono text-purple-600 dark:text-purple-400">public.room</code>), and 25-column relational joins.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Link
              to="/rooms"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm hover:shadow-md hover:shadow-purple-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>Explore Tables & Joins</span>
              <span>&rarr;</span>
            </Link>
            <Link
              to="/insert"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <span>+ Add New Listing</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Pill Card */}
        <div className="w-full sm:w-72 shrink-0 p-5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Live Architecture
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              Connected
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">public.room</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">22 Columns</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">public.estate</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">4 Columns</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900/50">
              <span className="font-semibold text-purple-700 dark:text-purple-300">room ⋈ estate</span>
              <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold">25 Joined Cols</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Room Listings</span>
            <span className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {loading ? '...' : stats.roomsCount}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Units in public.room</p>
          </div>
        </div>

        {/* Total Estates */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Estate Projects</span>
            <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              {loading ? '...' : stats.estatesCount}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {loading ? '...' : `${stats.condoCount} Condos • ${stats.townhomeCount} Townhomes`}
            </p>
          </div>
        </div>

        {/* Joined Schema Fields */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Relational Joins</span>
            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              25
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Unified data columns</p>
          </div>
        </div>

        {/* Transit Connectivity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>Transit Lines</span>
            <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
              4
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">MRT • BTS • ARL • BRT</p>
          </div>
        </div>
      </section>

      {/* Core Database Sections (Matches Rooms.tsx) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Database Tables & Relational Schema
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Structured property management powered by Supabase PostgreSQL
            </p>
          </div>
          <Link
            to="/rooms"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>View all tables</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: public.room */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  22 Columns
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                public.room
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Unit listings with pricing, square meter size, bedrooms, bathrooms, and parking capacities.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Studio', '1-2 Bed', 'Duplex', 'Loft', 'Corner', 'Clubhouse'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/rooms#rooms-section"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800"
            >
              <span>Inspect Room Table</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Card 2: public.estate */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  4 Columns
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                public.estate
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Project directories classified into condo high-rises and townhome communities with point coordinates.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Condo', 'Townhome', 'e_name', 'GPS Location', 'Auto-ID'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/rooms#estates-section"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800"
            >
              <span>Inspect Estate Table</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Card 3: Relational Joins */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  room ⋈ estate
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Relational Joins
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Foreign key relationship connecting each room directly with its project name, coordinates, and development type.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['25 Joined Columns', 'Foreign Key', 'Live Schema', 'JSON/Exports'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/rooms#joined-section"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800"
            >
              <span>Inspect Joined Table</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Listings Preview (Matches Data on Rooms.tsx & Insert.tsx) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Recent Property Listings
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Latest units added to <code className="font-mono text-purple-600 dark:text-purple-400">public.room</code>
            </p>
          </div>
          <Link
            to="/insert"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors inline-flex items-center gap-1"
          >
            <span>+ Add Listing</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 text-sm">
            Loading recent listings...
          </div>
        ) : recentListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentListings.map((item) => (
              <div
                key={item.room_id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Unit #{item.room_id}
                    </span>
                    <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                      {item.room_type || 'Unit'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.estate?.e_name || (item.room_number ? `Room ${item.room_number}` : `Room #${item.room_id}`)}
                  </h4>

                  {item.estate?.type && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                      {item.estate.type} {item.room_number ? `• Unit ${item.room_number}` : ''}
                    </p>
                  )}

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                      {item.price ? `฿${Number(item.price).toLocaleString()}` : 'Price on request'}
                    </span>
                    {item.price && <span className="text-xs text-zinc-500">/mo</span>}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                  <span>{item.size ? `${item.size} sqm` : 'Size N/A'}</span>
                  <span>
                    {item.bedroom ?? 1} Bed • {item.bathroom ?? 1} Bath
                  </span>
                  <span>{item.parking ?? 0} Car</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No property listings added yet. Insert your first estate or room listing!
            </p>
            <Link
              to="/insert"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-colors"
            >
              + Create First Listing
            </Link>
          </div>
        )}
      </section>

      {/* Listing Features & Workflow (Matches Insert.tsx) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Smart Features on Insert Form
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Capabilities designed into the property insertion workflow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">⚡</span>
              Auto-Project Creation
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Type any project name. If it exists, it auto-locks to the project; if new, it automatically inserts into <code className="font-mono">public.estate</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">🚇</span>
              Split Transit Distance
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Enter distances separately for MRT, BTS, ARL, and BRT. Automatically combined into formatted text like <code className="font-mono text-[10px]">MRT 0.5 KM, BTS 1.2 KM</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">📱</span>
              Multi-Channel Contacts
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Separate inputs for Name and ID/Number across Line (<code className="font-mono text-[10px]">name/lineid</code>), Facebook (<code className="font-mono text-[10px]">name/facebook</code>), and Phone.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
