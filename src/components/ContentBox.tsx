
import React, { useState, useEffect, useRef } from "react";
import { animate } from "@motionone/dom";
import { ChevronLeft, ChevronRight, Book, Star, Sparkles, Lightbulb, AtomIcon, MessageSquareText, Video, HelpCircle, Loader2 } from "lucide-react";
import { BlockType } from "@/components/LearningBlock";
import ImageBlock from "@/components/ImageBlock";
import QuizBlock from "@/components/QuizBlock";

interface ContentBoxProps {
  title: string;
  content: string;
  prevSection: string | null;
  nextSection: string | null;
  blocks: BlockType[];
  onBlockClick: (block: BlockType) => void;
  onNavigate: (section: string) => void;
  activeBlock?: BlockType | null;
  imagePrompt?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    funFact?: string;
  };
}

const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  content,
  prevSection,
  nextSection,
  blocks,
  onBlockClick,
  onNavigate,
  activeBlock,
  imagePrompt,
  quiz
}) => {
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const exploreMoreRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  
  // Clean text by removing asterisks
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, "");
  };
  
  const cleanedTitle = cleanText(title);
  const cleanedContent = cleanText(content);
  const cleanedPrevSection = prevSection ? cleanText(prevSection) : null;
  const cleanedNextSection = nextSection ? cleanText(nextSection) : null;
  
  // Simulate content loading when navigating between sections
  useEffect(() => {
    setIsContentLoading(true);
    const timer = setTimeout(() => {
      setIsContentLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [title]);
  
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
    
    if (contentRef.current && !isContentLoading) {
      // Highlight keywords in the content with a subtle animation
      const keywords = contentRef.current.querySelectorAll('strong');
      keywords.forEach((keyword, index) => {
        animate(
          keyword,
          { color: ["#8B5CF6", "#8B5CF6"] },
          { duration: 0.5, delay: 0.5 + (index * 0.2), easing: "ease-out" }
        );
      });
    }
  }, [title, content, isContentLoading]);
  
  // Debug logs for quiz and image display
  useEffect(() => {
    if (activeBlock === 'see-it') {
      console.log("See-It block active, image prompt:", imagePrompt);
    }
    if (activeBlock === 'quiz') {
      console.log("Quiz block active, quiz data:", quiz);
    }
  }, [activeBlock, imagePrompt, quiz]);
  
  // Map BlockType to more descriptive titles, icons, and descriptions
  const blockInfo = {
    "did-you-know": {
      title: "Did You Know?",
      description: "Fascinating facts about this topic",
      icon: <Lightbulb className="h-4 w-4 text-wonder-yellow" fill="currentColor" />,
      color: "from-wonder-yellow to-wonder-yellow-light",
      shadow: "shadow-[0_4px_12px_-2px_rgba(245,158,11,0.3)]"
    },
    "mind-blowing": {
      title: "Mind-Blowing Science",
      description: "Amazing scientific discoveries",
      icon: <AtomIcon className="h-4 w-4 text-wonder-blue" />,
      color: "from-wonder-blue to-wonder-blue-light",
      shadow: "shadow-[0_4px_12px_-2px_rgba(14,165,233,0.3)]"
    },
    "amazing-stories": {
      title: "Amazing Stories",
      description: "Incredible tales and legends",
      icon: <MessageSquareText className="h-4 w-4 text-wonder-purple" />,
      color: "from-wonder-purple to-wonder-purple-light",
      shadow: "shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]"
    },
    "see-it": {
      title: "See It in Action",
      description: "Visual exploration of the topic",
      icon: <Video className="h-4 w-4 text-wonder-green" />,
      color: "from-wonder-green to-wonder-green-light",
      shadow: "shadow-[0_4px_12px_-2px_rgba(16,185,129,0.3)]"
    },
    "quiz": {
      title: "Test Your Knowledge",
      description: "Fun quiz to test what you've learned",
      icon: <HelpCircle className="h-4 w-4 text-wonder-coral" />,
      color: "from-wonder-coral to-wonder-coral-light",
      shadow: "shadow-[0_4px_12px_-2px_rgba(244,63,94,0.3)]"
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
      <div className="p-5 md:p-6 space-y-4 min-h-[300px] relative">
        {isContentLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-wonder-purple animate-spin" />
              <p className="mt-2 text-sm text-wonder-purple/70">Loading amazing content...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="prose prose-sm sm:prose max-w-none">
              <div 
                ref={contentRef}
                className="whitespace-pre-line leading-relaxed text-base font-rounded"
                dangerouslySetInnerHTML={{ 
                  __html: cleanedContent
                    .replace(/\b(important|fascinating|amazing|incredible|exciting|surprising)\b/gi, '<strong>$1</strong>')
                }} 
              />
            </div>
            
            {/* Display image if there's an image prompt and active block is see-it */}
            {imagePrompt && activeBlock === 'see-it' && (
              <div className="mt-6 mb-6" key={`image-${imagePrompt.substring(0, 20)}`}>
                <ImageBlock prompt={imagePrompt} />
              </div>
            )}
            
            {/* Display quiz if there's quiz data and active block is quiz */}
            {quiz && activeBlock === 'quiz' && (
              <div className="mt-6 mb-6" key={`quiz-${quiz.question.substring(0, 20)}`}>
                <QuizBlock 
                  question={quiz.question} 
                  options={quiz.options}
                  correctAnswer={quiz.correctAnswer}
                  funFact={quiz.funFact}
                />
              </div>
            )}
            
            {/* Explore More section */}
            <div ref={exploreMoreRef} className="mt-8 pt-4 border-t border-wonder-purple/10">
              <h3 className="text-sm font-medium text-wonder-purple mb-3">Explore More</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {blocks.map((block) => (
                  <button
                    key={block}
                    onClick={() => onBlockClick(block)}
                    className={`explore-link group relative p-3 bg-gradient-to-br ${
                      activeBlock === block ? blockInfo[block].color : 'from-white to-white/90'
                    } rounded-lg border ${
                      activeBlock === block ? 'border-transparent' : 'border-wonder-purple/10 hover:border-wonder-purple/30'
                    } ${blockInfo[block].shadow} transition-all duration-300 transform hover:-translate-y-1 
                    flex flex-col items-center text-center opacity-0`}
                    aria-label={`Explore ${blockInfo[block].title}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${
                      activeBlock === block ? 'bg-white/20' : 'bg-wonder-purple/5'
                    } flex items-center justify-center mb-1`}>
                      {blockInfo[block].icon}
                    </div>
                    <span className={`font-medium text-xs ${
                      activeBlock === block ? 'text-white' : 'text-foreground'
                    }`}>{blockInfo[block].title}</span>
                    <span className={`text-[10px] ${
                      activeBlock === block ? 'text-white/80' : 'text-muted-foreground'
                    } mt-0.5 hidden sm:block`}>{blockInfo[block].description}</span>
                    
                    {/* Magical sparkle effect for active blocks */}
                    {activeBlock === block && (
                      <div className="absolute top-0 right-0 h-6 w-6 pointer-events-none">
                        <Sparkles className="h-5 w-5 text-white/60 animate-sparkle absolute" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Navigation controls */}
      <div ref={navigationRef} className="px-4 pb-4 opacity-0">
        <div className="flex items-center justify-between gap-3">
          {cleanedPrevSection ? (
            <button 
              onClick={() => {
                setIsContentLoading(true);
                onNavigate(prevSection!);
              }}
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
              onClick={() => {
                setIsContentLoading(true);
                onNavigate(nextSection!);
              }}
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
