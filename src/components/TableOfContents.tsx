
import React, { useEffect, useRef } from "react";
import { ChevronRight, CheckCircle2, BookOpen } from "lucide-react";
import { animate, spring } from "@motionone/dom";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
}

const TableOfContents = ({ 
  sections, 
  completedSections, 
  currentSection, 
  onSectionClick 
}: TableOfContentsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize the array with proper length
  useEffect(() => {
    sectionRefs.current = Array(sections.length).fill(null);
  }, [sections.length]);
  
  // Debug logs for TOC
  useEffect(() => {
    console.log("[TableOfContents][Debug] Original sections:", sections);
    
    const processedSections = sections.map(section => {
      // Clean section names for display (remove excess punctuation, etc.)
      return section
        .replace(/\*\*/g, "") // Remove markdown
        .trim();
    });
    
    console.log("[TableOfContents][Debug] Processing sections:", processedSections);
    console.log("[TableOfContents][Debug] After multilingual processing:", processedSections);
    
    const filteredSections = processedSections
      .filter(section => !section.toLowerCase().includes("introduction"));
    
    console.log("[TableOfContents][Debug] Filtering intro sections from:", processedSections);
    console.log("[TableOfContents][Debug] After filtering intros:", filteredSections);
  }, [sections]);
  
  useEffect(() => {
    // Animate sections in staggered appearance
    if (containerRef.current) {
      animate(
        containerRef.current,
        { opacity: [0, 1], y: [10, 0] },
        { duration: 0.5, easing: "ease-out" }
      );
      
      sectionRefs.current.forEach((sectionRef, index) => {
        if (sectionRef) {
          animate(
            sectionRef,
            { opacity: [0, 1], x: [-5, 0], scale: [0.97, 1] },
            { 
              duration: 0.35, 
              delay: 0.1 + index * 0.08, 
              easing: "ease-out" 
            }
          );
        }
      });
    }
  }, []);
  
  // Function to apply spring animation to a section when clicked
  const handleSectionClick = (section: string, index: number) => {
    const sectionRef = sectionRefs.current[index];
    
    if (sectionRef) {
      // Apply a spring-based "click" animation
      animate(
        sectionRef,
        { 
          scale: [1, 0.97, 1.02, 1],
          backgroundColor: [
            "rgba(124, 58, 237, 0.05)",
            "rgba(124, 58, 237, 0.15)",
            "rgba(124, 58, 237, 0.1)",
            "rgba(124, 58, 237, 0.05)"
          ]
        },
        { 
          duration: 0.5, 
          easing: spring({ stiffness: 400, damping: 15 })
        }
      );
    }
    
    // Call the original onSectionClick
    onSectionClick(section);
  };
  
  // Cleanup section names for display
  const cleanSectionName = (section: string) => {
    return section
      .replace(/\*\*/g, "")  // Remove markdown bold
      .replace(/^(\d+\.\s*)+/, "") // Remove leading numbers
      .trim();
  };
  
  // Check if section is the current section
  const isCurrentSection = (section: string) => {
    const normalizedCurrent = currentSection?.replace(/\*\*/g, "").trim() || "";
    const normalizedSection = section.replace(/\*\*/g, "").trim();
    return normalizedCurrent === normalizedSection;
  };
  
  // Check if section has been completed
  const isCompletedSection = (section: string) => {
    return completedSections.some(completedSection => {
      const normalizedCompleted = completedSection.replace(/\*\*/g, "").trim();
      const normalizedSection = section.replace(/\*\*/g, "").trim();
      return normalizedCompleted === normalizedSection;
    });
  };

  return (
    <div 
      className="mt-4 rounded-xl border border-wonder-purple/15 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm"
      ref={containerRef}
    >
      <div className="bg-gradient-to-r from-wonder-purple/10 to-transparent p-3 border-b border-wonder-purple/10">
        <h3 className="text-wonder-purple font-bubbly flex items-center text-lg">
          <BookOpen className="h-4 w-4 mr-2" />
          Learning Journey
        </h3>
      </div>
      
      <div className="p-2 sm:p-3">
        <div className="grid grid-cols-1 gap-2">
          {sections.map((section, index) => {
            const cleanedSection = cleanSectionName(section);
            const isCurrent = isCurrentSection(section);
            const isCompleted = isCompletedSection(section);
            
            return (
              <div
                key={index}
                ref={el => sectionRefs.current[index] = el}
                onClick={() => handleSectionClick(section, index)}
                className={`
                  py-2.5 px-3 rounded-lg transition-all duration-300 cursor-pointer relative
                  ${isCurrent ? 'bg-wonder-purple/10 border-l-4 border-wonder-purple' : 'hover:bg-wonder-purple/5 border-l-4 border-transparent'}
                  ${isCompleted ? 'opacity-80' : 'opacity-100'}
                  flex items-center gap-3
                `}
                aria-current={isCurrent ? "true" : "false"}
              >
                <div className={`
                  w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center
                  ${isCompleted 
                    ? 'bg-wonder-green/20 text-wonder-green' 
                    : isCurrent 
                      ? 'bg-wonder-purple/20 text-wonder-purple animate-pulse-slow' 
                      : 'bg-gray-200/60 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className={`h-3 w-3 ${isCurrent ? 'animate-bounce-subtle' : ''}`} />
                  )}
                </div>
                
                <span className={`text-sm font-medium 
                  ${isCurrent 
                    ? 'text-wonder-purple/90' 
                    : isCompleted 
                      ? 'text-wonder-green/90' 
                      : 'text-gray-600'
                  }`}
                >
                  {cleanedSection}
                </span>
                
                {/* Current section indicator */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-lg border border-wonder-purple/30 pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
