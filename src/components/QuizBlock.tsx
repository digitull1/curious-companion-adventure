
import React, { useState } from "react";
import { launchConfetti } from "@/utils/confetti";
import { Check, X } from "lucide-react";

interface QuizBlockProps {
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizBlock: React.FC<QuizBlockProps> = ({ question, options, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleOptionClick = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isSubmitted) {
      const correct = selectedAnswer === correctAnswer;
      setIsCorrect(correct);
      setIsSubmitted(true);
      
      if (correct) {
        // Launch confetti animation on correct answer
        launchConfetti();
      }
    }
  };

  const getOptionClassName = (index: number) => {
    let className = "quiz-answer flex items-center mb-3 cursor-pointer";
    
    if (isSubmitted) {
      if (index === correctAnswer) {
        className += " quiz-answer-correct";
      } else if (index === selectedAnswer) {
        className += " quiz-answer-incorrect";
      }
    } else if (index === selectedAnswer) {
      className += " quiz-answer-selected";
    }
    
    return className;
  };

  return (
    <div className="mt-4 bg-white rounded-xl p-5 shadow-wonder">
      <h3 className="font-bold text-lg mb-4">{question}</h3>
      
      <div className="mb-4">
        {options.map((option, index) => (
          <div 
            key={index} 
            className={getOptionClassName(index)}
            onClick={() => handleOptionClick(index)}
          >
            {isSubmitted && index === correctAnswer && (
              <Check className="h-5 w-5 mr-2 text-wonder-green flex-shrink-0" />
            )}
            {isSubmitted && index === selectedAnswer && index !== correctAnswer && (
              <X className="h-5 w-5 mr-2 text-destructive flex-shrink-0" />
            )}
            {(!isSubmitted || (index !== correctAnswer && index !== selectedAnswer)) && (
              <div className={`h-5 w-5 mr-2 rounded-full border-2 flex-shrink-0 ${selectedAnswer === index ? 'bg-wonder-purple border-wonder-purple' : 'border-gray-300'}`}></div>
            )}
            <span>{option}</span>
          </div>
        ))}
      </div>
      
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={`w-full py-2 rounded-lg font-medium transition-all duration-300 btn-bounce ${
            selectedAnswer !== null 
              ? 'bg-wonder-purple text-white hover:bg-wonder-purple-dark'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Check Answer
        </button>
      ) : (
        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-wonder-green/10 text-wonder-green' : 'bg-destructive/10 text-destructive'}`}>
          {isCorrect 
            ? "That's right! Great job! 🎉" 
            : `Not quite. The correct answer is: ${options[correctAnswer]}`
          }
        </div>
      )}
    </div>
  );
};

export default QuizBlock;
