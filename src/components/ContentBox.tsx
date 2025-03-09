
import React, { useRef, useEffect, useState, useCallback, memo } from "react";
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

// Clean text by removing asterisks
const cleanText = (text: string) => {
  return text.replace(/\*\*/g, "");
};

// Extract emojis from title if they exist
const extractEmoji = (text: string) => {
  const emojiRegex = /(\p{Emoji})/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches[0] : "✨";
};

// Format content with proper paragraph breaks
const formatContent = (content: string) => {
  return content
    .replace(/\n\n+/g, '</p><p class="mb-3">') // Replace double line breaks with paragraphs
    .replace(/\n/g, '<br />'); // Replace single line breaks with <br>
};

// Map BlockType to more descriptive titles, icons, and descriptions
const blockInfo = {
  "did-you-know": {
    title: "Did You Know?",
    description: "Fascinating facts about this topic",
    icon: (props: any) => <Lightbulb {...props} className="h-4 w-4 text-wonder-yellow" fill="currentColor" />,
    color: "from-wonder-yellow to-wonder-yellow-light",
    shadow: "shadow-[0_4px_12px_-2px_rgba(245,158,11,0.3)]"
  },
  "mind-blowing": {
    title: "Mind-Blowing Science",
    description: "Amazing scientific discoveries",
    icon: (props: any) => <AtomIcon {...props} className="h-4 w-4 text-wonder-blue" />,
    color: "from-wonder-blue to-wonder-blue-light",
    shadow: "shadow-[0_4px_12px_-2px_rgba(14,165,233,0.3)]"
  },
  "amazing-stories": {
    title: "Amazing Stories",
    description: "Incredible tales and legends",
    icon: (props: any) => <MessageSquareText {...props} className="h-4 w-4 text-wonder-purple" />,
    color: "from-wonder-purple to-wonder-purple-light",
    shadow: "shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]"
  },
  "see-it": {
    title: "See It in Action",
    description: "Visual exploration of the topic",
    icon: (props: any) => <Video {...props} className="h-4 w-4 text-wonder-green" />,
    color: "from-wonder-green to-wonder-green-light",
    shadow: "shadow-[0_4px_12px_-2px_rgba(16,185,129,0.3)]"
  },
  "quiz": {
    title: "Test Your Knowledge",
    description: "Fun quiz to test what you've learned",
    icon: (props: any) => <HelpCircle {...props} className="h-4 w-4 text-wonder-coral" />,
    color: "from-wonder-coral to-wonder-coral-light",
    shadow: "shadow-[0_4px_12px_-2px_rgba(244,63,94,0.3)]"
  }
};

// Use memo to prevent unnecessary rerenders and hold persistent state
const ContentBox: React.FC<ContentBoxProps> = memo(({
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
  // Use refs to store DOM elements
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Create a unique ID for logging and tracking this component instance
  const componentId = useRef(`contentbox-${Date.now()}`).current;
  
  // Local state management
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [expandedContent, setExpandedContent] = useState(true);
  
  // Clean and prepare displayed content
  const cleanedTitle = cleanText(title);
  const cleanedContent = cleanText(content);
  const cleanedPrevSection = prevSection ? cleanText(prevSection) : null;
  const cleanedNextSection = nextSection ? cleanText(nextSection) : null;
  const titleEmoji = extractEmoji(cleanedTitle);
  
  // Log significant prop changes to help with debugging
  useEffect(() => {
    console.log(`[ContentBox][${componentId}] Mounted/Updated with title: "${cleanedTitle.substring(0, 30)}..."`);
    console.log(`[ContentBox][${componentId}] activeBlock: ${activeBlock}, imagePrompt: ${imagePrompt ? "present" : "none"}, quiz: ${quiz ? "present" : "none"}`);
    console.log(`[ContentBox][${componentId}] blocks provided:`, blocks);
    
    return () => {
      console.log(`[ContentBox][${componentId}] Component unmounting`);
    };
  }, [cleanedTitle, activeBlock, imagePrompt, quiz, componentId, blocks]);
  
  // Only simulate content loading when title changes, not on every render
  useEffect(() => {
    setIsContentLoading(true);
    console.log(`[ContentBox][${componentId}] Starting content loading simulation`);
    
    const timer = setTimeout(() => {
      console.log(`[ContentBox][${componentId}] Finished content loading simulation`);
      setIsContentLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
    };
  }, [title, componentId]);
  
  // Apply animations when component mounts
  useEffect(() => {
    console.log(`[ContentBox][${componentId}] Applying animations`);
    
    if (contentBoxRef.current) {
      // Animate the content box in
      animate(
        contentBoxRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
    }
    
    if (navigationRef.current) {
      // Fade in navigation buttons
      animate(
        navigationRef.current,
        { opacity: [0, 1] },
        { duration: 0.4, delay: 0.5, easing: "ease-out" }
      );
    }
    
  }, [componentId]);
  
  // Apply highlight animations after content loads
  useEffect(() => {
    if (contentRef.current && !isContentLoading) {
      console.log(`[ContentBox][${componentId}] Highlighting keywords in content`);
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
  }, [isContentLoading, componentId]);
  
  // Handle navigation with debounce - prevent page refreshes
  const handleNavigation = useCallback((section: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`[ContentBox][${componentId}] Navigation clicked for section: ${section}`);
    setIsContentLoading(true);
    
    // Use a short delay to prevent rapid navigation
    setTimeout(() => {
      onNavigate(section);
    }, 100);
  }, [onNavigate, componentId]);
  
  // Log when interactive blocks are displayed
  useEffect(() => {
    if (activeBlock) {
      console.log(`[ContentBox][${componentId}] Displaying active block: ${activeBlock}`);
    }
    
    if (imagePrompt && activeBlock === 'see-it') {
      console.log(`[ContentBox][${componentId}] Displaying image with prompt: ${imagePrompt.substring(0, 50)}...`);
    }
    
    if (quiz && activeBlock === 'quiz') {
      console.log(`[ContentBox][${componentId}] Displaying quiz with question: ${quiz.question.substring(0, 50)}...`);
    }
  }, [activeBlock, imagePrompt, quiz, componentId]);
  
  return (
    <div 
      ref={contentBoxRef} 
      key={`content-box-${cleanedTitle}`}
      className="bg-white rounded-xl shadow-magical overflow-hidden border border-wonder-purple/10 mb-6 opacity-0 transform"
      aria-labelledby="content-title"
    >
      {/* Content header with emoji */}
      <div className="bg-gradient-to-r from-wonder-purple/10 to-wonder-blue/5 p-4 border-b border-wonder-purple/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-wonder-purple/20 to-wonder-purple/30 text-xl">
            {titleEmoji}
          </div>
          <h2 
            id="content-title"
            className="text-xl font-bubbly font-bold text-wonder-purple"
          >
            {cleanedTitle}
          </h2>
        </div>
        <button 
          onClick={() => setExpandedContent(prev => !prev)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-wonder-purple/10 transition-colors"
          aria-label={expandedContent ? "Collapse content" : "Expand content"}
        >
          <ChevronRight className={`h-5 w-5 text-wonder-purple transition-transform duration-300 ${expandedContent ? 'rotate-90' : ''}`} />
        </button>
      </div>
      
      {/* Main content with expandable animation */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedContent ? 'max-h-[2000px]' : 'max-h-0'}`}
      >
        <div className="p-5 md:p-6 space-y-4 min-h-[200px] relative">
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
                    __html: `<p class="mb-3">${formatContent(cleanedContent)}</p>`
                      .replace(/\b(important|fascinating|amazing|incredible|exciting|surprising)\b/gi, '<strong>$1</strong>')
                  }} 
                />
              </div>
              
              {/* Display image if there's an image prompt and active block is see-it */}
              {imagePrompt && activeBlock === 'see-it' && (
                <div className="mt-6 mb-6 animate-fade-in" key={`image-${imagePrompt.substring(0, 20)}`}>
                  <ImageBlock prompt={imagePrompt} />
                </div>
              )}
              
              {/* Display quiz if there's quiz data and active block is quiz */}
              {quiz && activeBlock === 'quiz' && (
                <div className="mt-6 mb-6 animate-fade-in" key={`quiz-${quiz.question.substring(0, 20)}`}>
                  <QuizBlock 
                    question={quiz.question} 
                    options={quiz.options}
                    correctAnswer={quiz.correctAnswer}
                    funFact={quiz.funFact}
                  />
                </div>
              )}
              
              {/* Removed Explore More section */}
            </>
          )}
        </div>
      </div>
      
      {/* Navigation controls with improved visual design */}
      <div ref={navigationRef} className="px-4 pb-4">
        <div className="flex items-center justify-between gap-3">
          {cleanedPrevSection ? (
            <button 
              onClick={(e) => handleNavigation(prevSection!, e)}
              className="flex-1 p-3 bg-white hover:bg-wonder-purple/5 border border-wonder-purple/20 rounded-xl 
                       shadow-sm hover:shadow-magical transition-all duration-300 transform hover:-translate-y-1 text-left
                       focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 focus:ring-offset-2 group"
              aria-label={`Previous topic: ${cleanedPrevSection}`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-wonder-purple/10 flex items-center justify-center mr-2 flex-shrink-0 group-hover:bg-wonder-purple/20 transition-colors">
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
              onClick={(e) => handleNavigation(nextSection!, e)}
              className="flex-1 p-3 bg-white hover:bg-wonder-purple/5 border border-wonder-purple/20 rounded-xl 
                       shadow-sm hover:shadow-magical transition-all duration-300 transform hover:-translate-y-1 text-right
                       focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 focus:ring-offset-2 group"
              aria-label={`Next topic: ${cleanedNextSection}`}
            >
              <div className="flex items-center justify-end">
                <div>
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium text-wonder-purple truncate max-w-[120px] sm:max-w-[200px]">{cleanedNextSection}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-wonder-purple/10 flex items-center justify-center ml-2 flex-shrink-0 group-hover:bg-wonder-purple/20 transition-colors">
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
});

ContentBox.displayName = 'ContentBox';

export default ContentBox;
