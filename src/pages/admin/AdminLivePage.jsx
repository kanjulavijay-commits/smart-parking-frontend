import { useEffect, useState, useRef } from 'react'
import { Activity, RefreshCw, AlertTriangle, MapPin, Clock, Cpu } from 'lucide-react'
import { parkingApi } from '../../api/parking'
import { adminApi } from '../../api/admin'
import { aiApi } from '../../api/ai'
import Spinner from '../../components/ui/Spinner'

export default function AdminLivePage() {
  const [lots, setLots]         = useState([])
  const [selectedLot, setSelectedLot] = useState('')
  const [liveData, setLiveData] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    parkingApi.getLots().then(({ data }) => {
      const list = data.results ?? data
      setLots(list)
      if (list.length > 0) setSelectedLot(list[0].id)
    })
    return () => clearInterval(intervalRef.current)
  }, [])

  const fetchLive = (lotId = selectedLot) => {
    if (!lotId) return
    setLoading(true)
    adminApi.getLiveStatus(lotId)
      .then(({ data }) => { setLiveData(data); setLastRefresh(new Date()) })
      .finally(() => setLoading(false))
  }

  const runAiSimulation = () => {
    if (!selectedLot) return
    setAiLoading(true)
    aiApi.mockAnalyze(selectedLot)
      .then(({ data }) => {
        // Update live data with AI results
        setLiveData(prev => ({
          ...prev,
          results: data.results,
          slot_stats: {
            total: data.count,
            occupied: data.results.filter(r => r.is_occupied).length,
            available: data.results.filter(r => !r.is_occupied).length,
          }
        }))
        setLastRefresh(new Date())
      })
      .finally(() => setAiLoading(false))
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!selectedLot) return
    fetchLive(selectedLot)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => fetchLive(selectedLot), 30000)
    return () => clearInterval(intervalRef.current)
  }, [selectedLot])

  const triggerOverstayCheck = async () => {
    await adminApi.checkOverstays()
    fetchLive()
  }

  const slots   = liveData?.slot_stats ?? {}
  const sessions = liveData?.sessions ?? []
  const occupancy = slots.total ? Math.round((slots.occupied / slots.total) * 100) : 0

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-white">Live Monitor</h1>
            {lastRefresh && (
              <p className="text-xs text-gray-500 mt-0.5">
                Last updated {lastRefresh.toLocaleTimeString('en-IN')} · auto-refreshes every 30s
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={runAiSimulation} 
            disabled={aiLoading || !selectedLot} 
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Cpu className={`w-4 h-4 ${aiLoading ? 'animate-pulse' : ''}`} /> 
            {aiLoading ? 'Analyzing...' : 'Run AI Simulation'}
          </button>
          <button onClick={triggerOverstayCheck} className="btn-secondary flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-400" /> Check Overstays
          </button>
          <button onClick={() => fetchLive()} disabled={loading} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Lot selector */}
      <div>
        <label className="label">Select Parking Lot</label>
        <select
          className="input max-w-xs"
          value={selectedLot}
          onChange={(e) => setSelectedLot(e.target.value)}
        >
          <option value="">All Lots</option>
          {lots.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {loading && !liveData ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : liveData ? (
        <>
          {/* Slot capacity gauge */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-white">Slot Occupancy</p>
              <span className={`text-lg font-bold ${occupancy > 80 ? 'text-red-400' : occupancy > 60 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {occupancy}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  occupancy > 80 ? 'bg-red-500' : occupancy > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-100">{slots.total ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Total Slots</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{slots.available ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{slots.occupied ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Occupied</p>
              </div>
            </div>
          </div>

          {/* Visual Grid Map */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                <h2 className="font-semibold text-white">Live AI Slot Map</h2>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Vacant</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /> Occupied</div>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {liveData.results?.map((res, i) => (
                <div 
                  key={res.slot_id}
                  className={`group relative aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all hover:scale-110 shadow-lg ${
                    res.is_occupied 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-red-500/10' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/10'
                  }`}
                >
                  {i + 1}
                  
                  {/* Hover Tooltip for AI Comparison */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-2xl text-[9px]">
                      <p className="font-bold text-white border-b border-gray-800 pb-1 mb-1">AI Consensus</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>CNN:</span>
                          <span className={res.comparison?.cnn ? 'text-red-400' : 'text-emerald-400'}>{res.comparison?.cnn ? 'OCC' : 'VAC'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SVM:</span>
                          <span className={res.comparison?.svm ? 'text-red-400' : 'text-emerald-400'}>{res.comparison?.svm ? 'OCC' : 'VAC'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>R.Forest:</span>
                          <span className={res.comparison?.rf ? 'text-red-400' : 'text-emerald-400'}>{res.comparison?.rf ? 'OCC' : 'VAC'}</span>
                        </div>
                      </div>
                      <div className="mt-1.5 pt-1 border-t border-gray-800 text-center text-gray-500">
                        Conf: {(res.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!liveData.results?.length && (
              <p className="text-center text-gray-500 text-sm py-10">No AI slot data available for this lot.</p>
            )}
          </div>

          {/* Active sessions */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <p className="font-semibold text-white">Active Sessions ({liveData.active_sessions})</p>
            </div>

            {sessions.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">No active sessions right now.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.session_id} className={`flex items-center justify-between p-4 rounded-xl border ${
                    s.overstay_minutes > 0 ? 'border-red-500/30 bg-red-500/5' : 'border-gray-800 bg-gray-800/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        s.overstay_minutes > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'
                      }`}>
                        <MapPin className={`w-4 h-4 ${s.overstay_minutes > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{s.user}</p>
                        <p className="text-xs text-gray-500">{s.floor} · Slot {s.slot}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-lg">{s.vehicle}</span>
                      <div className="flex items-center gap-1 mt-1.5 justify-end">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className={`text-xs ${s.overstay_minutes > 0 ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                          {s.overstay_minutes > 0
                            ? `OVERSTAY +${s.overstay_minutes}m`
                            : `${s.duration_minutes}m parked`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card text-center py-16">
          <Activity className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400">Select a lot to view live data.</p>
        </div>
      )}
    </div>
  )
}
