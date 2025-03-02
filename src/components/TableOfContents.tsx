
import React, { useRef, useEffect } from "react";
import { CheckCircle, BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { animate } from "@motionone/dom";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  sections, 
  completedSections,
  currentSection,
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
    
  // Determine the next section to study
  const getNextSection = () => {
    if (currentSection) {
      const currentIndex = sections.indexOf(currentSection);
      if (currentIndex < sections.length - 1) {
        return sections[currentIndex + 1];
      }
    } else if (sections.length > 0 && completedSections.length < sections.length) {
      // Find the first incomplete section
      return sections.find(section => !completedSections.includes(section)) || null;
    }
    return null;
  };

  const nextSection = getNextSection();
    
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
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
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
          const isCurrent = section === currentSection;
          const isNext = section === nextSection;
          
          return (
            <button
              key={index}
              ref={el => sectionsRef.current[index] = el}
              onClick={() => onSectionClick(section)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-300
                transform hover:-translate-y-1 active:translate-y-0 group
                ${isCompleted
                  ? "bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 border border-wonder-purple/20 shadow-sm"
                  : isCurrent
                    ? "bg-gradient-to-r from-wonder-blue/10 to-wonder-blue/5 border border-wonder-blue/20 shadow-magical"
                    : isNext
                      ? "bg-gradient-to-r from-wonder-yellow/10 to-wonder-yellow/5 border border-wonder-yellow/20 shadow-magical animate-pulse-soft"
                      : "bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-wonder-purple/20 hover:bg-wonder-purple/5 hover:shadow-magical"
                }`}
              style={{ opacity: 0 }} // Start invisible for animation
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 transition-all 
                               ${isCompleted 
                                ? "bg-wonder-purple text-white shadow-magical" 
                                : isCurrent
                                  ? "bg-wonder-blue text-white shadow-magical"
                                  : isNext
                                    ? "bg-wonder-yellow text-white shadow-magical"
                                    : "bg-wonder-purple/10 text-wonder-purple"}`}>
                  {isCompleted 
                    ? <CheckCircle className="h-5 w-5" /> 
                    : <span className="text-sm font-medium">{index + 1}</span>
                  }
                </div>
                <span className={`transition-colors ${
                  isCompleted 
                    ? "text-wonder-purple font-medium" 
                    : isCurrent
                      ? "text-wonder-blue font-medium"
                      : isNext
                        ? "text-wonder-yellow-dark font-medium"
                        : "group-hover:text-wonder-purple"
                }`}>
                  {section}
                </span>
              </div>
              
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transform transition-all duration-300 
                             ${isCompleted 
                                ? "bg-wonder-purple/10" 
                                : isCurrent
                                  ? "bg-wonder-blue/10"
                                  : isNext
                                    ? "bg-wonder-yellow/10 animate-pulse-soft"
                                    : "bg-gray-100 group-hover:bg-wonder-purple/10"}`}>
                <ArrowRight className={`h-3.5 w-3.5 transition-all transform 
                                     ${isCompleted 
                                      ? "text-wonder-purple" 
                                      : isCurrent
                                        ? "text-wonder-blue"
                                        : isNext
                                          ? "text-wonder-yellow-dark"
                                          : "text-gray-400 group-hover:text-wonder-purple group-hover:translate-x-0.5"}`} />
              </div>
            </button>
          );
        })}
      </div>
      
      {nextSection && (
        <div className="mt-4">
          <button 
            onClick={() => onSectionClick(nextSection)}
            className="w-full py-3 px-4 bg-gradient-to-r from-wonder-yellow to-wonder-yellow-dark text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-magical 
                       transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 group"
          >
            <span>Continue Learning</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
      
      {!nextSection && completedSections.length === sections.length && sections.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-wonder-purple/20 to-wonder-purple-dark/20 p-4 rounded-lg border border-wonder-purple/20">
          <p className="text-center text-wonder-purple font-medium">
            Congratulations! You've completed all sections! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default TableOfContents;
