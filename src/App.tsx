import { useState } from "react";
import { HomePage } from "./page/HomePage";
import { QuizEngine } from "./page/QuizEngine";

export default function App() {
  const [gameState, setGameState] = useState<"HOME" | "PLAYING">("HOME");
  const [category, setCategory] = useState("");

  const handleStartQuiz = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setGameState("PLAYING");
  };

  const handleReturnHome = () => {
    setGameState("HOME");
  };

  return (
    <>
      {gameState === "HOME" ? (
        <HomePage onStartQuiz={handleStartQuiz} />
      ) : (
        <QuizEngine category={category} onQuit={handleReturnHome} />
      )}
    </>
  );
}