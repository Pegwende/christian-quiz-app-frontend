import { useState } from "react";

interface HomePageProps {
  onStartQuiz: (category: string) => void;
}

export function HomePage({ onStartQuiz }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState("Bible Trivia");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-amber-500 selection:text-slate-900">
      {/* Game Card Container */}
      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl text-center space-y-8">
        
        {/* Title Header Block */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mx-auto">
            ⚡ Trivia Challenge Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Rafi Quizzes World
          </h1>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Test your scripture knowledge, maintain your holy streaks, and build your score!
          </p>
        </div>

        {/* Form Selector Elements */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">
            Select Quiz Category
          </label>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
            >
              <option value="Bible Trivia">General Bible Trivia</option>
              <option value="Apostles">The Apostles</option>
              <option value="Old Testament">Old Testament Chronicles</option>
              <option value="New Testament">New Testament Gospels</option>
            </select>
            {/* Custom Arrow Icon indicator */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onStartQuiz(selectedCategory)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-950/20 active:scale-[0.98] transition-all duration-200 text-center uppercase tracking-wider text-sm cursor-pointer"
        >
          Begin Quiz Engine
        </button>
      </div>

      {/* Decorative Branding Footer */}
      <p className="mt-8 text-xs text-slate-600 font-medium tracking-wide">
        A Gift to my lovely wife, Rafi ❤️
      </p>
    </div>
  );
}