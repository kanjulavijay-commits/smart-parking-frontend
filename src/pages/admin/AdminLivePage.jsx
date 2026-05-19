import { useEffect, useState, useRef } from 'react'
import {
  Activity, RefreshCw, AlertTriangle, MapPin, Clock,
  Cpu, Brain, TrendingUp, CheckCircle, XCircle,
} from 'lucide-react'
import { parkingApi } from '../../api/parking'
import { adminApi } from '../../api/admin'
import { aiApi } from '../../api/ai'
import Spinner from '../../components/ui/Spinner'

// ─── helpers ──────────────────────────────────────────────────────────────────

const FORECAST_THRESHOLDS = [
  { max: 0.4, bar: 'bg-emerald-500', text: 'text-emerald-400' },
  { max: 0.6, bar: 'bg-yellow-500',  text: 'text-yellow-400'  },
  { max: 0.8, bar: 'bg-orange-500',  text: 'text-orange-400'  },
  { max: 1.1, bar: 'bg-red-500',     text: 'text-red-400'     },
]
const fcColor = (occ) =>
  FORECAST_THRESHOLDS.find(t => occ <= t.max) ?? FORECAST_THRESHOLDS[3]

const RF_STYLE = {
  high:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  medium: { color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30'  },
  low:    { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'      },
}

const MODEL_META = [
  { key: 'cnn',  label: 'CNN (MobileNet)', desc: 'Visual slot detection',   color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  { key: 'random_forest', label: 'Random Forest', desc: 'Availability forecast', color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/30'    },
  { key: 'lstm', label: 'LSTM',           desc: 'Hourly demand forecast',   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30'  },
]

// ─── component ────────────────────────────────────────────────────────────────

export default function AdminLivePage() {
  const [lots, setLots]               = useState([])
  const [selectedLot, setSelectedLot] = useState('')
  const [liveData, setLiveData]       = useState(null)
  const [forecast, setForecast]       = useState(null)
  const [rfData, setRfData]           = useState(null)
  const [aiStats, setAiStats]         = useState(null)
  const [modelStatus, setModelStatus] = useState(null)
  const [loading, setLoading]         = useState(false)
  const [aiLoading, setAiLoading]     = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const intervalRef = useRef(null)

  // Load lots + model health once on mount
  useEffect(() => {
    parkingApi.getLots().then(({ data }) => {
      const list = data.results ?? data
      setLots(list)
      if (list.length > 0) setSelectedLot(list[0].id)
    })
    aiApi.getDatasetStatus().then(({ data }) => setModelStatus(data)).catch(() => {})
    aiApi.getAiStats().then(({ data }) => setAiStats(data)).catch(() => {})
    return () => clearInterval(intervalRef.current)
  }, [])

  // Fetch live + LSTM + RF in parallel whenever lot changes
  const fetchLive = (lotId = selectedLot) => {
    if (!lotId) return
    setLoading(true)
    const now  = new Date()
    const hour = now.getHours()
    // Django weekday: Mon=0 … Sun=6; JS getDay(): Sun=0, Mon=1 … Sat=6
    const day  = now.getDay() === 0 ? 6 : now.getDay() - 1

    Promise.all([
      adminApi.getLiveStatus(lotId),
      aiApi.getLSTMForecast(lotId).catch(() => null),
      aiApi.getRFPrediction({ lot_id: lotId, hour, day }).catch(() => null),
    ]).then(([live, fc, rf]) => {
      setLiveData(live.data)
      if (fc) setForecast(fc.data)
      if (rf) setRfData(rf.data)
      setLastRefresh(new Date())
    }).finally(() => setLoading(false))
  }

  const runAiSimulation = () => {
    if (!selectedLot) return
    setAiLoading(true)
    aiApi.mockAnalyze(selectedLot)
      .then(({ data }) => {
        setLiveData(prev => ({
          ...prev,
          results: data.results,
          slot_stats: {
            total:     data.count,
            occupied:  data.results.filter(r => r.is_occupied).length,
            available: data.results.filter(r => !r.is_occupied).length,
          },
        }))
        setLastRefresh(new Date())
      })
      .finally(() => setAiLoading(false))
  }

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

  const slots     = liveData?.slot_stats ?? {}
  const sessions  = liveData?.sessions ?? []
  const occupancy = slots.total ? Math.round((slots.occupied / slots.total) * 100) : 0

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-white">Live AI Monitor</h1>
            {lastRefresh && (
              <p className="text-xs text-gray-500 mt-0.5">
                Updated {lastRefresh.toLocaleTimeString('en-IN')} · auto-refreshes every 30s
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runAiSimulation}
            disabled={aiLoading || !selectedLot}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Cpu className={`w-4 h-4 ${aiLoading ? 'animate-pulse' : ''}`} />
            {aiLoading ? 'Analyzing…' : 'Run AI Scan'}
          </button>
          <button onClick={triggerOverstayCheck} className="btn-secondary flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-400" /> Overstays
          </button>
          <button onClick={() => fetchLive()} disabled={loading} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Lot selector */}
      <div>
        <label className="label">Parking Lot</label>
        <select
          className="input max-w-xs"
          value={selectedLot}
          onChange={e => setSelectedLot(e.target.value)}
        >
          <option value="">— Select lot —</option>
          {lots.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      {/* AI Engine Status */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-brand-400" />
          <h2 className="font-semibold text-white text-sm">AI Engine Status</h2>
          {aiStats && (
            <span className="ml-auto text-xs text-gray-500">
              Acceptance rate:{' '}
              <span className="text-emerald-400 font-semibold">{aiStats.acceptance_rate_pct}%</span>
              &nbsp;·&nbsp; Avg confidence:{' '}
              <span className="text-sky-400 font-semibold">
                {(aiStats.avg_confidence * 100).toFixed(1)}%
              </span>
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MODEL_META.map(m => {
            const trained = modelStatus?.models?.[m.key]?.trained ?? true
            const sizeKb  = modelStatus?.models?.[m.key]?.size_kb
            return (
              <div key={m.key} className={`rounded-xl p-3 border ${m.bg} ${m.border} flex items-center gap-3`}>
                {trained
                  ? <CheckCircle className={`w-5 h-5 flex-shrink-0 ${m.color}`} />
                  : <XCircle    className="w-5 h-5 flex-shrink-0 text-gray-600" />}
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${trained ? m.color : 'text-gray-600'}`}>{m.label}</p>
                  <p className="text-[10px] text-gray-500">{m.desc}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {modelStatus?.models?.[m.key]?.val_accuracy != null && (
                      <p className={`text-[10px] font-semibold ${m.color}`}>
                        {modelStatus.models[m.key].val_accuracy}% acc
                      </p>
                    )}
                    {sizeKb && (
                      <p className="text-[10px] text-gray-600">{(sizeKb / 1024).toFixed(1)} MB</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content — gate status required */}
      {loading && !liveData ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : liveData ? (
        <>
          {/* Occupancy gauge */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-white text-sm">Slot Occupancy</p>
              <span className={`text-2xl font-bold ${
                occupancy > 80 ? 'text-red-400' : occupancy > 60 ? 'text-yellow-400' : 'text-emerald-400'
              }`}>
                {occupancy}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  occupancy > 80 ? 'bg-red-500' : occupancy > 60 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-100">{slots.total ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
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

          {/* LSTM Forecast + RF Availability side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LSTM — 4-hour forecast */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h2 className="font-semibold text-white text-sm">LSTM Forecast — Next 4 Hours</h2>
              </div>
              {forecast?.next_4_hours?.length > 0 ? (
                <div className="space-y-3">
                  {forecast.next_4_hours.map((h, i) => {
                    const fc = fcColor(h.occupancy)
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400 font-mono">{h.hour_label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-gray-800 ${fc.text}`}>
                              {h.label}
                            </span>
                            <span className={`font-semibold ${fc.text}`}>{h.occupancy_pct}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${fc.bar}`}
                            style={{ width: `${h.occupancy_pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-[10px] text-gray-600 mt-1">
                    Forecast from {forecast.forecast_from} · {forecast.lot_name}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-4 text-center">
                  LSTM forecast unavailable — model may need more booking history.
                </p>
              )}
            </div>

            {/* RF — current-hour availability */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-sky-400" />
                <h2 className="font-semibold text-white text-sm">RF Availability — Right Now</h2>
              </div>
              {rfData ? (
                <div className="space-y-4">
                  <div className={`rounded-xl p-4 border ${RF_STYLE[rfData.status]?.bg ?? ''} ${RF_STYLE[rfData.status]?.border ?? ''}`}>
                    <p className={`text-base font-bold ${RF_STYLE[rfData.status]?.color ?? 'text-gray-300'}`}>
                      {rfData.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {rfData.day_name} · {String(rfData.hour).padStart(2, '0')}:00
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-gray-800/50 rounded-xl p-3">
                      <p className="text-xl font-bold text-emerald-400">
                        {Math.round(rfData.availability_probability * 100)}%
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">Availability</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-3">
                      <p className="text-xl font-bold text-red-400">
                        {Math.round(rfData.occupancy_probability * 100)}%
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">Occupancy</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        rfData.status === 'high' ? 'bg-emerald-500'
                        : rfData.status === 'medium' ? 'bg-yellow-500'
                        : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.round(rfData.availability_probability * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-4 text-center">
                  RF prediction unavailable — model may not be trained yet.
                </p>
              )}
            </div>
          </div>

          {/* Live AI Slot Map */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <h2 className="font-semibold text-white">Live AI Slot Map</h2>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vacant
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Occupied
                </div>
              </div>
            </div>

            {liveData.results?.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {liveData.results.map((res, i) => (
                  <div
                    key={res.slot_id}
                    className={`group relative aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all hover:scale-110 shadow-lg ${
                      res.is_occupied
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-red-500/10'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/10'
                    }`}
                  >
                    {i + 1}
                    {/* AI consensus tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50 pointer-events-none">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-2xl text-[9px]">
                        <p className="font-bold text-white border-b border-gray-800 pb-1 mb-1">AI Consensus</p>
                        <div className="space-y-1">
                          {[['cnn', 'CNN'], ['svm', 'SVM'], ['rf', 'R.Forest']].map(([key, label]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-500">{label}:</span>
                              <span className={
                                res.comparison?.[key] == null ? 'text-gray-600'
                                : res.comparison[key] ? 'text-red-400' : 'text-emerald-400'
                              }>
                                {res.comparison?.[key] == null ? '—' : res.comparison[key] ? 'OCC' : 'VAC'}
                              </span>
                            </div>
                          ))}
                        </div>
                        {res.confidence != null && (
                          <div className="mt-1.5 pt-1 border-t border-gray-800 text-center text-gray-500">
                            Conf: {(res.confidence * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-10">
                No AI slot data — click <strong className="text-gray-400">Run AI Scan</strong> to analyze this lot.
              </p>
            )}
          </div>

          {/* Active Sessions */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <p className="font-semibold text-white">
                Active Sessions ({liveData.active_sessions ?? 0})
              </p>
            </div>

            {sessions.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">No active sessions right now.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map(s => (
                  <div
                    key={s.session_id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      s.overstay_minutes > 0
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-gray-800 bg-gray-800/40'
                    }`}
                  >
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
                      <span className="font-mono text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-lg">
                        {s.vehicle}
                      </span>
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
          <p className="text-gray-400">Select a parking lot to view live AI data.</p>
        </div>
      )}
    </div>
  )
}
