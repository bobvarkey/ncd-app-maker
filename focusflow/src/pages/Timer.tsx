import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Mode = 'deep' | 'flow' | 'diffuse'

const MODES = {
  deep: { label: 'Deep Focus', minutes: 25, color: 'indigo' },
  flow: { label: 'Flow State', minutes: 50, color: 'emerald' },
  diffuse: { label: 'Diffuse Mode', minutes: 15, color: 'amber' },
}

export default function Timer() {
  const [mode, setMode] = useState<Mode>('deep')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSeconds(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [running])
  
  const currentMode = MODES[mode]
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }
  
  const startMode = (newMode: Mode) => {
    setMode(newMode)
    setSeconds(MODES[newMode].minutes * 60)
    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">FocusFlow</div>
        <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
      </nav>
      
      <div className="max-w-2xl mx-auto px-6 text-center mt-10">
        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {(Object.keys(MODES) as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => startMode(m)}
              className={`px-4 py-2 rounded-lg ${
                mode === m ? `bg-${MODES[m].color}-600` : 'bg-slate-800'
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>
        
        {/* Timer Display */}
        <div className="text-8xl font-bold mb-8 font-mono">
          {formatTime(seconds)}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setRunning(!running)}
            className={`px-8 py-4 rounded-lg font-bold text-xl ${
              running ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => { setSeconds(currentMode.minutes * 60); setRunning(false) }}
            className="px-6 py-4 bg-slate-700 rounded-lg font-semibold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}