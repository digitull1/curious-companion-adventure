
import React, { useState } from "react";
import { X, Sparkles, Star, HelpCircle } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface AgeRangeSelectorProps {
  currentRange: string;
  onSelect: (range: string) => void;
  onClose: () => void;
}

const ageRanges = [
  {
    value: "5-7",
    emoji: "🧸",
    label: "5-7 years",
    description: "Simple & fun explanations",
    detail: "Perfect for early readers who are just starting to explore the world."
  },
  {
    value: "8-10",
    emoji: "🔍", 
    label: "8-10 years",
    description: "Clear with interesting facts",
    detail: "For curious minds who ask 'why' and love to discover new things."
  },
  {
    value: "11-13",
    emoji: "🚀",
    label: "11-13 years",
    description: "More detailed knowledge",
    detail: "For young learners ready for deeper explanations and complex concepts."
  },
  {
    value: "14-16",
    emoji: "🧠",
    label: "14-16 years",
    description: "In-depth & challenging",
    detail: "For advanced learners seeking comprehensive understanding of topics."
  }
];

const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({ 
  currentRange, 
  onSelect,
  onClose
}) => {
  const [showInfo, setShowInfo] = useState<string | null>(null);
  
  const handleSelect = (range: string) => {
    // Add a little animation or effect here when selecting
    onSelect(range);
    
    // Play a subtle sound effect for feedback (in a real implementation)
    // playSelectSound();
  };
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl p-6 shadow-wonder-lg max-w-md w-full mx-4 animate-scale-in relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-wonder-purple/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-wonder-yellow/5 rounded-full"></div>
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="font-bold text-lg flex items-center">
            Customize Learning Level
            <Sparkles className="h-4 w-4 ml-2 text-wonder-yellow animate-pulse-soft" />
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-muted-foreground mb-5 relative z-10">
          Select the age range to customize explanations and content complexity
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {ageRanges.map((range) => (
            <div key={range.value} className="relative">
              <button
                onClick={() => handleSelect(range.value)}
                className={`p-4 rounded-xl border w-full transition-all duration-300 ${
                  currentRange === range.value
                    ? "border-wonder-purple bg-wonder-purple/10 shadow-wonder transform scale-[1.02]"
                    : "border-gray-200 hover:border-wonder-purple/30 hover:bg-wonder-purple/5 hover:scale-[1.01]"
                }`}
              >
                <div className="text-2xl mb-1 animate-bounce-subtle">
                  {range.emoji}
                </div>
                <div className={`font-medium ${currentRange === range.value ? "text-wonder-purple" : ""}`}>
                  {range.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {range.description}
                </div>
                
                {/* Selected indicator */}
                {currentRange === range.value && (
                  <div className="absolute -top-1 -right-1 bg-wonder-purple text-white h-5 w-5 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3" fill="white" />
                  </div>
                )}
              </button>
              
              {/* Info tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => setShowInfo(range.value === showInfo ? null : range.value)}
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-gray-200"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{range.detail}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
        
        <div className="mt-5 text-sm text-muted-foreground text-center relative z-10">
          You can change this anytime by clicking on the age display
        </div>
      </div>
    </div>
  );
};

export default AgeRangeSelector;
