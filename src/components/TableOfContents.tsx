
import React, { useRef, useEffect } from "react";
import { CheckCircle, BookOpen, ArrowRight, ChevronRight, Plus, Lightbulb, MessageSquareText, Video, HelpCircle, Sparkles } from "lucide-react";
import { animate } from "@motionone/dom";
import { Button } from "@/components/ui/button";
import { BlockType } from "@/components/LearningBlock";

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
  onBlockClick?: (block: BlockType) => void;
}

// Emoji mapping for different topics
const getTopicEmoji = (section: string): string => {
  const lowerSection = section.toLowerCase();
  
  if (lowerSection === "explore more") return "🔍";
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
  const defaultEmojis = ["📚", "✨", "💡", "🔍"];
  
  return defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)];
};

// Process and separate multilingual sections
const processMultilingualSections = (sections: string[]): string[] => {
  console.log("Processing multilingual sections:", sections);
  if (sections.length === 0) return [];
  
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
  console.log("Filtering intro sections from:", sections);
  return sections.filter(section => {
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
  onSectionClick,
  onBlockClick
}) => {
  const tocRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const exploreMoreRef = useRef<HTMLDivElement>(null);
  const [showAllSections, setShowAllSections] = React.useState(false);
  
  // Process sections to handle multilingual content properly
  console.log("Original TOC sections:", sections);
  let processedSections = processMultilingualSections(sections);
  console.log("After multilingual processing:", processedSections);
  
  // Filter out introduction sections
  processedSections = filterIntroSections(processedSections);
  console.log("After filtering intros:", processedSections);
  
  // Add "Explore More" as the last section if it doesn't exist
  if (!processedSections.includes("Explore More")) {
    processedSections.push("Explore More");
    console.log("Added 'Explore More' section");
  }
  
  // Now limit to 5 sections initially (excluding Explore More)
  const exploreMoreIndex = processedSections.findIndex(s => s === "Explore More");
  const regularSections = exploreMoreIndex !== -1 
    ? processedSections.filter((_, i) => i !== exploreMoreIndex) 
    : processedSections;
  
  const displaySections = showAllSections 
    ? regularSections 
    : regularSections.slice(0, 5);
  
  // Always add Explore More to the displayed sections
  const limitedSections = exploreMoreIndex !== -1 
    ? [...displaySections, "Explore More"] 
    : displaySections;
  
  const hasMoreSections = regularSections.length > 5;
  
  // Determine if "Explore More" section is current
  const isExploreMoreCurrent = currentSection === "Explore More";
  
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
    
    // Animate explore more blocks if that section is active
    if (isExploreMoreCurrent && exploreMoreRef.current) {
      const blocks = exploreMoreRef.current.querySelectorAll('.explore-block');
      blocks.forEach((block, index) => {
        animate(
          block,
          { opacity: [0, 1], scale: [0.95, 1], y: [10, 0] },
          { duration: 0.4, easing: "ease-out", delay: 0.3 + (index * 0.1) }
        );
      });
    }
  }, [limitedSections, isExploreMoreCurrent]);
  
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
    
  const handleBlockClick = (type: BlockType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBlockClick) {
      console.log(`[TableOfContents] Block clicked: ${type}`);
      onBlockClick(type);
    }
  };

  // Block types to show in Explore More section
  const exploreBlocks: {type: BlockType, title: string, description: string, icon: React.ReactNode, color: string}[] = [
    {
      type: "did-you-know",
      title: "Did You Know?",
      description: "Fascinating facts about this topic",
      icon: <Lightbulb className="h-4 w-4" />,
      color: "bg-gradient-to-r from-wonder-yellow/80 to-wonder-yellow-light/40"
    },
    {
      type: "mind-blowing",
      title: "Related Topic 1",
      description: "Explore related fascinating topics",
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-gradient-to-r from-wonder-purple/80 to-wonder-purple-light/40"
    },
    {
      type: "amazing-stories",
      title: "Related Topic 2",
      description: "Discover connected subjects",
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-gradient-to-r from-wonder-blue/80 to-wonder-blue-light/40"
    },
    {
      type: "see-it",
      title: "See It In Action",
      description: "Visual exploration of the topic",
      icon: <Video className="h-4 w-4" />,
      color: "bg-gradient-to-r from-wonder-green/80 to-wonder-green-light/40"
    },
    {
      type: "quiz",
      title: "Test Your Knowledge",
      description: "Fun quizzes on what you've learned",
      icon: <HelpCircle className="h-4 w-4" />,
      color: "bg-gradient-to-r from-wonder-coral/80 to-wonder-coral-light/40"
    }
  ];
    
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
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-wonder-purple/5 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-radial from-wonder-purple/10 to-transparent rounded-full"></div>
        
        <div className="space-y-3 relative">
          {limitedSections.map((section, index) => {
            const isExploreMore = section === "Explore More";
            const isCompleted = isExploreMore ? false : completedSections.includes(section);
            const isCurrent = section === currentSection;
            const topicEmoji = getTopicEmoji(section);
            const cleanedSection = section.replace(/\*\*/g, '').trim();
            
            return (
              <div key={index}>
                <button
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
                        : isExploreMore
                          ? <Sparkles className="h-5 w-5" />
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
                        {cleanedSection} <span className="ml-1">{isExploreMore ? "" : topicEmoji}</span>
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
                
                {/* Show explore more blocks when "Explore More" section is active */}
                {isCurrent && isExploreMore && (
                  <div 
                    ref={exploreMoreRef}
                    className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-3 pb-3 animate-fade-in overflow-hidden rounded-lg"
                  >
                    <h4 className="col-span-full text-wonder-purple font-medium text-sm mb-1 mt-1 flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-wonder-yellow" />
                      Explore these interesting aspects:
                    </h4>
                    
                    {exploreBlocks.map((block, blockIndex) => (
                      <button
                        key={`explore-block-${blockIndex}`}
                        onClick={(e) => handleBlockClick(block.type, e)}
                        className={`explore-block group relative p-4 ${block.color} rounded-xl border border-wonder-purple/10 
                                  shadow-sm hover:shadow-magical transition-all duration-300 transform hover:-translate-y-1
                                  flex flex-col h-full opacity-0`}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                            {block.icon}
                          </div>
                          <h3 className="font-medium text-white">{block.title}</h3>
                        </div>
                        <p className="text-xs text-white/90 mb-2">{block.description}</p>
                        <div className="mt-auto flex justify-end">
                          <div className="bg-white/20 px-2 py-1 rounded-full text-white text-xs font-medium flex items-center">
                            Explore <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              <span>{showAllSections ? "Show fewer sections" : `Show ${regularSections.length - 5} more sections`}</span>
            </button>
          )}
        </div>
        
        {completedSections.length === processedSections.length - 1 && processedSections.length > 1 && (
          <div ref={celebrationRef} className="mt-6 bg-gradient-to-r from-wonder-purple/20 to-wonder-purple-dark/20 p-4 rounded-lg border border-wonder-purple/20 relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-wonder-purple font-medium text-base">
                Congratulations! You've completed all learning sections!
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
        {completedSections.length === processedSections.length - 1 && processedSections.length > 1 && (
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
