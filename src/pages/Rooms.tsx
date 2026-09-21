import { useState, useEffect } from 'react'
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
] as const

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getRooms() {
      setLoading(true)
      const { data: rooms } = await supabase.from('room').select()

      if (rooms) {
        setRooms(rooms)
      }
      setLoading(false)
    }

    getRooms()
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Rooms Table
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Connected to Supabase table <code className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-mono text-xs font-semibold">public.room</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            {ROOM_COLUMNS.length} Columns
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            {rooms.length} Rows
          </span>
        </div>
      </div>

      {/* Always Visible Column Names Badges */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
          Table Columns ({ROOM_COLUMNS.length})
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

      {/* Always Visible Table View */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[1200px]">
            {/* Table Header: Column Names ALWAYS Shown */}
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

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={ROOM_COLUMNS.length}
                    className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full mr-2 align-middle"></div>
                    Loading data from Supabase...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={ROOM_COLUMNS.length}
                    className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    <p className="font-medium">No rows found in table <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">public.room</code></p>
                    <p className="text-xs mt-1 text-zinc-400">All column headers are displayed above. Once you insert data in Supabase, rows will appear here.</p>
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
                        {room[col] !== null && room[col] !== undefined
                          ? String(room[col])
                          : <span className="text-zinc-400 dark:text-zinc-600 italic">null</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
