'use client'

import { useState } from 'react'

export default function Home() {
  const [isActive, setIsActive] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FEF9E3]">
      <h1 className="text-3xl font-bold mb-4">Karen AI</h1>
      <p className="mb-8">Your Interview Coach</p>

      <button 
        onClick={() => setIsActive(prev => !prev)}
        className={`w-40 h-40 bg-[#E6AA63] rounded-full flex items-center justify-center mb-8 transition-transform ${isActive ? 'scale-95' : ''}`}
      >
        <span className="text-5xl">🎤</span>
      </button>

      <p className="mb-6">Click to interview</p>

      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
        Unlock Premium Features
      </button>

      <div className="fixed bottom-0 left-0 right-0 bg-[#E6AA63] p-4 flex justify-around">
        <div className="flex flex-col items-center">
          <div className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center">A</div>
          <span className="text-xs mt-1">Karen Pro</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl">📊</div>
          <span className="text-xs mt-1">Chart</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl">⚙️</div>
          <span className="text-xs mt-1">Setting</span>
        </div>
      </div>
    </main>
  )
}