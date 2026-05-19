import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search, Car, ChevronRight, Layers, BarChart2, Zap } from 'lucide-react'
import { parkingApi } from '../../api/parking'
import { aiApi } from '../../api/ai'
import Spinner from '../../components/ui/Spinner'

const SLOT_TYPE_COLOR = {
  standard: 'text-gray-400 border-gray-700',
  premium:  'text-brand-400 border-brand-500/30',
  disabled: 'text-emerald-400 border-emerald-500/30',
  ev:       'text-emerald-400 border-emerald-500/30',
}

const fade = { hidden: { opacity: 0, y: 16 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }) }

export default function FindParkingPage() {
  const navigate = useNavigate()
  const [lots, setLots]         = useState([])
  const [selected, setSelected] = useState(null)
  const [slots, setSlots]       = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [slotLoading, setSlotLoading] = useState(false)
  const [rfPrediction, setRfPrediction] = useState(null)

  useEffect(() => {
    parkingApi.getLots().then(({ data }) => {
      setLots(data.results ?? data)
    }).finally(() => setLoading(false))
  }, [])

  const selectLot = async (lot) => {
    setSelected(lot)
    setSlotLoading(true)
    setRfPrediction(null)
    try {
      const [slotsRes, rfRes] = await Promise.all([
        parkingApi.getSlots({ lot: lot.id, status: 'available' }),
        aiApi.getRFPrediction({
          lot_id: lot.id,
          hour: new Date().getHours(),
          day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
        }).catch(() => null),
      ])
      setSlots(slotsRes.data.results ?? slotsRes.data)
      if (rfRes) setRfPrediction(rfRes.data)
    } finally {
      setSlotLoading(false)
    }
  }

  const filtered = lots.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.address?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// SECTOR SCAN</p>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">FIND PARKING</h1>
        <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wide">SELECT A ZONE · AI WILL FIND YOUR SLOT</p>
      </motion.div>

      {/* Search */}
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          className="w-full bg-black border border-white/8 text-white rounded-xl pl-11 pr-4 py-3 placeholder-gray-700 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all font-mono text-sm"
          placeholder="SEARCH ZONES BY NAME OR LOCATION..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lot list */}
        <div className="space-y-2">
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">PARKING ZONES ({filtered.length})</p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Spinner size="lg" />
              <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">SCANNING SECTOR...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-white/6 rounded-xl py-12 flex flex-col items-center gap-3">
              <MapPin className="w-8 h-8 text-gray-700" />
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">NO ZONES FOUND</p>
            </div>
          ) : (
            filtered.map((lot, i) => (
              <motion.button
                key={lot.id}
                custom={i}
                variants={fade}
                initial="hidden"
                animate="visible"
                onClick={() => selectLot(lot)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selected?.id === lot.id
                    ? 'bg-brand-500/8 border-brand-500/30'
                    : 'bg-black border-white/6 hover:border-white/14'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selected?.id === lot.id ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-white/3 border border-white/6'
                  }`}>
                    <MapPin className={`w-4 h-4 ${selected?.id === lot.id ? 'text-brand-400' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-mono font-bold uppercase tracking-wide ${selected?.id === lot.id ? 'text-white' : 'text-gray-300'}`}>
                      {lot.name}
                    </p>
                    <p className="text-[10px] font-mono text-gray-600 mt-0.5 truncate">{lot.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[9px] font-mono font-bold text-emerald-400">{lot.available_slots ?? '?'} AVAIL</span>
                      <span className="text-[9px] font-mono text-brand-400">₹{lot.base_hourly_rate}/HR</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${selected?.id === lot.id ? 'text-brand-400' : 'text-gray-700'}`} />
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Slot grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">
              {selected ? `SLOTS — ${selected.name}` : 'SELECT A ZONE'}
            </p>
            {rfPrediction && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold border ${
                rfPrediction.status === 'high'   ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' :
                rfPrediction.status === 'medium' ? 'bg-yellow-500/8  border-yellow-500/20  text-yellow-400'  :
                                                   'bg-red-500/8     border-red-500/20     text-red-400'
              } uppercase tracking-widest`}>
                <BarChart2 className="w-3 h-3" />
                RF: {rfPrediction.label}
              </div>
            )}
          </div>

          {!selected ? (
            <div className="border border-dashed border-white/6 rounded-xl flex flex-col items-center justify-center py-20 gap-4">
              <Layers className="w-10 h-10 text-gray-700" />
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest text-center">
                CHOOSE A ZONE ON THE LEFT<br />TO SCAN AVAILABLE SLOTS
              </p>
            </div>
          ) : slotLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner size="lg" />
              <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">SCANNING SLOTS...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="border border-dashed border-white/6 rounded-xl flex flex-col items-center justify-center py-16 gap-3">
              <Car className="w-8 h-8 text-gray-700" />
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">ZONE AT CAPACITY</p>
              <p className="text-[9px] font-mono text-gray-700">TRY ANOTHER ZONE</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot, i) => (
                <motion.button
                  key={slot.id}
                  custom={i}
                  variants={fade}
                  initial="hidden"
                  animate="visible"
                  onClick={() => navigate(`/book/${slot.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="p-3 bg-black border border-white/6 hover:border-brand-500/30 hover:bg-brand-500/5 rounded-xl transition-all group text-center"
                >
                  <Car className="w-5 h-5 text-gray-600 group-hover:text-brand-400 mx-auto mb-1.5 transition-colors" />
                  <p className="text-[10px] font-mono font-bold text-gray-300 group-hover:text-white transition-colors">{slot.slot_number}</p>
                  <span className={`text-[8px] font-mono border rounded px-1.5 py-0.5 mt-1 inline-block uppercase tracking-wide ${SLOT_TYPE_COLOR[slot.slot_type] || SLOT_TYPE_COLOR.standard}`}>
                    {slot.slot_type}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {slots.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-2 bg-brand-500/5 border border-brand-500/15 rounded-xl px-4 py-3"
            >
              <Zap className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <p className="text-[9px] font-mono text-brand-400/80 uppercase tracking-wide">
                {slots.length} SLOTS AVAILABLE · CLICK ANY SLOT TO BOOK INSTANTLY
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
