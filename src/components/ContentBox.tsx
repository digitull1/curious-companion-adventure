
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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

// Use memo to prevent unnecessary rerenders
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
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const exploreMoreRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blockClickTimeoutRef = useRef<number | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [expandedContent, setExpandedContent] = useState(true);
  const [internalRenderKey, setInternalRenderKey] = useState(Date.now());
  const [isExploreVisible, setIsExploreVisible] = useState(true); // Added state to track visibility
  
  // Track state for logging
  const prevActiveBlockRef = useRef<BlockType | null | undefined>(null);
  const prevImagePromptRef = useRef<string | undefined>(undefined);
  const prevQuizRef = useRef<typeof quiz | undefined>(undefined);
  
  // Clean and prepare displayed content
  const cleanedTitle = cleanText(title);
  const cleanedContent = cleanText(content);
  const cleanedPrevSection = prevSection ? cleanText(prevSection) : null;
  const cleanedNextSection = nextSection ? cleanText(nextSection) : null;
  const titleEmoji = extractEmoji(cleanedTitle);
  
  // Log significant prop changes to help with debugging
  useEffect(() => {
    console.log(`[ContentBox][${internalRenderKey}] Mounted/Updated with title: "${cleanedTitle.substring(0, 30)}..."`);
    console.log(`[ContentBox][${internalRenderKey}] activeBlock: ${activeBlock}, imagePrompt: ${imagePrompt ? "present" : "none"}, quiz: ${quiz ? "present" : "none"}`);
    console.log(`[ContentBox][${internalRenderKey}] blocks provided:`, blocks);
    
    // Compare with previous state
    if (prevActiveBlockRef.current !== activeBlock) {
      console.log(`[ContentBox][${internalRenderKey}] ActiveBlock changed: ${prevActiveBlockRef.current} -> ${activeBlock}`);
      prevActiveBlockRef.current = activeBlock;
    }
    
    if ((prevImagePromptRef.current && !imagePrompt) || (!prevImagePromptRef.current && imagePrompt)) {
      console.log(`[ContentBox][${internalRenderKey}] ImagePrompt changed: ${prevImagePromptRef.current ? "present" : "none"} -> ${imagePrompt ? "present" : "none"}`);
      prevImagePromptRef.current = imagePrompt;
    }
    
    if ((prevQuizRef.current && !quiz) || (!prevQuizRef.current && quiz)) {
      console.log(`[ContentBox][${internalRenderKey}] Quiz changed: ${prevQuizRef.current ? "present" : "none"} -> ${quiz ? "present" : "none"}`);
      prevQuizRef.current = quiz;
    }
    
    // Force explore section visibility if blocks are provided
    if (blocks && blocks.length > 0) {
      console.log(`[ContentBox][${internalRenderKey}] Setting explore section visible due to blocks being provided:`, blocks);
      setIsExploreVisible(true);
    }
    
    return () => {
      console.log(`[ContentBox][${internalRenderKey}] Unmounting component`);
    };
  }, [cleanedTitle, activeBlock, imagePrompt, quiz, internalRenderKey, blocks]);
  
  // Simulate content loading when navigating between sections
  useEffect(() => {
    setIsContentLoading(true);
    console.log(`[ContentBox][${internalRenderKey}] Starting content loading simulation`);
    
    const timer = setTimeout(() => {
      console.log(`[ContentBox][${internalRenderKey}] Finished content loading simulation`);
      setIsContentLoading(false);
    }, 800);
    
    return () => {
      console.log(`[ContentBox][${internalRenderKey}] Clearing content loading timer`);
      clearTimeout(timer);
    };
  }, [title, internalRenderKey]);
  
  // Apply animations when component mounts
  useEffect(() => {
    console.log(`[ContentBox][${internalRenderKey}] Applying animations`);
    
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
      console.log(`[ContentBox][${internalRenderKey}] Found ${links.length} explore links to animate`);
      
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
    
  }, [internalRenderKey]);
  
  // Apply highlight animations after content loads
  useEffect(() => {
    if (contentRef.current && !isContentLoading) {
      console.log(`[ContentBox][${internalRenderKey}] Highlighting keywords in content`);
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
  }, [isContentLoading, internalRenderKey]);
  
  // Stable handler for block buttons with debounce to prevent double clicks
  const handleBlockButtonClick = useCallback((blockType: BlockType, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log(`[ContentBox][${internalRenderKey}] Block button clicked: ${blockType}`);
    
    // Clear any existing timeout
    if (blockClickTimeoutRef.current) {
      clearTimeout(blockClickTimeoutRef.current);
    }
    
    // Set a flag on the window object to prevent multiple consecutive clicks
    if ((window as any)._blockClickInProgress) {
      console.log(`[ContentBox] Block click already in progress, ignoring this click`);
      return;
    }
    
    (window as any)._blockClickInProgress = true;
    
    // Call the handler immediately
    onBlockClick(blockType);
    
    // Set a timeout to clear the flag
    blockClickTimeoutRef.current = window.setTimeout(() => {
      console.log(`[ContentBox] Clearing block click in progress flag`);
      (window as any)._blockClickInProgress = false;
      blockClickTimeoutRef.current = null;
    }, 1000) as unknown as number;
  }, [onBlockClick, internalRenderKey]);
  
  // Handle navigation with debounce
  const handleNavigation = useCallback((section: string) => {
    console.log(`[ContentBox][${internalRenderKey}] Navigation clicked for section: ${section}`);
    setIsContentLoading(true);
    
    // Generate a new render key to force re-render on navigation
    setInternalRenderKey(Date.now());
    
    // Set a short delay to prevent rapid navigation
    setTimeout(() => {
      onNavigate(section);
    }, 100);
  }, [onNavigate, internalRenderKey]);
  
  // Log when interactive blocks are displayed
  useEffect(() => {
    if (activeBlock) {
      console.log(`[ContentBox][${internalRenderKey}] Displaying active block: ${activeBlock}`);
    }
    
    if (imagePrompt && activeBlock === 'see-it') {
      console.log(`[ContentBox][${internalRenderKey}] Displaying image with prompt: ${imagePrompt.substring(0, 50)}...`);
    }
    
    if (quiz && activeBlock === 'quiz') {
      console.log(`[ContentBox][${internalRenderKey}] Displaying quiz with question: ${quiz.question.substring(0, 50)}...`);
    }
  }, [activeBlock, imagePrompt, quiz, internalRenderKey]);
  
  // Ensure blocks is an array with default values if not provided
  const safeBlocks = Array.isArray(blocks) && blocks.length > 0 
    ? blocks 
    : ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"] as BlockType[];

  console.log(`[ContentBox][${internalRenderKey}] Using safe blocks:`, safeBlocks);
  
  return (
    <div 
      ref={contentBoxRef} 
      key={`content-box-${cleanedTitle}-${activeBlock || 'none'}`}
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
                <div className="mt-6 mb-6 animate-fade-in" key={`image-${imagePrompt.substring(0, 20)}-${internalRenderKey}`}>
                  <ImageBlock prompt={imagePrompt} />
                </div>
              )}
              
              {/* Display quiz if there's quiz data and active block is quiz */}
              {quiz && activeBlock === 'quiz' && (
                <div className="mt-6 mb-6 animate-fade-in" key={`quiz-${quiz.question.substring(0, 20)}-${internalRenderKey}`}>
                  <QuizBlock 
                    question={quiz.question} 
                    options={quiz.options}
                    correctAnswer={quiz.correctAnswer}
                    funFact={quiz.funFact}
                  />
                </div>
              )}
              
              {/* Explore More section with improved interactive grid - only hide when explicitly set */}
              {isExploreVisible && (
                <div ref={exploreMoreRef} className="mt-8 pt-4 border-t border-wonder-purple/10">
                  <h3 className="text-sm font-medium text-wonder-purple mb-3 flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-wonder-yellow" />
                    Explore More
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                    {safeBlocks.map((block) => {
                      const info = blockInfo[block];
                      if (!info) {
                        console.error(`[ContentBox] Unknown block type: ${block}`);
                        return null;
                      }
                      
                      const BlockIcon = info.icon;
                      return (
                        <button
                          key={`${block}-${internalRenderKey}`}
                          onClick={(e) => handleBlockButtonClick(block, e)}
                          data-block-type={block} // Add data attribute for debugging
                          className={`explore-link group relative p-3 bg-gradient-to-br ${
                            activeBlock === block ? info.color : 'from-white to-white/90'
                          } rounded-lg border ${
                            activeBlock === block ? 'border-transparent' : 'border-wonder-purple/10 hover:border-wonder-purple/30'
                          } ${info.shadow} transition-all duration-300 transform hover:-translate-y-1 
                          flex flex-col items-center text-center opacity-0`}
                          aria-label={`Explore ${info.title}`}
                        >
                          <div className={`w-8 h-8 rounded-full ${
                            activeBlock === block ? 'bg-white/20' : 'bg-wonder-purple/5'
                          } flex items-center justify-center mb-1`}>
                            <BlockIcon className={`h-4 w-4 ${
                              activeBlock === block ? 'text-white' : BlockIcon({}).props.className
                            }`} />
                          </div>
                          <span className={`font-medium text-xs ${
                            activeBlock === block ? 'text-white' : 'text-foreground'
                          }`}>{info.title}</span>
                          <span className={`text-[10px] ${
                            activeBlock === block ? 'text-white/80' : 'text-muted-foreground'
                          } mt-0.5 hidden sm:block`}>{info.description}</span>
                          
                          {/* Magical sparkle effect for active blocks */}
                          {activeBlock === block && (
                            <div className="absolute top-0 right-0 h-6 w-6 pointer-events-none">
                              <Sparkles className="h-5 w-5 text-white/60 animate-sparkle absolute" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Navigation controls with improved visual design */}
      <div ref={navigationRef} className="px-4 pb-4 opacity-0">
        <div className="flex items-center justify-between gap-3">
          {cleanedPrevSection ? (
            <button 
              onClick={() => handleNavigation(prevSection!)}
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
              onClick={() => handleNavigation(nextSection!)}
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
