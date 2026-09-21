import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

export interface Room {
  room_id: number
  estate_id?: number | null
  room_type?: string | null
  size?: number | string | null
  price?: number | null
  bedroom?: number | null
  bathroom?: number | null
  pet?: boolean | string | null
  pet_allow?: boolean | string | null
  pet_type?: string | null
  furniture?: string | null
  electronic?: string | null
  parking?: boolean | string | null
  distance?: number | string | null
  insurance?: number | null
  advance?: number | null
  remark?: string | null
  link_post?: string | null
  contact_line?: string | null
  contact_facebook?: string | null
  contact_tel?: string | null
  [key: string]: any
}

export interface Estate {
  estate_id: number
  e_name?: string | null
  location?: string | null
  type?: string | null
  [key: string]: any
}

export interface JoinedRoomEstate extends Room {
  estate?: Estate | null
}

export const ROOM_COLUMNS = [
  'room_id',
  'estate_id',
  'room_type',
  'size',
  'price',
  'bedroom',
  'bathroom',
  'pet',
  'pet_allow',
  'pet_type',
  'furniture',
  'electronic',
  'parking',
  'distance',
  'insurance',
  'advance',
  'remark',
  'link_post',
  'contact_line',
  'contact_facebook',
  'contact_tel',
  'room_number',
] as const

export const ESTATE_COLUMNS = [
  'estate_id',
  'e_name',
  'location',
  'type',
] as const

export interface JoinedColumnDef {
  key: string
  label: string
  source: 'room' | 'estate'
}

export const JOINED_COLUMNS: JoinedColumnDef[] = [
  { key: 'room_id', label: 'room_id', source: 'room' },
  { key: 'estate.e_name', label: 'estate.e_name', source: 'estate' },
  { key: 'estate.location', label: 'estate.location', source: 'estate' },
  { key: 'estate.type', label: 'estate.type', source: 'estate' },
  { key: 'room_type', label: 'room_type', source: 'room' },
  { key: 'size', label: 'size', source: 'room' },
  { key: 'price', label: 'price', source: 'room' },
  { key: 'bedroom', label: 'bedroom', source: 'room' },
  { key: 'bathroom', label: 'bathroom', source: 'room' },
  { key: 'pet', label: 'pet', source: 'room' },
  { key: 'pet_allow', label: 'pet_allow', source: 'room' },
  { key: 'pet_type', label: 'pet_type', source: 'room' },
  { key: 'furniture', label: 'furniture', source: 'room' },
  { key: 'electronic', label: 'electronic', source: 'room' },
  { key: 'parking', label: 'parking', source: 'room' },
  { key: 'distance', label: 'distance', source: 'room' },
  { key: 'insurance', label: 'insurance', source: 'room' },
  { key: 'advance', label: 'advance', source: 'room' },
  { key: 'remark', label: 'remark', source: 'room' },
  { key: 'link_post', label: 'link_post', source: 'room' },
  { key: 'contact_line', label: 'contact_line', source: 'room' },
  { key: 'contact_facebook', label: 'contact_facebook', source: 'room' },
  { key: 'contact_tel', label: 'contact_tel', source: 'room' },
  { key: 'room_number', label: 'room_number', source: 'room' },
]

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [estates, setEstates] = useState<Estate[]>([])
  const [joinedRows, setJoinedRows] = useState<JoinedRoomEstate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [roomsRes, estatesRes, joinedRes] = await Promise.all([
        supabase.from('room').select(),
        supabase.from('estate').select(),
        supabase.from('room').select('*, estate(*)'),
      ])

      if (roomsRes.data) {
        setRooms(roomsRes.data)
      }
      if (estatesRes.data) {
        setEstates(estatesRes.data)
      }
      if (joinedRes.data) {
        setJoinedRows(joinedRes.data)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  function renderCellValue(row: any, colKey: string) {
    if (colKey.startsWith('estate.')) {
      const field = colKey.replace('estate.', '')
      if (!row.estate) {
        return <span className="text-zinc-400 dark:text-zinc-600 italic">null</span>
      }
      const val = (row.estate as any)[field]
      if (val === null || val === undefined) {
        return <span className="text-zinc-400 dark:text-zinc-600 italic">null</span>
      }
      return typeof val === 'object' ? JSON.stringify(val) : String(val)
    }

    const val = (row as any)[colKey]
    if (val === null || val === undefined) {
      return <span className="text-zinc-400 dark:text-zinc-600 italic">null</span>
    }
    return typeof val === 'object' ? JSON.stringify(val) : String(val)
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-14">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Database Tables & Joins
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Live Supabase schema inspection for <code className="font-mono text-purple-600 dark:text-purple-400">public.room</code>, <code className="font-mono text-indigo-600 dark:text-indigo-400">public.estate</code>, and relational joins.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#rooms-section"
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            Rooms ({ROOM_COLUMNS.length} cols)
          </a>
          <a
            href="#estates-section"
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            Estates ({ESTATE_COLUMNS.length} cols)
          </a>
          <a
            href="#joined-section"
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs hover:opacity-95 transition-opacity"
          >
            Joined ({JOINED_COLUMNS.length} cols)
          </a>
          <Link
            to="/insert"
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition-colors"
          >
            + Insert Record
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: PUBLIC.ROOM                                    */}
      {/* ========================================================= */}
      <section id="rooms-section" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                1. public.room
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Individual room listings and property features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {ROOM_COLUMNS.length} Columns
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {rooms.length} Rows
            </span>
          </div>
        </div>

        {/* Always Visible Room Columns Badges */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
            Columns in public.room ({ROOM_COLUMNS.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ROOM_COLUMNS.map((col) => (
              <span
                key={col}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* Always Visible Room Table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[1200px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  {ROOM_COLUMNS.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold font-mono tracking-wider text-zinc-700 dark:text-zinc-300 uppercase whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={ROOM_COLUMNS.length}
                      className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      <div className="inline-block animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full mr-2 align-middle"></div>
                      Loading room data...
                    </td>
                  </tr>
                ) : rooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={ROOM_COLUMNS.length}
                      className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      <p className="font-medium">No rows found in table <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">public.room</code></p>
                      <p className="text-xs mt-1 text-zinc-400">All 21 column headers are displayed above.</p>
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr
                      key={room.room_id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {ROOM_COLUMNS.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-3 whitespace-nowrap text-zinc-800 dark:text-zinc-200 font-mono text-xs"
                        >
                          {renderCellValue(room, col)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: PUBLIC.ESTATE                                  */}
      {/* ========================================================= */}
      <section id="estates-section" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                2. public.estate
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Real estate projects, buildings, and development locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {ESTATE_COLUMNS.length} Columns
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {estates.length} Rows
            </span>
          </div>
        </div>

        {/* Always Visible Estate Columns Badges */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
            Columns in public.estate ({ESTATE_COLUMNS.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {ESTATE_COLUMNS.map((col) => (
              <span
                key={col}
                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* Always Visible Estate Table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  {ESTATE_COLUMNS.map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold font-mono tracking-wider text-zinc-700 dark:text-zinc-300 uppercase whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={ESTATE_COLUMNS.length}
                      className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      <div className="inline-block animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full mr-2 align-middle"></div>
                      Loading estate data...
                    </td>
                  </tr>
                ) : estates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={ESTATE_COLUMNS.length}
                      className="px-4 py-10 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      <p className="font-medium">No rows found in table <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">public.estate</code></p>
                      <p className="text-xs mt-1 text-zinc-400">All 4 column headers are displayed above.</p>
                    </td>
                  </tr>
                ) : (
                  estates.map((estate) => (
                    <tr
                      key={estate.estate_id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {ESTATE_COLUMNS.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-3 whitespace-nowrap text-zinc-800 dark:text-zinc-200 font-mono text-xs"
                        >
                          {renderCellValue(estate, col)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: JOINED (ROOM ⋈ ESTATE ON ESTATE_ID)            */}
      {/* ========================================================= */}
      <section id="joined-section" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                3. Joined: room ⋈ estate
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Full join query: <code className="font-mono text-emerald-600 dark:text-emerald-400">supabase.from('room').select('*, estate(*)')</code> on <code className="font-mono text-zinc-700 dark:text-zinc-300">room.estate_id = estate.estate_id</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {JOINED_COLUMNS.length} Columns Total
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {joinedRows.length} Joined Rows
            </span>
          </div>
        </div>

        {/* Always Visible Joined Columns Badges */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              All Columns in Joined View ({JOINED_COLUMNS.length})
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> room (21)
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> estate (4)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {JOINED_COLUMNS.map((col) => (
              <span
                key={col.key}
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${col.source === 'estate'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60'
                  }`}
              >
                {col.label}
              </span>
            ))}
          </div>
        </div>

        {/* Always Visible Joined Data Table */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[1600px]">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  {JOINED_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={`px-4 py-3 text-xs font-semibold font-mono tracking-wider uppercase whitespace-nowrap ${col.source === 'estate'
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'text-zinc-700 dark:text-zinc-300'
                        }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={JOINED_COLUMNS.length}
                      className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      <div className="inline-block animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full mr-2 align-middle"></div>
                      Executing join query...
                    </td>
                  </tr>
                ) : joinedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={JOINED_COLUMNS.length}
                      className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400"
                    >
                      <p className="font-medium text-base text-zinc-800 dark:text-zinc-200">
                        No rows found in joined query
                      </p>
                      <p className="text-xs mt-1.5 text-zinc-500 max-w-md mx-auto">
                        All <span className="font-semibold text-zinc-700 dark:text-zinc-300">25 column headers</span> (21 from <code className="font-mono">room</code> and 4 from <code className="font-mono">estate</code>) are displayed above. Once you insert records with matching <code className="font-mono">estate_id</code>, joined rows will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  joinedRows.map((row) => (
                    <tr
                      key={row.room_id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {JOINED_COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 whitespace-nowrap font-mono text-xs ${col.source === 'estate'
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-200 font-medium'
                            : 'text-zinc-800 dark:text-zinc-200'
                            }`}
                        >
                          {renderCellValue(row, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
