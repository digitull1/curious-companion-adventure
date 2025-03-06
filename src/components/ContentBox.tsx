
import React, { useState, useEffect, useRef } from "react";
import { animate } from "@motionone/dom";
import { ChevronLeft, ChevronRight, Book, Star, Sparkles } from "lucide-react";
import { BlockType } from "@/components/LearningBlock";

interface ContentBoxProps {
  title: string;
  content: string;
  prevSection: string | null;
  nextSection: string | null;
  blocks: BlockType[];
  onBlockClick: (block: BlockType) => void;
  onNavigate: (section: string) => void;
}

const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  content,
  prevSection,
  nextSection,
  blocks,
  onBlockClick,
  onNavigate
}) => {
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const exploreMoreRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  
  // Clean text by removing asterisks
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, "");
  };
  
  const cleanedTitle = cleanText(title);
  const cleanedContent = cleanText(content);
  const cleanedPrevSection = prevSection ? cleanText(prevSection) : null;
  const cleanedNextSection = nextSection ? cleanText(nextSection) : null;
  
  useEffect(() => {
    if (contentBoxRef.current) {
      // Animate the content box in
      animate(
        contentBoxRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
    }
    
    if (exploreMoreRef.current) {
      // Staggered animation for explore more links
      const links = exploreMoreRef.current.querySelectorAll('.explore-link');
      links.forEach((link, index) => {
        animate(
          link,
          { opacity: [0, 1], scale: [0.95, 1] },
          { duration: 0.3, delay: 0.3 + (index * 0.1), easing: "ease-out" }
        );
      });
    }
    
    if (navigationRef.current) {
      // Fade in navigation buttons
      animate(
        navigationRef.current,
        { opacity: [0, 1] },
        { duration: 0.4, delay: 0.5, easing: "ease-out" }
      );
    }
  }, [title, content]); // Re-run animations when content changes
  
  // Map BlockType to more descriptive titles and icons
  const blockInfo = {
    "did-you-know": {
      title: "Did You Know?",
      description: "Fascinating facts",
      icon: <Star className="h-4 w-4 text-wonder-yellow" fill="currentColor" />
    },
    "mind-blowing": {
      title: "Mind-Blowing Science",
      description: "Amazing discoveries",
      icon: <Sparkles className="h-4 w-4 text-wonder-blue" />
    },
    "amazing-stories": {
      title: "Amazing Stories",
      description: "Incredible tales",
      icon: <Book className="h-4 w-4 text-wonder-purple" />
    },
    "see-it": {
      title: "See It in Action",
      description: "Visual exploration",
      icon: <ChevronRight className="h-4 w-4 text-wonder-green" />
    },
    "quiz": {
      title: "Test Your Knowledge",
      description: "Fun quiz",
      icon: <Star className="h-4 w-4 text-wonder-coral" />
    }
  };
  
  return (
    <div 
      ref={contentBoxRef} 
      className="bg-white rounded-xl shadow-magical overflow-hidden border border-wonder-purple/10 mb-6 opacity-0 transform"
      aria-labelledby="content-title"
    >
      {/* Content header */}
      <div className="bg-gradient-to-r from-wonder-purple/10 to-wonder-blue/5 p-4 border-b border-wonder-purple/10">
        <h2 
          id="content-title"
          className="text-xl font-bubbly font-bold text-wonder-purple"
        >
          {cleanedTitle}
        </h2>
      </div>
      
      {/* Main content */}
      <div className="p-5 md:p-6 space-y-4">
        <div className="prose prose-sm sm:prose max-w-none">
          <p className="whitespace-pre-line leading-relaxed text-base font-rounded">
            {cleanedContent}
          </p>
        </div>
        
        {/* Explore More section */}
        <div ref={exploreMoreRef} className="mt-8 pt-4 border-t border-wonder-purple/10">
          <h3 className="text-sm font-medium text-wonder-purple mb-3">Explore More</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {blocks.map((block) => (
              <button
                key={block}
                onClick={() => onBlockClick(block)}
                className="explore-link group relative p-3 bg-white rounded-lg border border-wonder-purple/10 hover:border-wonder-purple/30 
                         shadow-sm hover:shadow-magical transition-all duration-300 transform hover:-translate-y-1 
                         flex flex-col items-center text-center opacity-0"
                aria-label={`Explore ${blockInfo[block].title}`}
              >
                <div className="w-8 h-8 rounded-full bg-wonder-purple/5 flex items-center justify-center mb-1">
                  {blockInfo[block].icon}
                </div>
                <span className="font-medium text-xs text-foreground">{blockInfo[block].title}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{blockInfo[block].description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation controls */}
      <div ref={navigationRef} className="px-4 pb-4 opacity-0">
        <div className="flex items-center justify-between gap-3">
          {cleanedPrevSection ? (
            <button 
              onClick={() => onNavigate(prevSection!)}
              className="flex-1 p-3 bg-white hover:bg-wonder-purple/5 border border-wonder-purple/20 rounded-xl 
                       shadow-sm hover:shadow-magical transition-all duration-300 transform hover:-translate-y-1 text-left
                       focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 focus:ring-offset-2"
              aria-label={`Previous topic: ${cleanedPrevSection}`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-wonder-purple/10 flex items-center justify-center mr-2 flex-shrink-0">
                  <ChevronLeft className="h-4 w-4 text-wonder-purple" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium text-wonder-purple truncate max-w-[120px] sm:max-w-[200px]">{cleanedPrevSection}</div>
                </div>
              </div>
            </button>
          ) : (
            <div className="flex-1"></div>
          )}
          
          {cleanedNextSection ? (
            <button 
              onClick={() => onNavigate(nextSection!)}
              className="flex-1 p-3 bg-white hover:bg-wonder-purple/5 border border-wonder-purple/20 rounded-xl 
                       shadow-sm hover:shadow-magical transition-all duration-300 transform hover:-translate-y-1 text-right
                       focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 focus:ring-offset-2"
              aria-label={`Next topic: ${cleanedNextSection}`}
            >
              <div className="flex items-center justify-end">
                <div>
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium text-wonder-purple truncate max-w-[120px] sm:max-w-[200px]">{cleanedNextSection}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-wonder-purple/10 flex items-center justify-center ml-2 flex-shrink-0">
                  <ChevronRight className="h-4 w-4 text-wonder-purple" />
                </div>
              </div>
            </button>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentBox;
