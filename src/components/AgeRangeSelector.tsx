
import React from "react";
import { X } from "lucide-react";

interface AgeRangeSelectorProps {
  currentRange: string;
  onSelect: (range: string) => void;
  onClose: () => void;
}

const ageRanges = [
  "5-7",
  "8-10",
  "11-13",
  "14-16"
];

const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({ 
  currentRange, 
  onSelect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl p-6 shadow-wonder-lg max-w-md w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Customize Learning Level</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-muted-foreground mb-5">
          Select the age range to customize explanations and content complexity
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {ageRanges.map((range) => (
            <button
              key={range}
              onClick={() => onSelect(range)}
              className={`p-4 rounded-xl border transition-all ${
                currentRange === range
                  ? "border-wonder-purple bg-wonder-purple/10 shadow-wonder"
                  : "border-gray-200 hover:border-wonder-purple/30 hover:bg-wonder-purple/5"
              }`}
            >
              <div className="text-2xl mb-1">
                {range === "5-7" && "🧸"}
                {range === "8-10" && "🔍"}
                {range === "11-13" && "🚀"}
                {range === "14-16" && "🧠"}
              </div>
              <div className={`font-medium ${currentRange === range ? "text-wonder-purple" : ""}`}>
                {range} years
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {range === "5-7" && "Simple & fun explanations"}
                {range === "8-10" && "Clear with interesting facts"}
                {range === "11-13" && "More detailed knowledge"}
                {range === "14-16" && "In-depth & challenging"}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-5 text-sm text-muted-foreground text-center">
          You can change this anytime by clicking on the age display
        </div>
      </div>
    </div>
  );
};

export default AgeRangeSelector;
