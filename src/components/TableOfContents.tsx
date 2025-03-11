
import React, { useEffect, useRef } from "react";
import { ChevronRight, CheckCircle2, BookOpen, ArrowRight } from "lucide-react";
import { animate, spring } from "@motionone/dom";
import { Button } from "@/components/ui/button";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
  isInitialView?: boolean;
  onStartLearning?: () => void;
}

const TableOfContents = ({ 
  sections, 
  completedSections, 
  currentSection, 
  onSectionClick,
  isInitialView = false,
  onStartLearning
}: TableOfContentsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    sectionRefs.current = Array(sections.length).fill(null);
  }, [sections.length]);
  
  useEffect(() => {
    console.log("[TableOfContents][Debug] Original sections:", sections);
    
    const processedSections = sections.map(section => {
      return section
        .replace(/\*\*/g, "")
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
    if (containerRef.current && isInitialView) {
      animate(
        containerRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.8, easing: "ease-out" }
      );
    }
  }, [isInitialView]);
  
  if (isInitialView) {
    return (
      <div 
        className="mt-4 rounded-xl border border-wonder-purple/15 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm"
        ref={containerRef}
      >
        <div className="bg-gradient-to-r from-wonder-purple/10 to-transparent p-3 border-b border-wonder-purple/10">
          <h3 className="text-wonder-purple font-bubbly flex items-center text-lg">
            <BookOpen className="h-4 w-4 mr-2" />
            Your Learning Journey
          </h3>
        </div>
        
        <div className="p-6 text-center">
          <h4 className="text-lg font-medium text-wonder-purple mb-3">
            Ready to explore these topics?
          </h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Take a moment to review the sections above. When you're ready, click the button below to start your learning adventure!
          </p>
          <Button
            onClick={onStartLearning}
            className="bg-wonder-purple hover:bg-wonder-purple/90 text-white flex items-center gap-2 mx-auto"
          >
            Begin Learning <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  // Don't render anything if there are no sections
  if (!sections || sections.length === 0) {
    console.log("[TableOfContents] No sections provided, not rendering TOC");
    return null;
  }
  
  useEffect(() => {
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
  
  const handleSectionClick = (section: string, index: number) => {
    const sectionRef = sectionRefs.current[index];
    
    if (sectionRef) {
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
    
    onSectionClick(section);
  };
  
  const cleanSectionName = (section: string) => {
    return section
      .replace(/\*\*/g, "")
      .replace(/^(\d+\.\s*)+/, "")
      .trim();
  };
  
  const isCurrentSection = (section: string) => {
    const normalizedCurrent = currentSection?.replace(/\*\*/g, "").trim() || "";
    const normalizedSection = section.replace(/\*\*/g, "").trim();
    return normalizedCurrent === normalizedSection;
  };
  
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
