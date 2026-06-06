import { useState, useEffect, useRef } from "react";

interface Question {
  id: number;
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  rightAnswer: string;
}

interface QuizEngineProps {
  category: string;
  onQuit: () => void;
}

export function QuizEngine({ category, onQuit }: QuizEngineProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Game State Metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shields, setShields] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizComplete, setQuizComplete] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // If the environment variable exists, use it; otherwise fall back to the live Render URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://church-quiz-backend.onrender.com';


  // 1. Fetch live quiz questions from your Render API on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/question/allQuestions`)
      .then((res) => res.json())
      .then((data: Question[]) => {
        console.log("questions: ", data)
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed fetching questions:", err);
        setLoading(false);
      });
  }, []);

  // 2. Countdown Timer logic
  useEffect(() => {
    if (loading || quizComplete || isAnswered) return;

    if (timeLeft === 0) {
      handleTimeOut();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, loading, quizComplete, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedAnswer(""); // Blank means timeout
    processIncorrect();
  };

  const handleAnswerSelection = (option: string) => {
    if (isAnswered) return; // Prevent multiple clicks
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsAnswered(true);
    setSelectedAnswer(option);

    const currentQuestion = questions[currentIndex];
    if (option === currentQuestion.rightAnswer) {
      // Correct Answer!
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      
      // Speed Bonus Calculation
      const speedBonus = Math.floor(timeLeft * 10);
      setScore((prev) => prev + 100 + speedBonus);

      // Award a Faith Shield every 5 streaks
      if (nextStreak % 5 === 0) {
        setShields((prev) => prev + 1);
      }
    } else {
      // Incorrect Answer
      processIncorrect();
    }
  };

  const processIncorrect = () => {
    if (shields > 0) {
      setShields((prev) => prev - 1); // Shield break protects streak!
    } else {
      setStreak(0); // No shields left = streak lost
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(15);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center font-medium">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
        Connecting to Database Engine...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 text-center space-y-4">
        <p className="text-xl text-slate-400">No questions found in database table.</p>
        <button onClick={onQuit} className="bg-slate-800 border border-slate-700 px-6 py-2 rounded-xl text-slate-200">Go Back</button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Quiz Completed!</h2>
          <div className="bg-slate-900/60 rounded-xl p-6 space-y-3 border border-slate-700/30">
            <p className="text-slate-400 text-sm">Final Earned Score</p>
            <p className="text-4xl font-black text-amber-400">{score}</p>
          </div>
          <button onClick={onQuit} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold py-3.5 rounded-xl transition-transform active:scale-[0.98] cursor-pointer">
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = [currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Animated Timer Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-slate-700 w-full">
          <div 
            className={`h-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>

        {/* Live HUD Status Row */}
        <div className="flex justify-between items-center text-sm font-bold bg-slate-900/40 px-4 py-2.5 rounded-xl border border-slate-700/30">
          <div className="text-slate-400">Q: <span className="text-slate-100">{currentIndex + 1}/{questions.length}</span></div>
          <div className="text-amber-400 flex items-center gap-1">🔥 Streak: <span>{streak}</span></div>
          <div className="text-sky-400 flex items-center gap-1">🛡️ Shields: <span>{shields}</span></div>
          <div className="text-orange-400">Score: <span className="text-slate-100">{score}</span></div>
        </div>

        {/* Question Panel */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{category}</div>
          <h2 className="text-xl font-bold leading-relaxed text-slate-200">{currentQuestion.questionTitle}</h2>
        </div>

        {/* Answers List Grid */}
        <div className="grid gap-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQuestion.rightAnswer;
            
            let btnStyle = "bg-slate-900/60 border-slate-700 hover:bg-slate-700/30 text-slate-300";
            if (isAnswered) {
              if (isCorrectAnswer) {
                btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold";
              } else if (isSelected) {
                btnStyle = "bg-red-500/20 border-red-500 text-red-400";
              } else {
                btnStyle = "bg-slate-900/20 border-slate-800 text-slate-600 opacity-60";
              }
            }

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => handleAnswerSelection(option)}
                className={`w-full text-left p-4 rounded-xl border font-medium transition-all duration-150 flex items-center justify-between ${btnStyle} ${!isAnswered ? 'cursor-pointer active:scale-[0.99]' : ''}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrectAnswer && <span className="text-emerald-400 text-lg">✓</span>}
                {isAnswered && isSelected && !isCorrectAnswer && <span className="text-red-400 text-lg">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Footer Navigation Action */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] text-center cursor-pointer uppercase tracking-wider text-xs"
          >
            {currentIndex + 1 === questions.length ? "Finish Quiz Challenge" : "Advance to Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}