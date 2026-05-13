import { Link } from 'react-router-dom'

export default function Analytics() {
  const stats = {
    totalHours: 24.5,
    sessions: 42,
    avgFocus: 28,
    streak: 7,
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">FocusFlow</div>
        <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
      </nav>
      
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-slate-400 mb-1">Total Focus Time</div>
            <div className="text-4xl font-bold text-indigo-400">{stats.totalHours}h</div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-slate-400 mb-1">Sessions Completed</div>
            <div className="text-4xl font-bold text-emerald-400">{stats.sessions}</div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-slate-400 mb-1">Avg Session Length</div>
            <div className="text-4xl font-bold text-amber-400">{stats.avgFocus}m</div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-slate-400 mb-1">Current Streak</div>
            <div className="text-4xl font-bold text-purple-400">{stats.streak} days</div>
          </div>
        </div>
        
        <div className="mt-8 bg-slate-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
          <div className="h-40 flex items-end gap-2">
            {[65, 80, 45, 90, 70, 55, 30].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-600 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex gap-2 mt-2 text-xs text-slate-400">
            <span className="flex-1 text-center">Mon</span>
            <span className="flex-1 text-center">Tue</span>
            <span className="flex-1 text-center">Wed</span>
            <span className="flex-1 text-center">Thu</span>
            <span className="flex-1 text-center">Fri</span>
            <span className="flex-1 text-center">Sat</span>
            <span className="flex-1 text-center">Sun</span>
          </div>
        </div>
      </div>
    </div>
  )
}