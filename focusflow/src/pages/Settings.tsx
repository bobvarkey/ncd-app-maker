import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Settings() {
  const [dark, setDark] = useState(true)
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">FocusFlow</div>
        <div className="space-x-6">
          <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
        </div>
      </nav>
      
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="bg-slate-800 p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Dark Mode</div>
              <div className="text-slate-400">Use dark theme</div>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className={`w-14 h-8 rounded-full transition ${dark ? 'bg-indigo-600' : 'bg-slate-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transform transition ${
                dark ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="border-t border-slate-700 pt-6">
            <div className="font-semibold mb-2">Session Lengths</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-slate-400 block mb-1">Deep Focus</label>
                <input type="number" defaultValue={25} className="w-full bg-slate-700 p-2 rounded" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Flow State</label>
                <input type="number" defaultValue={50} className="w-full bg-slate-700 p-2 rounded" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Diffuse Mode</label>
                <input type="number" defaultValue={15} className="w-full bg-slate-700 p-2 rounded" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-6">
            <div className="font-semibold mb-2">Notifications</div>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span>Session complete sounds</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}