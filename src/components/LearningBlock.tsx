
import React, { useRef, useEffect, useState } from "react";
import { BookOpen, Rocket, History, Image, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { animate } from "@motionone/dom";

export type BlockType = "did-you-know" | "mind-blowing" | "amazing-stories" | "see-it" | "quiz";

interface LearningBlockProps {
  type: BlockType;
  onClick: () => void;
}

const LearningBlock: React.FC<LearningBlockProps> = ({ type, onClick }) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const clickTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (blockRef.current) {
      console.log(`[LearningBlock] Block of type ${type} mounted`);
      // Add hover animation
      blockRef.current.addEventListener('mouseenter', () => {
        animate(
          blockRef.current!,
          { y: [-2, -4, -2], scale: [1, 1.02, 1] },
          { duration: 0.4, easing: "ease-in-out" }
        );
      });
    }
    
    return () => {
      console.log(`[LearningBlock] Block of type ${type} unmounted`);
      // Clear any timeouts to prevent memory leaks
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [type]);
  
  const getBlockContent = () => {
    console.log(`[LearningBlock] Rendering content for block type: ${type}`);
    switch (type) {
      case "did-you-know":
        return {
          icon: <BookOpen className="h-4 w-4" />,
          title: "Did You Know?",
          description: "Discover fascinating facts",
          className: "learning-block-did-you-know",
          gradient: "from-wonder-yellow/80 to-wonder-yellow-light/40",
          shadowColor: "shadow-[0_4px_12px_-2px_rgba(245,158,11,0.25)]"
        };
      case "mind-blowing":
        return {
          icon: <Rocket className="h-4 w-4" />,
          title: "Mind-Blowing Science",
          description: "Explore amazing scientific concepts",
          className: "learning-block-mind-blowing",
          gradient: "from-wonder-purple/80 to-wonder-purple-light/40",
          shadowColor: "shadow-[0_4px_12px_-2px_rgba(124,58,237,0.25)]"
        };
      case "amazing-stories":
        return {
          icon: <History className="h-4 w-4" />,
          title: "Amazing Stories",
          description: "Hear incredible tales and legends",
          className: "learning-block-amazing-stories",
          gradient: "from-wonder-yellow/80 to-wonder-yellow-light/40",
          shadowColor: "shadow-[0_4px_12px_-2px_rgba(245,158,11,0.25)]"
        };
      case "see-it":
        return {
          icon: <Image className="h-4 w-4" />,
          title: "See It in Action",
          description: "Visual learning resources",
          className: "learning-block-see-it",
          gradient: "from-wonder-green/80 to-wonder-green-light/40",
          shadowColor: "shadow-[0_4px_12px_-2px_rgba(16,185,129,0.25)]"
        };
      case "quiz":
        return {
          icon: <HelpCircle className="h-4 w-4" />,
          title: "Test Your Knowledge",
          description: "Fun quizzes to reinforce learning",
          className: "learning-block-quiz",
          gradient: "from-wonder-coral/80 to-wonder-coral-light/40",
          shadowColor: "shadow-[0_4px_12px_-2px_rgba(244,63,94,0.25)]"
        };
      default:
        return {
          icon: <BookOpen className="h-4 w-4" />,
          title: "Did You Know?",
          description: "Discover fascinating facts",
          className: "learning-block-did-you-know",
          gradient: "from-wonder-yellow/80 to-wonder-yellow-light/40",
          shadowColor: "shadow-[0_4px_12px_-2px_rgba(14,165,233,0.25)]"
        };
    }
  };

  const { icon, title, description, className, gradient, shadowColor } = getBlockContent();
  
  // Prevent page refreshes and propagation
  const toggleExpand = (e: React.MouseEvent) => {
    console.log("Toggle expand clicked for block type:", type);
    
    // Prevent default browser behavior and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    
    setExpanded(!expanded);
  };

  // Debounced handler to prevent double clicks
  const handleExploreClick = (e: React.MouseEvent) => {
    // Prevent default browser behavior and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Explore button clicked for block type:", type);
    
    // Prevent multiple rapid clicks
    if (isClicked) {
      console.log("Click ignored - already processing");
      return;
    }
    
    // Visual feedback that button was clicked
    setIsClicked(true);
    
    // Call the handler
    onClick();
    
    // Reset clicked state after animation completes
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = window.setTimeout(() => {
      setIsClicked(false);
      clickTimeoutRef.current = null;
    }, 1000);
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    // Prevent default browser behavior
    e.preventDefault();
    
    console.log("Block clicked for block type:", type);
    
    if (!expanded) {
      setExpanded(true);
    }
  };

  return (
    <div
      ref={blockRef}
      className={`relative rounded-xl border border-wonder-purple/10 bg-white/90 backdrop-blur-sm 
      transition-all duration-300 overflow-hidden flex-shrink-0 snap-center 
      ${shadowColor} ${expanded ? "h-auto" : "h-12"} min-w-[180px] sm:min-w-[220px] cursor-pointer`}
      onClick={handleBlockClick}
      style={{ opacity: 1, display: 'block' }} /* Explicitly set visible styles */
    >
      {/* Subtle background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-xl z-0`}></div>
      
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between p-3 z-10"
      >
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full bg-white/70 backdrop-blur-sm ${shadowColor}`}>
            {icon}
          </div>
          <h3 className="font-medium text-sm truncate">{title}</h3>
        </div>
        <button 
          type="button"
          className="text-wonder-purple/70 hover:text-wonder-purple transition-colors"
          onClick={toggleExpand}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Expanded content */}
      <div className={`px-3 pb-3 pt-0 ${expanded ? "block" : "hidden"}`}>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <button
          type="button"
          onClick={handleExploreClick}
          disabled={isClicked}
          className={`w-full py-2 px-3 text-xs font-medium text-white rounded-lg bg-gradient-to-r from-wonder-purple to-wonder-purple-dark transition-all duration-300 transform ${
            isClicked ? 'scale-95 opacity-80' : 'hover:scale-102 hover:shadow-magical-hover'
          } active:scale-98 focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 focus:ring-offset-2`}
        >
          {isClicked ? 'Loading...' : 'Explore'}
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-1 right-1 opacity-20 z-0">
        <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse-soft"></div>
      </div>
    </div>
  );
};

export default LearningBlock;
