
import React from "react";
import { Star, Check } from "lucide-react";

interface InterestSelectionProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

const InterestSelection: React.FC<InterestSelectionProps> = ({ selectedInterests, onInterestsChange }) => {
  const interestOptions = [
    { id: "animals", label: "Animals", emoji: "🦁", color: "bg-wonder-coral/10 border-wonder-coral/20 hover:bg-wonder-coral/20" },
    { id: "space", label: "Space", emoji: "🚀", color: "bg-wonder-purple/10 border-wonder-purple/20 hover:bg-wonder-purple/20" },
    { id: "dinosaurs", label: "Dinosaurs", emoji: "🦕", color: "bg-wonder-green/10 border-wonder-green/20 hover:bg-wonder-green/20" },
    { id: "robots", label: "Robots", emoji: "🤖", color: "bg-wonder-blue/10 border-wonder-blue/20 hover:bg-wonder-blue/20" },
    { id: "science", label: "Science", emoji: "🔬", color: "bg-wonder-teal/10 border-wonder-teal/20 hover:bg-wonder-teal/20" },
    { id: "history", label: "History", emoji: "🏛️", color: "bg-wonder-yellow/10 border-wonder-yellow/20 hover:bg-wonder-yellow/20" },
    { id: "math", label: "Math", emoji: "🔢", color: "bg-wonder-purple/10 border-wonder-purple/20 hover:bg-wonder-purple/20" },
    { id: "art", label: "Art", emoji: "🎨", color: "bg-wonder-coral/10 border-wonder-coral/20 hover:bg-wonder-coral/20" },
    { id: "music", label: "Music", emoji: "🎵", color: "bg-wonder-green/10 border-wonder-green/20 hover:bg-wonder-green/20" },
    { id: "sports", label: "Sports", emoji: "⚽", color: "bg-wonder-blue/10 border-wonder-blue/20 hover:bg-wonder-blue/20" },
    { id: "oceans", label: "Oceans", emoji: "🌊", color: "bg-wonder-teal/10 border-wonder-teal/20 hover:bg-wonder-teal/20" },
    { id: "planets", label: "Planets", emoji: "🪐", color: "bg-wonder-yellow/10 border-wonder-yellow/20 hover:bg-wonder-yellow/20" },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      onInterestsChange(selectedInterests.filter(i => i !== id));
    } else {
      onInterestsChange([...selectedInterests, id]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm mb-3">Choose at least one topic that interests you:</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {interestOptions.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`p-3 rounded-xl border transition-all relative ${interest.color} ${
                isSelected ? "border-wonder-purple ring-1 ring-wonder-purple transform scale-[1.02]" : "border-opacity-50"
              }`}
            >
              {isSelected && (
                <span className="absolute -top-2 -right-2 h-6 w-6 bg-wonder-purple rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
              
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-1">{interest.emoji}</div>
                <div className="font-medium text-sm">{interest.label}</div>
                
                {isSelected && (
                  <Star className="h-3 w-3 text-wonder-yellow mt-1 animate-pulse-soft" fill="currentColor" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className={`mt-4 p-2 rounded-full bg-white/70 flex items-center justify-center transition-all ${
        selectedInterests.length > 0 ? 'opacity-100' : 'opacity-50'
      }`}>
        <div className="flex space-x-1">
          {selectedInterests.length > 0 ? (
            <>
              <span className="text-wonder-purple font-medium">
                {selectedInterests.length} topic{selectedInterests.length !== 1 ? 's' : ''} selected
              </span>
              <Star className="h-4 w-4 text-wonder-yellow animate-pulse-soft" fill="currentColor" />
            </>
          ) : (
            <span className="text-muted-foreground">No topics selected yet</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestSelection;
