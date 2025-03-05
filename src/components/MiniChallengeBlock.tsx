
import React, { useRef, useEffect, useState } from "react";
import { Sparkles, BrainCircuit, Lightbulb, ArrowRight } from "lucide-react";
import { animate } from "@motionone/dom";

interface MiniChallengeBlockProps {
  question: string;
  type: 'role-playing' | 'decision-making' | 'predictive' | 'thought-experiment';
}

const MiniChallengeBlock: React.FC<MiniChallengeBlockProps> = ({ question, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (blockRef.current) {
      animate(
        blockRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
    }
  }, []);
  
  const getIcon = () => {
    switch (type) {
      case 'role-playing':
        return <Sparkles className="h-5 w-5" />;
      case 'decision-making':
        return <ArrowRight className="h-5 w-5" />;
      case 'predictive':
        return <Lightbulb className="h-5 w-5" />;
      case 'thought-experiment':
        return <BrainCircuit className="h-5 w-5" />;
    }
  };
  
  const getTypeTitle = () => {
    switch (type) {
      case 'role-playing':
        return "Role-Playing Challenge";
      case 'decision-making':
        return "Decision-Making Challenge";
      case 'predictive':
        return "Prediction Challenge";
      case 'thought-experiment':
        return "Thought Experiment";
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'role-playing':
        return "from-wonder-purple/10 to-wonder-purple/5";
      case 'decision-making':
        return "from-wonder-blue/10 to-wonder-blue/5";
      case 'predictive':
        return "from-wonder-yellow/10 to-wonder-yellow/5";
      case 'thought-experiment':
        return "from-wonder-green/10 to-wonder-green/5";
    }
  };
  
  const getBorderColor = () => {
    switch (type) {
      case 'role-playing':
        return "border-wonder-purple/20";
      case 'decision-making':
        return "border-wonder-blue/20";
      case 'predictive':
        return "border-wonder-yellow/20";
      case 'thought-experiment':
        return "border-wonder-green/20";
    }
  };
  
  const getIconBgColor = () => {
    switch (type) {
      case 'role-playing':
        return "bg-wonder-purple text-white";
      case 'decision-making':
        return "bg-wonder-blue text-white";
      case 'predictive':
        return "bg-wonder-yellow text-white";
      case 'thought-experiment':
        return "bg-wonder-green text-white";
    }
  };
  
  const handleInteraction = () => {
    setIsExpanded(!isExpanded);
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };
  
  return (
    <div 
      ref={blockRef}
      className={`mt-4 bg-gradient-to-r ${getBgColor()} rounded-xl p-5 shadow-pixar border ${getBorderColor()} relative overflow-hidden
                  transition-all duration-300 transform cursor-pointer ${isExpanded ? 'scale-102' : 'hover:scale-102'}`}
      onClick={handleInteraction}
    >
      <div className="flex items-center mb-3">
        <div className={`w-8 h-8 rounded-full ${getIconBgColor()} flex items-center justify-center mr-3`}>
          {getIcon()}
        </div>
        <h3 className="font-bold">{getTypeTitle()}</h3>
      </div>
      
      <p className="text-foreground">{question}</p>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <textarea 
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-wonder-purple/30 focus:ring-2 focus:ring-wonder-purple/20 focus:outline-none min-h-[100px] text-sm"
            placeholder="Write your response here..."
            autoFocus
          ></textarea>
          
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Think about this challenge and write your thoughts. There's no right or wrong answer—this is all about creativity and critical thinking!</p>
          </div>
        </div>
      )}
      
      {!isExpanded && (
        <div className="absolute bottom-2 right-2 opacity-70">
          <ArrowRight className="h-4 w-4" />
        </div>
      )}
      
      {/* Add decorative elements */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-radial from-white/20 to-transparent rounded-full"></div>
    </div>
  );
};

export default MiniChallengeBlock;
