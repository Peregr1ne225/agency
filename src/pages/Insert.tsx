import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const ROOM_TYPES = [
  'Studio',
  '1 Bed',
  '1 Bed Plus',
  '2 Bed',
  'Duo Space',
  'Loft',
  'Duplex',
  'Corner',
  'Clubhouse',
  'General',
] as const

const ESTATE_TYPES = ['condo', 'townhome'] as const

const ELECTRONIC_OPTIONS = ['Washer', 'Refrigerater', 'conditioner'] as const

const PET_OPTIONS = ['cat', 'dog', 'etc'] as const

interface EstateItem {
  estate_id: number
  e_name: string | null
  type?: string | null
}

export default function Insert() {
  const [activeTab, setActiveTab] = useState<'estate' | 'room'>('estate')
  const [estatesList, setEstatesList] = useState<EstateItem[]>([])

  // Status feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Estate Form State (estate_id is optional - Supabase handles it)
  const [estateForm, setEstateForm] = useState({
    estate_id: '',
    e_name: '',
    type: 'condo' as 'condo' | 'townhome',
    lat: '',
    lng: '',
  })

  // Room Form State (room_id is optional - Supabase handles it)
  const [roomForm, setRoomForm] = useState({
    room_id: '',
    room_number: '',
    estate_name: '',
    new_estate_type: 'condo' as 'condo' | 'townhome',
    room_type: 'Studio',
    size: '',
    price: '',
    bedroom: '1',
    bathroom: '1',
    electronics: [] as string[],
    pets: [] as string[],
    furniture: 'Fully Furnished',
    parking: '0',
    distance_mrt: '',
    distance_bts: '',
    distance_arl: '',
    distance_brt: '',
    distance_others: '',
    insurance: '',
    advance: '',
    remark: '',
    link_post: '',
    contact_line_name: '',
    contact_line_id: '',
    contact_fb_name: '',
    contact_fb_id: '',
    contact_tel_name: '',
    contact_tel_number: '',
  })

  // Fetch estates for the dropdown/autocomplete in room form
  async function loadEstates() {
    const { data, error } = await supabase
      .from('estate')
      .select('estate_id, e_name, type')
      .order('estate_id', { ascending: true })

    if (data) {
      setEstatesList(data)
    }
    if (error) {
      console.error('Error loading estates:', error)
    }
  }

  useEffect(() => {
    loadEstates()
  }, [])

  // Check if typed estate exists or is new
  const trimmedEstateName = roomForm.estate_name.trim()
  const matchedEstate = trimmedEstateName
    ? estatesList.find((est) => est.e_name?.trim().toLowerCase() === trimmedEstateName.toLowerCase())
    : null
  const isNewEstate = trimmedEstateName.length > 0 && !matchedEstate

  // Helper: query maximum ID from a table in case identity is not configured yet
  async function getMaxId(table: 'room' | 'estate', idCol: 'room_id' | 'estate_id'): Promise<number> {
    const { data } = await supabase
      .from(table)
      .select(idCol)
      .order(idCol, { ascending: false })
      .limit(1)
    if (data && data.length > 0) {
      return ((data[0] as any)[idCol] || 0) + 1
    }
    return 1
  }

  // Handle Estate Insert
  async function handleEstateSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatusMsg(null)
    setSubmitting(true)

    // Build location point if lat/lng are provided
    let locationVal: string | null = null
    if (estateForm.lat.trim() && estateForm.lng.trim()) {
      locationVal = `(${estateForm.lat.trim()}, ${estateForm.lng.trim()})`
    }

    const payload: any = {
      e_name: estateForm.e_name.trim() || null,
      type: estateForm.type,
      location: locationVal,
    }

    if (estateForm.estate_id.trim()) {
      payload.estate_id = parseInt(estateForm.estate_id.trim(), 10)
    }

    // Attempt insert letting Supabase generate the ID
    let res = await supabase.from('estate').insert([payload]).select('estate_id, e_name')

    // If table does not have auto-increment IDENTITY yet, fallback to max(id) + 1
    if (res.error && res.error.message.includes('null value in column "estate_id"')) {
      const fallbackId = await getMaxId('estate', 'estate_id')
      payload.estate_id = fallbackId
      res = await supabase.from('estate').insert([payload]).select('estate_id, e_name')
    }

    setSubmitting(false)

    if (res.error) {
      console.error('Insert Estate Error:', res.error)
      setStatusMsg({ type: 'error', text: `Estate insert failed: ${res.error.message}` })
    } else {
      const createdId = res.data?.[0]?.estate_id ?? payload.estate_id ?? 'Auto'
      setStatusMsg({
        type: 'success',
        text: `Estate #${createdId} ("${payload.e_name || 'Unnamed'}") successfully created!`,
      })
      // Reset form
      setEstateForm({
        estate_id: '',
        e_name: '',
        type: 'condo',
        lat: '',
        lng: '',
      })
      await loadEstates()
    }
  }

  function getFormattedDistance(): string | null {
    const parts: string[] = []
    if (roomForm.distance_mrt.trim()) {
      const clean = roomForm.distance_mrt.trim().replace(/\s*km$/i, '').trim()
      parts.push(`MRT ${clean} KM`)
    }
    if (roomForm.distance_bts.trim()) {
      const clean = roomForm.distance_bts.trim().replace(/\s*km$/i, '').trim()
      parts.push(`BTS ${clean} KM`)
    }
    if (roomForm.distance_arl.trim()) {
      const clean = roomForm.distance_arl.trim().replace(/\s*km$/i, '').trim()
      parts.push(`ARL ${clean} KM`)
    }
    if (roomForm.distance_brt.trim()) {
      const clean = roomForm.distance_brt.trim().replace(/\s*km$/i, '').trim()
      parts.push(`BRT ${clean} KM`)
    }
    if (roomForm.distance_others.trim()) {
      const v = roomForm.distance_others.trim()
      if (/^\d+(\.\d+)?(\s*km)?$/i.test(v)) {
        const clean = v.replace(/\s*km$/i, '').trim()
        parts.push(`Other ${clean} KM`)
      } else {
        parts.push(v)
      }
    }
    return parts.length > 0 ? parts.join(', ') : null
  }

  function formatContact(name: string, value: string): string | null {
    const n = name.trim().replace(/\/+$/, '').trim()
    const v = value.trim().replace(/^\/+/, '').trim()
    if (n && v) {
      return `${n}/${v}`
    }
    if (v) return v
    if (n) return n
    return null
  }

  // Handle Room Insert (with automatic estate creation if new name typed)
  async function handleRoomSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatusMsg(null)
    setSubmitting(true)

    let targetEstateId: number | null = null
    let autoCreatedEstateName: string | null = null

    // 1. Resolve Estate (Existing or Auto-Create New)
    if (trimmedEstateName) {
      if (matchedEstate) {
        targetEstateId = matchedEstate.estate_id
      } else {
        // Auto-create new estate
        const newEstatePayload: any = {
          e_name: trimmedEstateName,
          type: roomForm.new_estate_type,
        }

        // Try letting Supabase generate estate_id
        let estateRes = await supabase.from('estate').insert([newEstatePayload]).select('estate_id')

        // Fallback to max(estate_id) + 1 if IDENTITY is not enabled in DB yet
        if (estateRes.error && estateRes.error.message.includes('null value in column "estate_id"')) {
          const fallbackEstateId = await getMaxId('estate', 'estate_id')
          newEstatePayload.estate_id = fallbackEstateId
          estateRes = await supabase.from('estate').insert([newEstatePayload]).select('estate_id')
        }

        if (estateRes.error) {
          console.error('Auto-create estate error:', estateRes.error)
          setStatusMsg({
            type: 'error',
            text: `Failed to auto-create estate "${trimmedEstateName}": ${estateRes.error.message}`,
          })
          setSubmitting(false)
          return
        }

        targetEstateId = estateRes.data?.[0]?.estate_id ?? newEstatePayload.estate_id
        autoCreatedEstateName = trimmedEstateName
        await loadEstates()
      }
    }

    // 2. Build Room payload
    const payload: any = {
      estate_id: targetEstateId,
      room_number: roomForm.room_number ? (isNaN(Number(roomForm.room_number)) ? roomForm.room_number : parseInt(roomForm.room_number, 10)) : null,
      room_type: roomForm.room_type,
      size: roomForm.size ? parseFloat(roomForm.size) : null,
      price: roomForm.price ? parseFloat(roomForm.price) : null,
      bedroom: roomForm.bedroom ? parseInt(roomForm.bedroom, 10) : null,
      bathroom: roomForm.bathroom ? parseInt(roomForm.bathroom, 10) : null,
      electronic: roomForm.electronics.length > 0 ? roomForm.electronics.join(', ') : null,
      pet: roomForm.pets.length > 0 ? roomForm.pets.join(', ') : null,
      pet_allow: roomForm.pets.length > 0,
      pet_type: roomForm.pets.length > 0 ? roomForm.pets.join(', ') : null,
      furniture: roomForm.furniture.trim() || null,
      parking: roomForm.parking !== '' ? (isNaN(Number(roomForm.parking)) ? 0 : parseInt(roomForm.parking, 10)) : null,
      distance: getFormattedDistance(),
      insurance: roomForm.insurance ? parseFloat(roomForm.insurance) : null,
      advance: roomForm.advance ? parseFloat(roomForm.advance) : null,
      remark: roomForm.remark.trim() || null,
      link_post: roomForm.link_post.trim() || null,
      contact_line: formatContact(roomForm.contact_line_name, roomForm.contact_line_id),
      contact_facebook: formatContact(roomForm.contact_fb_name, roomForm.contact_fb_id),
      contact_tel: formatContact(roomForm.contact_tel_name, roomForm.contact_tel_number),
    }

    if (roomForm.room_id.trim()) {
      payload.room_id = parseInt(roomForm.room_id.trim(), 10)
    }

    // Try inserting room letting Supabase generate room_id
    let roomRes = await supabase.from('room').insert([payload]).select('room_id')

    // Fallback to max(room_id) + 1 if IDENTITY is not enabled in DB yet
    if (roomRes.error && roomRes.error.message.includes('null value in column "room_id"')) {
      const fallbackRoomId = await getMaxId('room', 'room_id')
      payload.room_id = fallbackRoomId
      roomRes = await supabase.from('room').insert([payload]).select('room_id')
    }

    setSubmitting(false)

    if (roomRes.error) {
      console.error('Insert Room Error:', roomRes.error)
      setStatusMsg({ type: 'error', text: `Room insert failed: ${roomRes.error.message}` })
    } else {
      const createdRoomId = roomRes.data?.[0]?.room_id ?? payload.room_id ?? 'Auto'
      const msg = autoCreatedEstateName
        ? `✨ Auto-created estate "${autoCreatedEstateName}" (#${targetEstateId}) and inserted Room #${createdRoomId}!`
        : `Room #${createdRoomId} (${payload.room_type}) successfully created!`
      setStatusMsg({ type: 'success', text: msg })

      // Reset room form
      setRoomForm((prev) => ({
        ...prev,
        room_id: '',
        room_number: '',
        estate_name: '',
        size: '',
        price: '',
        electronics: [],
        pets: [],
        parking: '0',
        distance_mrt: '',
        distance_bts: '',
        distance_arl: '',
        distance_brt: '',
        distance_others: '',
        insurance: '',
        advance: '',
        remark: '',
        link_post: '',
        contact_line_name: '',
        contact_line_id: '',
        contact_fb_name: '',
        contact_fb_id: '',
        contact_tel_name: '',
        contact_tel_number: '',
      }))
    }
  }

  function toggleElectronic(item: string) {
    setRoomForm((prev) => {
      const exists = prev.electronics.includes(item)
      return {
        ...prev,
        electronics: exists ? prev.electronics.filter((x) => x !== item) : [...prev.electronics, item],
      }
    })
  }

  function togglePet(item: string) {
    setRoomForm((prev) => {
      const exists = prev.pets.includes(item)
      return {
        ...prev,
        pets: exists ? prev.pets.filter((x) => x !== item) : [...prev.pets, item],
      }
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Insert Records
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add new listings to <code className="font-mono text-indigo-600 dark:text-indigo-400">public.estate</code> and <code className="font-mono text-purple-600 dark:text-purple-400">public.room</code>
          </p>
        </div>
        <Link
          to="/rooms"
          className="text-xs px-3.5 py-2 rounded-xl font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          View Database Tables &rarr;
        </Link>
      </div>

      {/* Tab Switcher */}
      <div className="flex rounded-xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-md">
        <button
          type="button"
          onClick={() => {
            setActiveTab('estate')
            setStatusMsg(null)
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'estate'
              ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
        >
          1. Add Estate (Project)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('room')
            setStatusMsg(null)
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'room'
              ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
        >
          2. Add Room (Unit)
        </button>
      </div>

      {/* Feedback Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium transition-all ${statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/60'
            }`}
        >
          <div className="flex items-center justify-between">
            <span>{statusMsg.text}</span>
            {statusMsg.type === 'success' && (
              <Link to="/rooms" className="underline text-xs font-semibold ml-4">
                View in Tables &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FORM 1: ESTATE                                            */}
      {/* ========================================================= */}
      {activeTab === 'estate' && (
        <form
          onSubmit={handleEstateSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              New Estate Information
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Insert a record into <code className="font-mono text-indigo-600 dark:text-indigo-400">public.estate</code> (ID generated automatically)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* e_name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Project Name (`e_name`) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ideo Q Sukhumvit 36"
                value={estateForm.e_name}
                onChange={(e) => setEstateForm({ ...estateForm, e_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Estate Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Estate Type <span className="text-red-500">*</span>
              </label>
              <select
                value={estateForm.type}
                onChange={(e) => setEstateForm({ ...estateForm, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-mono"
              >
                {ESTATE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Custom estate_id */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Custom Estate ID <span className="text-zinc-400 font-normal">(Optional - auto if blank)</span>
              </label>
              <input
                type="number"
                placeholder="Leave blank for auto ID"
                value={estateForm.estate_id}
                onChange={(e) => setEstateForm({ ...estateForm, estate_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>

            {/* Location (lat & lng for Postgres Point) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Latitude
                </label>
                <input
                  type="text"
                  placeholder="e.g. 13.7234"
                  value={estateForm.lat}
                  onChange={(e) => setEstateForm({ ...estateForm, lat: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Longitude
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100.5792"
                  value={estateForm.lng}
                  onChange={(e) => setEstateForm({ ...estateForm, lng: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Inserting...' : 'Insert Estate'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* FORM 2: ROOM                                              */}
      {/* ========================================================= */}
      {activeTab === 'room' && (
        <form
          onSubmit={handleRoomSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              New Room Listing
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Insert a record into <code className="font-mono text-purple-600 dark:text-purple-400">public.room</code> (ID generated automatically)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* room_number */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 402/15 or 101"
                value={roomForm.room_number}
                onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              />
            </div>

            {/* room_type Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Room Type <span className="text-red-500">*</span>
              </label>
              <select
                value={roomForm.room_type}
                onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer font-medium"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Custom room_id */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Custom Room ID <span className="text-zinc-400 font-normal">(Optional - auto if blank)</span>
              </label>
              <input
                type="number"
                placeholder="Leave blank for auto ID"
                value={roomForm.room_id}
                onChange={(e) => setRoomForm({ ...roomForm, room_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Linked Estate Name with Creatable / Autocomplete support */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Linked Estate (Select existing or type a new project name)
              </label>
              {matchedEstate && (
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  ✓ Matches existing Estate #{matchedEstate.estate_id} ({matchedEstate.type || 'condo'})
                </span>
              )}
              {isNewEstate && (
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-0.5 rounded-full animate-pulse">
                  ✨ Will automatically create in public.estate
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                list="estates-datalist"
                placeholder="Type or select estate name (e.g. Ideo Q Sukhumvit 36)..."
                value={roomForm.estate_name}
                onChange={(e) => setRoomForm({ ...roomForm, estate_name: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              {isNewEstate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 whitespace-nowrap">Property Type:</span>
                  <select
                    value={roomForm.new_estate_type}
                    onChange={(e) => setRoomForm({ ...roomForm, new_estate_type: e.target.value as any })}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 outline-none cursor-pointer"
                  >
                    {ESTATE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <datalist id="estates-datalist">
              {estatesList.map((est) => (
                <option key={est.estate_id} value={est.e_name || `Estate #${est.estate_id}`}>
                  #{est.estate_id} ({est.type || 'condo'})
                </option>
              ))}
            </datalist>
          </div>

          {/* Price and Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Price (THB/month)
              </label>
              <input
                type="number"
                placeholder="e.g. 18000"
                value={roomForm.price}
                onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Size (sq.m.)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 35"
                value={roomForm.size}
                onChange={(e) => setRoomForm({ ...roomForm, size: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Bedrooms, Bathrooms, Parking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                value={roomForm.bedroom}
                onChange={(e) => setRoomForm({ ...roomForm, bedroom: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={roomForm.bathroom}
                onChange={(e) => setRoomForm({ ...roomForm, bathroom: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* Parking */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Parking (Cars Allowed)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={roomForm.parking}
                onChange={(e) => setRoomForm({ ...roomForm, parking: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Transit Distances (MRT, BTS, ARL, BRT, Others) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Distance to Transit
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Split by transit lines. Formatted automatically as <code className="font-mono text-purple-600 dark:text-purple-400">MRT __ KM, BTS __ KM...</code>
                </p>
              </div>
              {getFormattedDistance() && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">Preview:</span>
                  <span className="font-mono font-medium">{getFormattedDistance()}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* MRT */}
              <div>
                <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  MRT (KM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 0.5"
                  value={roomForm.distance_mrt}
                  onChange={(e) => setRoomForm({ ...roomForm, distance_mrt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* BTS */}
              <div>
                <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  BTS (KM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 1.2"
                  value={roomForm.distance_bts}
                  onChange={(e) => setRoomForm({ ...roomForm, distance_bts: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* ARL */}
              <div>
                <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                  ARL (KM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 2.0"
                  value={roomForm.distance_arl}
                  onChange={(e) => setRoomForm({ ...roomForm, distance_arl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-rose-500 font-mono"
                />
              </div>

              {/* BRT */}
              <div>
                <label className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  BRT (KM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 0.8"
                  value={roomForm.distance_brt}
                  onChange={(e) => setRoomForm({ ...roomForm, distance_brt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Others */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Others
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1.5 or Pier 500m"
                  value={roomForm.distance_others}
                  onChange={(e) => setRoomForm({ ...roomForm, distance_others: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Electronic Multi-Select Checkboxes */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Electronics Included:
            </label>
            <div className="flex flex-wrap gap-2">
              {ELECTRONIC_OPTIONS.map((item) => {
                const active = roomForm.electronics.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleElectronic(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${active
                        ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                  >
                    {active ? '✓ ' : '+ '} {item}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pets Multi-Select Checkboxes */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Pet Friendly:
            </label>
            <div className="flex flex-wrap gap-2">
              {PET_OPTIONS.map((item) => {
                const active = roomForm.pets.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => togglePet(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${active
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                  >
                    {active ? '✓ ' : '+ '} {item}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Insurance & Advance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Security Deposit / Insurance (THB)
              </label>
              <input
                type="number"
                placeholder="e.g. 36000"
                value={roomForm.insurance}
                onChange={(e) => setRoomForm({ ...roomForm, insurance: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Advance Payment (THB)
              </label>
              <input
                type="number"
                placeholder="e.g. 18000"
                value={roomForm.advance}
                onChange={(e) => setRoomForm({ ...roomForm, advance: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Contact Information (Line, Facebook, Phone with Name/Contact) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Contact Channels
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Saved automatically in <code className="font-mono text-purple-600 dark:text-purple-400">name/contact</code> format (e.g. <code className="font-mono text-purple-600 dark:text-purple-400">Alex/@line_id</code>, <code className="font-mono text-purple-600 dark:text-purple-400">Alex/0812345678</code>)
                </p>
              </div>
              {roomForm.contact_line_name.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    const n = roomForm.contact_line_name.trim()
                    setRoomForm((prev) => ({
                      ...prev,
                      contact_fb_name: n,
                      contact_tel_name: n,
                    }))
                  }}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium self-start sm:self-auto cursor-pointer"
                >
                  Apply "{roomForm.contact_line_name.trim()}" name to all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Line Contact */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Line Contact
                  </span>
                  {formatContact(roomForm.contact_line_name, roomForm.contact_line_id) && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 truncate max-w-[140px]" title={formatContact(roomForm.contact_line_name, roomForm.contact_line_id)!}>
                      {formatContact(roomForm.contact_line_name, roomForm.contact_line_id)}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={roomForm.contact_line_name}
                    onChange={(e) => setRoomForm({ ...roomForm, contact_line_name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Line ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @agent_line"
                    value={roomForm.contact_line_id}
                    onChange={(e) => setRoomForm({ ...roomForm, contact_line_id: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Facebook Contact */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Facebook Contact
                  </span>
                  {formatContact(roomForm.contact_fb_name, roomForm.contact_fb_id) && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 truncate max-w-[140px]" title={formatContact(roomForm.contact_fb_name, roomForm.contact_fb_id)!}>
                      {formatContact(roomForm.contact_fb_name, roomForm.contact_fb_id)}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={roomForm.contact_fb_name}
                    onChange={(e) => setRoomForm({ ...roomForm, contact_fb_name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Facebook ID / Page
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. fb.com/alex"
                    value={roomForm.contact_fb_id}
                    onChange={(e) => setRoomForm({ ...roomForm, contact_fb_id: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Phone Contact */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Phone Contact
                  </span>
                  {formatContact(roomForm.contact_tel_name, roomForm.contact_tel_number) && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 truncate max-w-[140px]" title={formatContact(roomForm.contact_tel_name, roomForm.contact_tel_number)!}>
                      {formatContact(roomForm.contact_tel_name, roomForm.contact_tel_number)}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex"
                    value={roomForm.contact_tel_name}
                    onChange={(e) => setRoomForm({ ...roomForm, contact_tel_name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 081-xxx-xxxx"
                    value={roomForm.contact_tel_number}
                    onChange={(e) => setRoomForm({ ...roomForm, contact_tel_number: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Remark & Link */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Link to Post / Listing URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={roomForm.link_post}
                onChange={(e) => setRoomForm({ ...roomForm, link_post: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Remark / Notes
              </label>
              <textarea
                rows={2}
                placeholder="Extra details, promotions, move-in conditions..."
                value={roomForm.remark}
                onChange={(e) => setRoomForm({ ...roomForm, remark: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Inserting...' : 'Insert Room'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
