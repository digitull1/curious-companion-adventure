import React, { useRef, useEffect } from "react";
import { ChevronRight, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import ImageBlock from "@/components/ImageBlock";
import QuizBlock from "@/components/QuizBlock";
import { animate } from "@motionone/dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  blocks?: BlockType[];
  showBlocks?: boolean;
  imagePrompt?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  code?: {
    snippet: string;
    language: string;
  };
  tableOfContents?: string[];
  isIntroduction?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  showTypingIndicator: boolean;
  completedSections: string[];
  currentSection: string | null;
  relatedTopics: string[];
  learningComplete: boolean;
  onBlockClick: (type: BlockType, messageId: string, messageText: string) => void;
  onTocSectionClick: (section: string) => void;
  onRelatedTopicClick: (topic: string) => void;
  learningProgress: number;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  showTypingIndicator,
  completedSections,
  currentSection,
  relatedTopics,
  learningComplete,
  onBlockClick,
  onTocSectionClick,
  onRelatedTopicClick,
  learningProgress
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const learningBlocksRef = useRef<HTMLDivElement>(null);
  const relatedTopicsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  useEffect(() => {
    // Apply animations to learning blocks on first load
    if (learningBlocksRef.current) {
      const blocks = learningBlocksRef.current.querySelectorAll('.learning-block');
      blocks.forEach((block, index) => {
        animate(
          block,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.4, delay: 0.1 * index, easing: "ease-out" }
        );
      });
    }

    // Apply animations to related topics when they appear
    if (relatedTopicsRef.current && learningComplete) {
      const topics = relatedTopicsRef.current.querySelectorAll('.related-topic');
      topics.forEach((topic, index) => {
        animate(
          topic,
          { opacity: [0, 1], scale: [0.9, 1], y: [10, 0] },
          { duration: 0.4, delay: 0.15 * index, easing: "ease-out" }
        );
      });
    }
  }, [learningComplete]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollLearningBlocks = (direction: 'left' | 'right') => {
    if (learningBlocksRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      learningBlocksRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Extract the "Next Topic" suggestion from message text if present
  const extractNextTopicSuggestion = (text: string) => {
    const regex = /Would you like to continue learning about ["'](.+?)["']/;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  // Show breadcrumb navigation if there's a current section
  const renderBreadcrumb = () => {
    if (!currentSection) return null;
    
    return (
      <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-md px-4 py-2 border-b border-wonder-purple/10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm overflow-hidden">
          <BookOpen className="h-4 w-4 text-wonder-purple flex-shrink-0" />
          <span className="text-muted-foreground whitespace-nowrap hidden sm:inline">Currently exploring:</span>
          <div className="px-3 py-1 bg-wonder-purple/10 rounded-full text-wonder-purple font-medium truncate max-w-[70%]">
            {currentSection}
          </div>
        </div>
        
        {/* Mini stats display for mobile */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 rounded-full bg-wonder-purple text-white flex items-center justify-center">
              <ChevronRight className="h-3 w-3" />
            </div>
            <span>{Math.round(learningProgress)}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="flex-1 overflow-y-auto py-6 scrollbar-thin relative" 
      ref={chatHistoryRef}
    >
      {renderBreadcrumb()}
      
      {messages.map((message) => {
        const nextTopic = !message.isUser ? extractNextTopicSuggestion(message.text) : null;
        const messageTextWithoutNextPrompt = nextTopic 
          ? message.text.replace(/\n\nWould you like to continue learning about .+\?$/, '') 
          : message.text;
          
        return (
          <div key={message.id} className="fade-scale-in mb-6">
            <ChatMessage message={messageTextWithoutNextPrompt} isUser={message.isUser}>
              {message.tableOfContents && (
                <TableOfContents 
                  sections={message.tableOfContents} 
                  completedSections={completedSections}
                  currentSection={currentSection}
                  onSectionClick={onTocSectionClick}
                />
              )}
              {message.imagePrompt && (
                <ImageBlock prompt={message.imagePrompt} />
              )}
              {message.quiz && (
                <QuizBlock 
                  question={message.quiz.question} 
                  options={message.quiz.options}
                  correctAnswer={message.quiz.correctAnswer}
                />
              )}
            </ChatMessage>
            
            {/* Next topic navigation button - Improved design */}
            {nextTopic && (
              <div className="mx-auto max-w-3xl px-4 mt-2 mb-4">
                <button 
                  className="w-full p-3 bg-gradient-to-r from-wonder-purple/10 to-wonder-purple/5 hover:from-wonder-purple/15 hover:to-wonder-purple/10 
                    border border-wonder-purple/20 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 
                    shadow-sm hover:shadow-magical text-left"
                  onClick={() => onTocSectionClick(nextTopic)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-wonder-purple/20 flex items-center justify-center mr-2 flex-shrink-0">
                        <ArrowRight className="h-4 w-4 text-wonder-purple" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Continue learning</div>
                        <div className="font-medium text-wonder-purple truncate max-w-[200px] sm:max-w-md">{nextTopic}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-wonder-purple/60 flex-shrink-0" />
                  </div>
                </button>
              </div>
            )}
            
            {/* Redesigned Learning Blocks */}
            {message.showBlocks && message.blocks && (
              <div className="relative mb-6 overflow-hidden px-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-wonder-purple">Explore More</h3>
                  <div className="flex gap-1">
                    <button 
                      className="scroll-button p-1" 
                      onClick={() => scrollLearningBlocks('left')}
                      aria-label="Scroll left"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </button>
                    <button 
                      className="scroll-button p-1" 
                      onClick={() => scrollLearningBlocks('right')}
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div 
                  ref={learningBlocksRef}
                  className="flex overflow-x-auto gap-3 py-1 snap-x snap-mandatory scrollbar-none"
                >
                  {message.blocks.map((block) => (
                    <LearningBlock
                      key={block}
                      type={block}
                      onClick={() => onBlockClick(block, message.id, message.text)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Related topics */}
            {message.isIntroduction && relatedTopics.length > 0 && learningComplete && (
              <div className="mb-6 px-4" ref={relatedTopicsRef}>
                <h3 className="text-sm font-medium mb-2 text-wonder-purple">Explore more topics:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {relatedTopics.map((topic, index) => (
                    <div 
                      key={index}
                      onClick={() => onRelatedTopicClick(topic)}
                      className="related-topic p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/10 
                                hover:border-wonder-purple/30 shadow-sm hover:shadow-magical cursor-pointer transition-all duration-300
                                hover:-translate-y-1 transform touch-manipulation"
                      style={{ opacity: 0 }} // Initially invisible for animation
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-wonder-yellow/20 to-wonder-yellow flex items-center justify-center text-wonder-yellow-dark">
                          <ChevronRight className="h-3 w-3" />
                        </div>
                        <ChevronRight className="h-3 w-3 text-wonder-purple/60" />
                      </div>
                      <h3 className="font-medium text-xs text-foreground font-rounded leading-tight">{topic}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1 font-rounded">Click to explore</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {showTypingIndicator && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
