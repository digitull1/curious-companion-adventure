
import React, { useRef, useEffect } from "react";
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react";
import { animate } from "@motionone/dom";

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
  const tocRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    if (tocRef.current) {
      // Animate the TOC container
      animate(
        tocRef.current,
        { opacity: [0, 1], scale: [0.97, 1] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
      
      // Staggered animation for sections
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          animate(
            section,
            { opacity: [0, 1], y: [10, 0] },
            { duration: 0.4, easing: "ease-out", delay: 0.2 + (index * 0.1) }
          );
        }
      });
    }
  }, [sections]);
  
  // Calculate progress percentage
  const progressPercentage = sections.length 
    ? Math.round((completedSections.length / sections.length) * 100)
    : 0;
    
  return (
    <div 
      className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-pixar transition-all duration-300 hover:shadow-magical relative overflow-hidden"
      ref={tocRef}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wonder-purple/5 to-transparent pointer-events-none"></div>
      <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-radial from-wonder-purple/10 to-transparent rounded-full"></div>
      
      <h3 className="font-bold text-lg mb-2 flex items-center relative z-10">
        <div className="p-1.5 bg-wonder-purple/10 rounded-lg mr-2">
          <BookOpen className="text-wonder-purple h-5 w-5" />
        </div>
        <span>Learning Journey</span>
      </h3>
      
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-wonder-purple via-wonder-purple-light to-wonder-purple rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" 
               style={{ 
                 transform: 'translateX(-100%)', 
                 animation: 'shine 2s infinite' 
               }}>
          </div>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="text-sm text-wonder-purple mb-4 flex items-center justify-between">
        <span className="font-medium">Your progress</span>
        <div className="bg-wonder-purple/10 px-3 py-1 rounded-full text-wonder-purple font-medium">
          {progressPercentage}%
        </div>
      </div>
      
      <div className="space-y-2">
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section);
          return (
            <button
              key={index}
              ref={el => sectionsRef.current[index] = el}
              onClick={() => onSectionClick(section)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-300
                transform hover:-translate-y-1 active:translate-y-0 group
                ${isCompleted
                  ? "bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 border border-wonder-purple/20 shadow-sm"
                  : "bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-wonder-purple/20 hover:bg-wonder-purple/5 hover:shadow-magical"
                }`}
              style={{ opacity: 0 }} // Start invisible for animation
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 transition-all 
                               ${isCompleted 
                                ? "bg-wonder-purple text-white shadow-magical" 
                                : "bg-wonder-purple/10 text-wonder-purple"}`}>
                  {isCompleted 
                    ? <CheckCircle className="h-5 w-5" /> 
                    : <span className="text-sm font-medium">{index + 1}</span>
                  }
                </div>
                <span className={`transition-colors ${isCompleted ? "text-wonder-purple font-medium" : "group-hover:text-wonder-purple"}`}>
                  {section}
                </span>
              </div>
              
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transform transition-all duration-300 
                             ${isCompleted ? "bg-wonder-purple/10" : "bg-gray-100 group-hover:bg-wonder-purple/10"}`}>
                <ArrowRight className={`h-3.5 w-3.5 transition-all transform 
                                     ${isCompleted 
                                      ? "text-wonder-purple" 
                                      : "text-gray-400 group-hover:text-wonder-purple group-hover:translate-x-0.5"}`} />
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center">
        <div className="px-4 py-2 bg-wonder-background/50 rounded-full inline-flex items-center space-x-1">
          <span>Click on any section to explore it in depth</span>
          <ArrowRight className="h-3 w-3 ml-1 text-wonder-purple" />
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
