
import React, { useState, useRef, useEffect } from "react";
import { launchConfetti } from "@/utils/confetti";
import { Check, X, Trophy, LightbulbIcon, Star, Award, PartyPopper } from "lucide-react";
import { animate, stagger } from "@motionone/dom";
import { toast } from "sonner";

interface QuizBlockProps {
  question: string;
  options: string[];
  correctAnswer: number;
  funFact?: string;
}

const QuizBlock: React.FC<QuizBlockProps> = ({ question, options, correctAnswer, funFact }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showFunFact, setShowFunFact] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const quizRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const funFactRef = useRef<HTMLDivElement>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Debug log to verify quiz data
  useEffect(() => {
    console.log("QuizBlock rendered with data:", { question, options, correctAnswer, funFact });
  }, [question, options, correctAnswer, funFact]);
  
  // Initialize sound effects (in a real app, these would be actual audio files)
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      try {
        // These would be replaced with actual sound files in a production app
        correctSoundRef.current = new Audio();
        incorrectSoundRef.current = new Audio();
      } catch (e) {
        console.log("Audio not supported in this environment");
      }
    }
  }, []);
  
  // Animate the quiz when it appears
  useEffect(() => {
    if (quizRef.current) {
      animate(
        quizRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
      
      // Animate options with stagger
      if (optionsRef.current.filter(Boolean).length) {
        animate(
          optionsRef.current.filter(Boolean) as HTMLElement[],
          { opacity: [0, 1], x: [-10, 0] },
          { duration: 0.3, delay: stagger(0.1), easing: "ease-out" }
        );
      }
    }
  }, [options]);

  // Animate fun fact when it appears
  useEffect(() => {
    if (showFunFact && funFactRef.current) {
      animate(
        funFactRef.current,
        { opacity: [0, 1], scale: [0.95, 1] },
        { duration: 0.4, easing: "ease-out", delay: 0.5 }
      );
    }
  }, [showFunFact]);

  const handleOptionClick = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
      
      // Animate the selection
      if (optionsRef.current[index]) {
        animate(
          optionsRef.current[index]!,
          { scale: [1, 1.03, 1] },
          { duration: 0.3, easing: "ease-out" }
        );
      }
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isSubmitted) {
      const correct = selectedAnswer === correctAnswer;
      setIsCorrect(correct);
      setIsSubmitted(true);
      
      if (correct) {
        // Update score and streak
        setScore(prev => prev + 10);
        setStreak(prev => prev + 1);
        
        // Play success sound effect
        if (correctSoundRef.current) {
          try {
            correctSoundRef.current.play().catch(e => console.log("Could not play sound", e));
          } catch (e) {
            console.log("Error playing sound", e);
          }
        }
        
        // Launch confetti animation on correct answer
        launchConfetti();
        
        // Show toast for correct answer with streak info
        const streakText = streak >= 1 ? `🔥 ${streak + 1} answer streak!` : '';
        toast.success(`Great job! That's correct! 🎉`, {
          description: streakText ? streakText : "You earned 10 points!",
          duration: 4000,
        });
        
        // Show fun fact after a short delay
        setTimeout(() => {
          setShowFunFact(true);
        }, 1000);
        
        // Add celebration animation
        if (quizRef.current) {
          // Add celebratory sparkles
          const sparkles = Array.from({ length: 5 }).map(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'absolute rounded-full bg-wonder-yellow animate-sparkle';
            sparkle.style.width = `${Math.random() * 10 + 5}px`;
            sparkle.style.height = `${Math.random() * 10 + 5}px`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 1}s`;
            sparkle.style.opacity = '0.8';
            sparkle.style.zIndex = '10';
            return sparkle;
          });
          
          sparkles.forEach(sparkle => quizRef.current?.appendChild(sparkle));
          
          // Remove sparkles after animation
          setTimeout(() => {
            sparkles.forEach(sparkle => sparkle.remove());
          }, 3000);
        }
      } else {
        // Reset streak on wrong answer
        setStreak(0);
        
        // Play error sound effect
        if (incorrectSoundRef.current) {
          try {
            incorrectSoundRef.current.play().catch(e => console.log("Could not play sound", e));
          } catch (e) {
            console.log("Error playing sound", e);
          }
        }
        
        // Show toast for incorrect answer
        toast.error("Not quite right. Try again next time!", {
          description: "Don't worry, learning is about trying!",
          duration: 4000,
        });
      }
    }
  };

  const getOptionClassName = (index: number) => {
    let className = "quiz-answer flex items-center mb-3 cursor-pointer transition-all duration-300 p-3 rounded-lg relative overflow-hidden";
    
    if (isSubmitted) {
      if (index === correctAnswer) {
        className += " bg-gradient-to-r from-wonder-green/20 to-wonder-green/5 border border-wonder-green/30 shadow-sm";
      } else if (index === selectedAnswer) {
        className += " bg-gradient-to-r from-wonder-coral/20 to-wonder-coral/5 border border-wonder-coral/30 shadow-sm";
      } else {
        className += " opacity-60";
      }
    } else if (index === selectedAnswer) {
      className += " bg-wonder-purple/10 border border-wonder-purple/20 shadow-sm";
    } else {
      className += " hover:bg-wonder-purple/5 border border-transparent hover:border-wonder-purple/10";
    }
    
    return className;
  };

  // If we don't have valid quiz data, show a fallback message
  if (!question || !options || options.length === 0) {
    return (
      <div className="mt-4 bg-white rounded-xl p-5 shadow-pixar">
        <div className="text-center p-4">
          <LightbulbIcon className="h-8 w-8 mx-auto text-wonder-yellow mb-3 animate-pulse-glow" />
          <h3 className="font-bold text-lg mb-2">Quiz Coming Soon!</h3>
          <p className="text-muted-foreground">We're preparing an exciting quiz for you. Check back in a moment!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-xl p-5 shadow-pixar relative overflow-hidden" ref={quizRef}>
      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(circle at 20px 20px, #7c3aed 2px, transparent 0)",
          backgroundSize: "40px 40px"
        }}>
      </div>
      
      {/* Quiz header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg relative flex items-center">
          <div className="w-7 h-7 rounded-full bg-wonder-purple/20 flex items-center justify-center mr-2 flex-shrink-0">
            <Trophy className="h-4 w-4 text-wonder-purple" />
          </div>
          <span>Quiz Time!</span>
        </h3>
        
        {/* Score display */}
        {score > 0 && (
          <div className="flex items-center">
            <Star className="h-4 w-4 text-wonder-yellow mr-1" />
            <span className="text-sm font-medium">{score} points</span>
          </div>
        )}
      </div>
      
      {/* Question */}
      <div className="mt-3 mb-4 p-3 bg-wonder-purple/5 rounded-lg border border-wonder-purple/10">
        <p className="font-medium text-foreground">{question}</p>
      </div>
      
      {/* Options */}
      <div className="mb-4 relative z-10">
        {options.map((option, index) => (
          <div 
            key={index} 
            className={getOptionClassName(index)}
            onClick={() => handleOptionClick(index)}
            ref={el => optionsRef.current[index] = el}
          >
            {isSubmitted && index === correctAnswer && (
              <div className="flex items-center justify-center h-6 w-6 bg-wonder-green rounded-full mr-2 text-white flex-shrink-0">
                <Check className="h-4 w-4" />
              </div>
            )}
            {isSubmitted && index === selectedAnswer && index !== correctAnswer && (
              <div className="flex items-center justify-center h-6 w-6 bg-destructive rounded-full mr-2 text-white flex-shrink-0">
                <X className="h-4 w-4" />
              </div>
            )}
            {(!isSubmitted || (index !== correctAnswer && index !== selectedAnswer)) && (
              <div className={`h-6 w-6 mr-2 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                selectedAnswer === index ? 'bg-wonder-purple border-wonder-purple text-white' : 'border-gray-300'
              }`}>
                {selectedAnswer === index && <div className="h-2 w-2 bg-white rounded-full"></div>}
              </div>
            )}
            <span>{option}</span>
            
            {/* Show sparkle animation on correct answer */}
            {isSubmitted && index === correctAnswer && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <PartyPopper className="h-4 w-4 text-wonder-yellow animate-bounce-subtle" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
            selectedAnswer !== null 
              ? 'bg-gradient-to-r from-wonder-purple to-wonder-purple-dark text-white shadow-magical hover:shadow-magical-hover hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Award className={`h-4 w-4 mr-2 ${selectedAnswer !== null ? 'animate-pulse-soft' : ''}`} />
          Check Answer
        </button>
      ) : (
        <div className={`p-4 rounded-lg ${
          isCorrect 
            ? 'bg-gradient-to-r from-wonder-green/20 to-wonder-green-light/10 text-wonder-green border border-wonder-green/20' 
            : 'bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border border-destructive/20'
        }`}>
          <div className="flex items-center">
            {isCorrect ? (
              <>
                <Trophy className="h-5 w-5 mr-2 text-wonder-yellow animate-bounce-subtle" />
                <span className="font-medium">That's right! Great job! 🎉</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 mr-2" />
                <span className="font-medium">Not quite. The correct answer is:</span>
              </>
            )}
          </div>
          {!isCorrect && (
            <div className="mt-2 font-medium text-wonder-green pl-7">
              {options[correctAnswer]}
            </div>
          )}
        </div>
      )}
      
      {/* Fun Fact Section - Only shown after a correct answer */}
      {showFunFact && funFact && (
        <div 
          ref={funFactRef}
          className="mt-4 p-4 bg-gradient-to-r from-wonder-yellow/10 to-wonder-yellow-light/5 rounded-lg border border-wonder-yellow/20"
          style={{ opacity: 0 }} // Start invisible for animation
        >
          <div className="flex items-start">
            <div className="bg-wonder-yellow/20 p-1.5 rounded-full mr-2 flex-shrink-0 mt-0.5">
              <LightbulbIcon className="h-4 w-4 text-wonder-yellow-dark" />
            </div>
            <div>
              <h4 className="font-medium text-wonder-yellow-dark text-sm">Mind-Blowing Fact!</h4>
              <p className="text-sm text-wonder-yellow-dark/90 mt-1">{funFact}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Add decorative elements */}
      {isCorrect && (
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-radial from-wonder-green/20 to-transparent rounded-full animate-pulse-soft"></div>
      )}
    </div>
  );
};

export default QuizBlock;
