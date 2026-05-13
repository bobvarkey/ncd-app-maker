import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete X thread post', done: false },
    { id: 2, title: 'Record YouTube video', done: false },
    { id: 3, title: 'Review FocusFlow MVP', done: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">FocusFlow</div>
        <div className="space-x-6">
          <Link to="/" className="text-slate-300 hover:text-white">Home</Link>
          <Link to="/timer" className="text-slate-300 hover:text-white">Timer</Link>
          <Link to="/analytics" className="text-slate-300 hover:text-white">Analytics</Link>
          <Link to="/settings" className="text-slate-300 hover:text-white">Settings</Link>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Today's Focus */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Today's Focus Time</h2>
            <div className="text-4xl font-bold text-indigo-400">2h 15m</div>
            <p className="text-slate-400 mt-2">Goal: 4 hours</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Current Streak</h2>
            <div className="text-4xl font-bold text-emerald-400">7 days</div>
            <p className="text-slate-400 mt-2">Personal best: 14 days</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <Link to="/timer" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold">
            ▶ Start Focus Session
          </Link>
        </div>
        
        {/* Tasks */}
        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <div className="space-y-3">
            {tasks.map(task => (
              <label key={task.id} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-slate-600 text-indigo-600"
                />
                <span className={task.done ? 'line-through text-slate-500' : ''}>{task.title}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}