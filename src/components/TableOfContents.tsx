
import React, { useRef, useEffect, useState } from "react";
import { CheckCircle, BookOpen, ChevronRight, Plus, Map, Award, Navigation } from "lucide-react";
import { animate, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

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
  onSectionClick
}) => {
  const tocRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const celebrationRef = useRef<HTMLDivElement>(null);
  const [showAllSections, setShowAllSections] = useState(false);
  
  // Process sections to handle multilingual content properly
  console.log("Original TOC sections:", sections);
  let processedSections = processMultilingualSections(sections);
  console.log("After multilingual processing:", processedSections);
  
  // Filter out introduction sections
  processedSections = filterIntroSections(processedSections);
  console.log("After filtering intros:", processedSections);
  
  // Now limit to 5 sections initially
  const limitedSections = showAllSections ? processedSections : processedSections.slice(0, 5);
  const hasMoreSections = processedSections.length > 5;
  
  // Calculate progress percentage
  const progressPercentage = processedSections.length 
    ? Math.round((completedSections.length / processedSections.length) * 100)
    : 0;
  
  // Track if all sections are complete for celebration
  const allSectionsComplete = 
    processedSections.length > 0 && 
    completedSections.length === processedSections.length;

  // Launch confetti when all sections complete
  useEffect(() => {
    if (allSectionsComplete && celebrationRef.current) {
      // Launch confetti
      const launchConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      };
      
      // Delay confetti to ensure it's visible after rendering
      setTimeout(launchConfetti, 500);
      
      // Add some particle animations as well
      const particles = Array.from({ length: 15 }).map(() => {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full animate-float-up';
        
        // Randomize particle appearance
        const size = Math.random() * 12 + 8;
        const colors = ['bg-wonder-purple', 'bg-wonder-yellow', 'bg-wonder-blue', 'bg-wonder-coral'];
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        
        particle.classList.add(colorClass);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = '0.8';
        
        return particle;
      });
      
      particles.forEach(particle => celebrationRef.current?.appendChild(particle));
      
      // Remove particles after animation
      setTimeout(() => {
        particles.forEach(particle => particle.remove());
      }, 3000);
    }
  }, [allSectionsComplete]);

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        delay: 0.1 + (i * 0.08)
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 10px 25px rgba(124, 58, 237, 0.2)",
      transition: { duration: 0.2 }
    },
    tap: {
      y: -3,
      boxShadow: "0 5px 15px rgba(124, 58, 237, 0.15)",
      transition: { duration: 0.1 }
    }
  };
  
  // Animation for the container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delayChildren: 0.2,
        staggerChildren: 0.08
      }
    }
  };
    
  return (
    <div className="mt-6 relative">
      <motion.div 
        className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm p-3 border-b border-wonder-purple/10 rounded-t-xl 
                  flex items-center justify-between mb-2 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-bold text-lg flex items-center">
          <div className="p-1.5 bg-wonder-purple/10 rounded-lg mr-2">
            <Map className="text-wonder-purple h-5 w-5" />
          </div>
          <span>Learning Journey</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-wonder-purple to-wonder-purple-light rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
          <motion.div 
            className="bg-wonder-purple/10 px-3 py-1 rounded-full text-wonder-purple font-medium text-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 1] }}
            transition={{ duration: 0.5 }}
          >
            {progressPercentage}%
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-magical transition-all duration-300 relative overflow-hidden"
        ref={tocRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-wonder-purple/5 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-radial from-wonder-purple/10 to-transparent rounded-full"></div>
        
        <div className="space-y-3 relative">
          {limitedSections.map((section, index) => {
            const isCompleted = completedSections.includes(section);
            const isCurrent = section === currentSection;
            const topicEmoji = getTopicEmoji(section);
            const cleanedSection = section.replace(/\*\*/g, '').trim();
            
            return (
              <motion.button
                key={index}
                ref={el => sectionsRef.current[index] = el}
                onClick={() => onSectionClick(section)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between 
                  transition-all duration-300 transform touch-manipulation group
                  ${isCompleted
                    ? "bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 border border-wonder-purple/20"
                    : isCurrent
                      ? "bg-gradient-to-r from-wonder-blue/10 to-wonder-blue/5 border border-wonder-blue/20 shadow-magical"
                      : "bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-wonder-purple/20 hover:bg-wonder-purple/5"
                  }`}
                variants={sectionVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
              >
                <div className="flex items-center w-[85%]">
                  <div className={`flex-shrink-0 flex items-center justify-center min-w-10 h-10 rounded-full mr-3
                                 ${isCompleted 
                                  ? "bg-gradient-to-br from-wonder-purple to-wonder-purple-light text-white shadow-magical" 
                                  : isCurrent
                                    ? "bg-gradient-to-br from-wonder-blue to-wonder-blue-light text-white shadow-magical"
                                    : "bg-wonder-purple/10 text-wonder-purple"}`}>
                    {isCompleted 
                      ? <CheckCircle className="h-5 w-5" /> 
                      : <span className="text-sm font-medium">{index + 1}</span>
                    }
                  </div>
                  <div className="flex flex-col">
                    <motion.span 
                      className={`transition-colors ${
                        isCompleted 
                          ? "text-wonder-purple font-medium" 
                          : isCurrent
                            ? "text-wonder-blue font-medium"
                            : "group-hover:text-wonder-purple"
                      } line-clamp-2`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                    >
                      {cleanedSection} <span className="ml-1">{topicEmoji}</span>
                    </motion.span>
                    {isCurrent && (
                      <motion.span 
                        className="text-xs text-wonder-blue/70 mt-0.5 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                      >
                        <Navigation className="h-3 w-3 mr-1 animate-pulse" />
                        Currently exploring
                      </motion.span>
                    )}
                  </div>
                </div>
                
                <motion.div 
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transform transition-all duration-300
                               ${isCompleted 
                                  ? "bg-wonder-purple/10" 
                                  : isCurrent
                                    ? "bg-wonder-blue/10"
                                    : "bg-gray-100 group-hover:bg-wonder-purple/10"}`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className={`h-5 w-5 transition-all transform 
                                       ${isCompleted 
                                        ? "text-wonder-purple" 
                                        : isCurrent
                                          ? "text-wonder-blue"
                                          : "text-gray-400 group-hover:text-wonder-purple"}`} />
                </motion.div>
              </motion.button>
            );
          })}
          
          {/* Show more sections button */}
          {hasMoreSections && (
            <motion.button
              onClick={() => setShowAllSections(!showAllSections)}
              className="w-full mt-3 py-2.5 px-4 bg-white/90 backdrop-blur-sm border border-wonder-purple/10 
                       rounded-lg flex items-center justify-center gap-2 text-wonder-purple hover:bg-wonder-purple/5 
                       hover:border-wonder-purple/20 transition-all duration-300 hover:shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -3, boxShadow: "0 6px 15px rgba(124, 58, 237, 0.15)" }}
              whileTap={{ y: -1 }}
            >
              <Plus className="h-4 w-4" />
              <span>{showAllSections ? "Show fewer sections" : `Show ${processedSections.length - 5} more sections`}</span>
            </motion.button>
          )}
        </div>
        
        {/* Show celebration when all sections complete */}
        {allSectionsComplete && (
          <motion.div 
            ref={celebrationRef}
            className="mt-6 bg-gradient-to-r from-wonder-yellow/20 via-wonder-purple/20 to-wonder-purple-dark/20 p-5 rounded-xl border border-wonder-purple/20 relative overflow-hidden flex items-center justify-between"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          >
            <div>
              <motion.p 
                className="text-wonder-purple font-bold text-lg flex items-center gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span>🎉</span> Amazing job!
              </motion.p>
              <motion.p 
                className="text-sm text-wonder-purple/80 mt-1"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                You've earned a special learning badge!
              </motion.p>
            </div>
            <motion.div 
              className="h-16 w-16 bg-white rounded-full shadow-magical flex items-center justify-center"
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                delay: 0.8,
                duration: 0.7,
                type: "spring",
                bounce: 0.5
              }}
            >
              <Award className="h-9 w-9 text-wonder-purple" />
            </motion.div>
          </motion.div>
        )}
        
        {/* Call to action after completing sections */}
        {allSectionsComplete && (
          <motion.div 
            className="mt-4 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button 
              variant="outline"
              className="bg-white shadow-sm hover:shadow-magical border border-wonder-purple/10 hover:border-wonder-purple/20 hover:-translate-y-1 transition-all"
              onClick={() => onSectionClick("Generate more content")}
            >
              Learn more about this
            </Button>
            <Button 
              variant="outline"
              className="bg-white shadow-sm hover:shadow-magical border border-wonder-purple/10 hover:border-wonder-purple/20 hover:-translate-y-1 transition-all"
              onClick={() => onSectionClick("Explore other topics")}
            >
              Try a new topic
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TableOfContents;
