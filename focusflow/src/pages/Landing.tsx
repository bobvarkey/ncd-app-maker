import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">FocusFlow</div>
        <div className="space-x-6">
          <Link to="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
          <Link to="/settings" className="text-slate-300 hover:text-white">Settings</Link>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-5xl font-bold mb-6">
          Focus like your brain was designed to.
        </h1>
        <p className="text-xl text-slate-400 mb-10">
          Productivity built on neuroscience. Timer modes matched to your brain's natural states: Deep Focus, Flow State, and Diffuse Mode.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Deep Focus</h3>
            <p className="text-slate-400">25 min work sessions aligned with your prefrontal cortex's sustained attention capacity.</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-3xl mb-2">🌊</div>
            <h3 className="text-xl font-semibold mb-2">Flow State</h3>
            <p className="text-slate-400">Automatic mode when you're in the zone. Minimal interruptions, maximum output.</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <div className="text-3xl mb-2">💭</div>
            <h3 className="text-xl font-semibold mb-2">Diffuse Mode</h3>
            <p className="text-slate-400">15 min breaks for your brain's default mode network — where insights emerge.</p>
          </div>
        </div>
        
        <div className="mt-12 flex gap-4">
          <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-lg">
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  )
}