
import React, { useRef, useEffect } from "react";
import { CheckCircle, BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { animate } from "@motionone/dom";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
}

// Emoji mapping for different topics
const getTopicEmoji = (section: string): string => {
  const lowerSection = section.toLowerCase();
  
  if (lowerSection.includes("planet") || lowerSection.includes("space") || lowerSection.includes("star") || lowerSection.includes("galaxy")) return "🌌";
  if (lowerSection.includes("rocket") || lowerSection.includes("astronaut")) return "🚀";
  if (lowerSection.includes("animal") || lowerSection.includes("wildlife")) return "🦁";
  if (lowerSection.includes("ocean") || lowerSection.includes("sea") || lowerSection.includes("marine")) return "🌊";
  if (lowerSection.includes("plant") || lowerSection.includes("tree") || lowerSection.includes("flower")) return "🌱";
  if (lowerSection.includes("dino")) return "🦕";
  if (lowerSection.includes("history")) return "📜";
  if (lowerSection.includes("robot") || lowerSection.includes("computer") || lowerSection.includes("tech")) return "🤖";
  if (lowerSection.includes("math") || lowerSection.includes("number")) return "🔢";
  if (lowerSection.includes("science") || lowerSection.includes("experiment")) return "🔬";
  if (lowerSection.includes("body") || lowerSection.includes("health") || lowerSection.includes("human")) return "🧠";
  if (lowerSection.includes("food") || lowerSection.includes("eat")) return "🍎";
  if (lowerSection.includes("art") || lowerSection.includes("draw") || lowerSection.includes("paint")) return "🎨";
  if (lowerSection.includes("music") || lowerSection.includes("song")) return "🎵";
  
  // Default emojis based on position in the list (for topics that don't match above)
  const defaultEmojis = ["📚", "✨", "💡", "🔍", "🧩"];
  
  return defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  sections, 
  completedSections,
  currentSection,
  onSectionClick
}) => {
  const tocRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const celebrationRef = useRef<HTMLDivElement>(null);
  
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
  
  // Add celebration animation when all sections are completed
  useEffect(() => {
    if (completedSections.length === sections.length && sections.length > 0 && celebrationRef.current) {
      // Animate confetti or celebration effects
      const particles = Array.from({ length: 20 }).map(() => {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full bg-wonder-purple animate-float-up';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = `${Math.random() * 10 + 5}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = '0';
        particle.style.opacity = '0.8';
        return particle;
      });
      
      particles.forEach(particle => celebrationRef.current?.appendChild(particle));
      
      // Remove particles after animation
      setTimeout(() => {
        particles.forEach(particle => particle.remove());
      }, 3000);
    }
  }, [completedSections, sections]);
  
  // Calculate progress percentage
  const progressPercentage = sections.length 
    ? Math.round((completedSections.length / sections.length) * 100)
    : 0;
    
  return (
    <div className="mt-4 relative">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-3 border-b border-wonder-purple/10 rounded-t-xl flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg flex items-center">
          <div className="p-1.5 bg-wonder-purple/10 rounded-lg mr-2">
            <BookOpen className="text-wonder-purple h-5 w-5" />
          </div>
          <span>Your progress</span>
        </h3>
        <div className="bg-wonder-purple/10 px-3 py-1 rounded-full text-wonder-purple font-medium">
          {progressPercentage}%
        </div>
      </div>

      <div 
        className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-pixar transition-all duration-300 hover:shadow-magical relative overflow-hidden"
        ref={tocRef}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-wonder-purple/5 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-radial from-wonder-purple/10 to-transparent rounded-full"></div>
        
        <div className="space-y-2 relative">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section);
            const isCurrent = section === currentSection;
            const isNext = !currentSection && completedSections.length === 0 && index === 0 ? false : section === getNextSection();
            const topicEmoji = getTopicEmoji(section);
            
            return (
              <button
                key={index}
                ref={el => sectionsRef.current[index] = el}
                onClick={() => onSectionClick(section)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-300
                  transform hover:-translate-y-1 active:translate-y-0 group touch-manipulation
                  ${isCompleted
                    ? "bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 border border-wonder-purple/20 shadow-sm"
                    : isCurrent
                      ? "bg-gradient-to-r from-wonder-blue/10 to-wonder-blue/5 border border-wonder-blue/20 shadow-magical"
                      : isNext
                        ? "bg-gradient-to-r from-wonder-blue/5 to-wonder-blue/2 border border-wonder-blue/10 shadow-sm"
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
                                      ? "bg-wonder-blue/70 text-white"
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
                          ? "text-wonder-blue-dark"
                          : "group-hover:text-wonder-purple"
                  }`}>
                    {section} <span className="ml-1">{topicEmoji}</span>
                  </span>
                </div>
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transform transition-all duration-300 
                               ${isCompleted 
                                  ? "bg-wonder-purple/10" 
                                  : isCurrent
                                    ? "bg-wonder-blue/10"
                                    : isNext
                                      ? "bg-wonder-blue/10"
                                      : "bg-gray-100 group-hover:bg-wonder-purple/10"}`}>
                  <ArrowRight className={`h-3.5 w-3.5 transition-all transform 
                                       ${isCompleted 
                                        ? "text-wonder-purple" 
                                        : isCurrent
                                          ? "text-wonder-blue"
                                          : isNext
                                            ? "text-wonder-blue-dark"
                                            : "text-gray-400 group-hover:text-wonder-purple group-hover:translate-x-0.5"}`} />
                </div>
              </button>
            );
          })}
        </div>
        
        {completedSections.length === sections.length && sections.length > 0 && (
          <div ref={celebrationRef} className="mt-4 bg-gradient-to-r from-wonder-purple/20 to-wonder-purple-dark/20 p-4 rounded-lg border border-wonder-purple/20 relative overflow-hidden">
            <p className="text-center text-wonder-purple font-medium">
              🎉 Congratulations! You've completed all sections! 🏆
            </p>
            <p className="text-center text-sm text-wonder-purple/80 mt-1">
              You've earned a learning badge for this topic!
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
  // Determine the next section to study
  function getNextSection() {
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
  }
};

export default TableOfContents;
