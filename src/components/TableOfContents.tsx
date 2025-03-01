
import React from "react";
import { CheckCircle, BookOpen } from "lucide-react";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  onSectionClick: (section: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  sections, 
  completedSections,
  onSectionClick
}) => {
  // Calculate progress percentage
  const progressPercentage = sections.length 
    ? Math.round((completedSections.length / sections.length) * 100)
    : 0;
    
  return (
    <div className="mt-4 bg-white/90 rounded-xl p-5 shadow-wonder transition-all duration-300 hover:shadow-wonder-lg">
      <h3 className="font-bold text-lg mb-2 flex items-center">
        <BookOpen className="mr-2 text-wonder-purple h-5 w-5" />
        Table of Contents
      </h3>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-wonder rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="space-y-2">
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section);
          return (
            <button
              key={index}
              onClick={() => onSectionClick(section)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200
                ${isCompleted
                  ? "bg-wonder-purple/10 border border-wonder-purple/20"
                  : "bg-white border border-gray-100 hover:border-wonder-purple/20 hover:bg-wonder-purple/5"
                } ${isCompleted ? "hover:shadow-sm" : ""}
              `}
            >
              <div className="flex items-center">
                <span className={`bg-wonder-purple/10 text-wonder-purple w-6 h-6 rounded-full flex items-center 
                                justify-center text-sm mr-3 ${isCompleted ? "animate-pulse-soft" : ""}`}>
                  {index + 1}
                </span>
                <span className={isCompleted ? "text-wonder-purple font-medium" : ""}>
                  {section}
                </span>
              </div>
              
              {isCompleted && (
                <CheckCircle className="h-4 w-4 text-wonder-purple" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Click on any section to explore it in depth
      </div>
    </div>
  );
};

export default TableOfContents;
