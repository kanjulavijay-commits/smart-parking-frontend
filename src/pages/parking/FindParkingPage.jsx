import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Car, ChevronRight, Layers } from 'lucide-react'
import { parkingApi } from '../../api/parking'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const TYPE_COLORS = { standard: 'badge-blue', premium: 'badge-yellow', disabled: 'badge-green', ev: 'badge-green' }

export default function FindParkingPage() {
  const navigate = useNavigate()
  const [lots, setLots]         = useState([])
  const [selected, setSelected] = useState(null)
  const [slots, setSlots]       = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [slotLoading, setSlotLoading] = useState(false)

  useEffect(() => {
    parkingApi.getLots().then(({ data }) => {
      setLots(data.results ?? data)
    }).finally(() => setLoading(false))
  }, [])

  const selectLot = async (lot) => {
    setSelected(lot)
    setSlotLoading(true)
    try {
      const { data } = await parkingApi.getSlots({ lot: lot.id, status: 'available' })
      setSlots(data.results ?? data)
    } finally {
      setSlotLoading(false)
    }
  }

  const filtered = lots.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Find Parking</h1>
        <p className="text-sm text-gray-400 mt-1">Choose a lot and book your slot instantly.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          className="input pl-11"
          placeholder="Search by name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lot list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Parking Lots</h2>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={MapPin} title="No lots found" description="Try a different search term." />
          ) : (
            filtered.map((lot) => (
              <button
                key={lot.id}
                onClick={() => selectLot(lot)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === lot.id
                    ? 'bg-brand-600/10 border-brand-500/50'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-100">{lot.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{lot.address}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-emerald-400">{lot.available_slots ?? '?'} available</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-400">₹{lot.base_hourly_rate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-1" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Slot grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {selected ? `Slots — ${selected.name}` : 'Select a lot to see slots'}
          </h2>

          {!selected ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <Layers className="w-10 h-10 text-gray-700 mb-3" />
              <p className="text-sm text-gray-500">Pick a parking lot on the left to browse available slots.</p>
            </div>
          ) : slotLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : slots.length === 0 ? (
            <EmptyState icon={Car} title="No available slots" description="This lot is currently full. Try another." />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => navigate(`/book/${slot.id}`)}
                  className="p-3 bg-gray-900 border border-gray-800 hover:border-brand-500/50 hover:bg-brand-600/10 rounded-xl transition-all text-center group"
                >
                  <Car className="w-5 h-5 text-gray-500 group-hover:text-brand-400 mx-auto mb-1.5 transition-colors" />
                  <p className="text-xs font-semibold text-gray-300 group-hover:text-white">{slot.slot_number}</p>
                  <span className={`mt-1 ${TYPE_COLORS[slot.slot_type] || 'badge-blue'} text-[10px]`}>{slot.slot_type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
