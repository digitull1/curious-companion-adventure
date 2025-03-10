
import React, { useRef, useEffect } from "react";
import { CheckCircle, BookOpen, ArrowRight, ChevronRight, Plus } from "lucide-react";
import { animate } from "@motionone/dom";
import { Button } from "@/components/ui/button";

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
  if (lowerSection.includes("music") || lowerSection.includes("song") || lowerSection.includes("sound")) return "🎵";
  if (lowerSection.includes("water") || lowerSection.includes("cycle") || lowerSection.includes("rain")) return "💧";
  
  // Default emojis based on position in the list (for topics that don't match above)
  const defaultEmojis = ["📚", "✨", "💡", "🔍", "🧩"];
  
  return defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
};

// Process and separate multilingual sections
const processMultilingualSections = (sections: string[]): string[] => {
  console.log("[TableOfContents][Debug] Processing sections:", sections);
  if (!sections || sections.length === 0) {
    console.error("[TableOfContents][Error] No sections provided to process");
    return [];
  }
  
  // If we only have one section but it contains multiple lines or separators
  if (sections.length === 1) {
    const section = sections[0];
    
    // Check if it contains line breaks
    if (section.includes('\n')) {
      return section.split('\n').filter(s => s.trim().length > 0);
    }
    
    // Check if it contains numbered list
    const numberedPattern = /\d+\./;
    if (numberedPattern.test(section)) {
      return section.split(/\d+\./).filter(s => s.trim().length > 0);
    }
    
    // Check if it contains other common separators
    if (section.includes(';')) {
      return section.split(';').filter(s => s.trim().length > 0);
    }
  }
  
  return sections;
};

// Filter out introduction/welcome messages and table of contents headers
const filterIntroSections = (sections: string[]): string[] => {
  console.log("[TableOfContents][Debug] Filtering intro sections from:", sections);
  return sections.filter(section => {
    if (!section) return false;
    
    const lowerSection = section.toLowerCase();
    // Enhanced filtering to remove more introductory phrases
    return !(
      lowerSection.includes("welcome") ||
      lowerSection.includes("introduction") ||
      lowerSection.includes("hey there") ||
      lowerSection.includes("hello") ||
      lowerSection.includes("let's dive") ||
      lowerSection.includes("explore") ||
      lowerSection.includes("get ready") ||
      lowerSection.includes("here's") ||
      lowerSection.includes("here is") ||
      lowerSection.includes("table of content") ||
      lowerSection.includes("table of contents") ||
      lowerSection.includes("contents") ||
      lowerSection.includes("topics") ||
      lowerSection.includes("what we'll") ||
      lowerSection.includes("what we will") ||
      lowerSection.includes("let me teach") ||
      lowerSection.includes("learn about")
    );
  });
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
  const [showAllSections, setShowAllSections] = React.useState(false);
  
  // Debug log the sections passed to the component
  console.log("[TableOfContents][Debug] Original sections:", sections);
  
  // Validate sections array to prevent rendering errors
  if (!sections || !Array.isArray(sections)) {
    console.error("[TableOfContents][Error] Invalid sections provided:", sections);
    sections = ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5"];
  }
  
  // Process sections to handle multilingual content properly
  let processedSections = processMultilingualSections(sections);
  console.log("[TableOfContents][Debug] After multilingual processing:", processedSections);
  
  // Filter out introduction sections
  processedSections = filterIntroSections(processedSections);
  console.log("[TableOfContents][Debug] After filtering intros:", processedSections);
  
  // Ensure we have at least some sections to display
  if (processedSections.length === 0) {
    console.warn("[TableOfContents][Warn] No valid sections after processing, using fallback");
    processedSections = [
      "Introduction to the Topic",
      "Key Facts and Information",
      "Interesting Details",
      "Real-World Applications",
      "Fun Activities to Try"
    ];
  }
  
  // Now limit to 5 sections initially
  const limitedSections = showAllSections ? processedSections : processedSections.slice(0, 5);
  const hasMoreSections = processedSections.length > 5;
  
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
  }, [limitedSections]);
  
  // Add celebration animation when all sections are completed
  useEffect(() => {
    if (completedSections.length === processedSections.length && processedSections.length > 0 && celebrationRef.current) {
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
  }, [completedSections, processedSections]);
  
  // Calculate progress percentage
  const progressPercentage = processedSections.length 
    ? Math.round((completedSections.length / processedSections.length) * 100)
    : 0;
    
  return (
    <div className="mt-4 relative">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-3 border-b border-wonder-purple/10 rounded-t-xl flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg flex items-center">
          <div className="p-1.5 bg-wonder-purple/10 rounded-lg mr-2">
            <BookOpen className="text-wonder-purple h-5 w-5" />
          </div>
          <span>Your journey</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-wonder-purple to-wonder-purple-light rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="bg-wonder-purple/10 px-3 py-1 rounded-full text-wonder-purple font-medium text-sm">
            {progressPercentage}%
          </div>
        </div>
      </div>

      <div 
        className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-magical transition-all duration-300 relative overflow-hidden"
        ref={tocRef}
      >
        {/* Debug info - remove in production */}
        <div className="border border-yellow-200 bg-yellow-50 p-2 rounded mb-3 text-xs text-yellow-800">
          <p>Sections count: {sections.length}</p>
          <p>Processed sections: {processedSections.length}</p>
          <p>Completed sections: {completedSections.length}</p>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-wonder-purple/5 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-radial from-wonder-purple/10 to-transparent rounded-full"></div>
        
        <div className="space-y-3 relative">
          {limitedSections.map((section, index) => {
            if (!section) {
              console.error("[TableOfContents][Error] Invalid section at index", index);
              return null;
            }
            
            const isCompleted = completedSections.includes(section);
            const isCurrent = section === currentSection;
            const topicEmoji = getTopicEmoji(section);
            const cleanedSection = section.replace(/\*\*/g, '').trim();
            
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
                      : "bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-wonder-purple/20 hover:bg-wonder-purple/5 hover:shadow-magical"
                  }`}
                style={{ opacity: 0 }} // Start invisible for animation
              >
                <div className="flex items-center w-[85%]">
                  <div className={`flex-shrink-0 flex items-center justify-center min-w-8 h-8 rounded-full mr-3 transition-all 
                                 ${isCompleted 
                                  ? "bg-wonder-purple text-white shadow-magical" 
                                  : isCurrent
                                    ? "bg-wonder-blue text-white shadow-magical"
                                    : "bg-wonder-purple/10 text-wonder-purple"}`}>
                    {isCompleted 
                      ? <CheckCircle className="h-5 w-5" /> 
                      : <span className="text-sm font-medium">{index + 1}</span>
                    }
                  </div>
                  <div className="flex flex-col w-full">
                    <span className={`transition-colors ${
                      isCompleted 
                        ? "text-wonder-purple font-medium" 
                        : isCurrent
                          ? "text-wonder-blue font-medium"
                          : "group-hover:text-wonder-purple"
                    } line-clamp-2`}>
                      {cleanedSection} <span className="ml-1">{topicEmoji}</span>
                    </span>
                    {isCurrent && (
                      <span className="text-xs text-wonder-blue/70 mt-0.5">Current section</span>
                    )}
                  </div>
                </div>
                
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transform transition-all duration-300 
                               ${isCompleted 
                                  ? "bg-wonder-purple/10" 
                                  : isCurrent
                                    ? "bg-wonder-blue/10"
                                    : "bg-gray-100 group-hover:bg-wonder-purple/10"}`}>
                  <ArrowRight className={`h-4 w-4 transition-all transform 
                                       ${isCompleted 
                                        ? "text-wonder-purple" 
                                        : isCurrent
                                          ? "text-wonder-blue"
                                          : "text-gray-400 group-hover:text-wonder-purple group-hover:translate-x-0.5"}`} />
                </div>
              </button>
            );
          })}
          
          {/* Show more sections button */}
          {hasMoreSections && (
            <button
              onClick={() => setShowAllSections(!showAllSections)}
              className="w-full mt-3 py-2 px-4 bg-white/80 backdrop-blur-sm border border-wonder-purple/10 
                       rounded-lg flex items-center justify-center gap-2 text-wonder-purple hover:bg-wonder-purple/5 
                       hover:border-wonder-purple/20 transition-all duration-300 hover:shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>{showAllSections ? "Show fewer sections" : `Show ${processedSections.length - 5} more sections`}</span>
            </button>
          )}
        </div>
        
        {completedSections.length === processedSections.length && processedSections.length > 0 && (
          <div ref={celebrationRef} className="mt-6 bg-gradient-to-r from-wonder-purple/20 to-wonder-purple-dark/20 p-4 rounded-lg border border-wonder-purple/20 relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-wonder-purple font-medium text-base">
                🎉 Congratulations! You've completed all sections!
              </p>
              <p className="text-sm text-wonder-purple/80 mt-1">
                You've earned a learning badge for this topic!
              </p>
            </div>
            <div className="h-12 w-12 bg-white rounded-full shadow-magical flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        )}
        
        {/* Call to action after completing sections */}
        {completedSections.length === processedSections.length && processedSections.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="bg-white shadow-sm hover:shadow-magical border border-wonder-purple/10 hover:border-wonder-purple/20"
              onClick={() => onSectionClick("Generate more content")}
            >
              Generate more content
            </Button>
            <Button 
              variant="outline"
              className="bg-white shadow-sm hover:shadow-magical border border-wonder-purple/10 hover:border-wonder-purple/20"
              onClick={() => onSectionClick("Explore other topics")}
            >
              Try a new topic
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOfContents;
