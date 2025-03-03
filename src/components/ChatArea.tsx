
import React, { useRef, useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
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
  onRelatedTopicClick
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
      const scrollAmount = direction === 'left' ? -300 : 300;
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
      <div className="sticky top-14 z-20 bg-white/90 backdrop-blur-md px-4 py-2 border-b border-wonder-purple/10 mb-4 flex items-center text-sm">
        <span className="text-muted-foreground">Currently exploring:</span>
        <span className="ml-2 px-3 py-1 bg-wonder-purple/10 rounded-full text-wonder-purple font-medium">
          {currentSection}
        </span>
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
            
            {/* Next topic navigation button */}
            {nextTopic && (
              <div 
                className="mx-6 mt-3 mb-6 p-4 bg-wonder-purple/5 hover:bg-wonder-purple/10 border border-wonder-purple/20 
                  rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-magical"
                onClick={() => onTocSectionClick(nextTopic)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-wonder-purple/10 flex items-center justify-center mr-3">
                      <ArrowRight className="h-5 w-5 text-wonder-purple" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Continue learning</div>
                      <div className="font-medium text-wonder-purple">{nextTopic}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-wonder-purple/60" />
                </div>
              </div>
            )}
            
            {message.showBlocks && message.blocks && (
              <div className="relative mb-8 learning-blocks-wrapper">
                <button 
                  className="scroll-button scroll-button-left" 
                  onClick={() => scrollLearningBlocks('left')}
                  aria-label="Scroll left"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                
                <div 
                  ref={learningBlocksRef}
                  className="learning-blocks-container"
                >
                  {message.blocks.map((block) => (
                    <LearningBlock
                      key={block}
                      type={block}
                      onClick={() => onBlockClick(block, message.id, message.text)}
                    />
                  ))}
                </div>
                
                <button 
                  className="scroll-button scroll-button-right" 
                  onClick={() => scrollLearningBlocks('right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {message.isIntroduction && relatedTopics.length > 0 && learningComplete && (
              <div className="mb-8" ref={relatedTopicsRef}>
                <h3 className="text-lg font-medium mb-3 text-wonder-purple">Explore more topics:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {relatedTopics.map((topic, index) => (
                    <div 
                      key={index}
                      onClick={() => onRelatedTopicClick(topic)}
                      className="related-topic p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/10 
                                hover:border-wonder-purple/30 shadow-sm hover:shadow-magical cursor-pointer transition-all duration-300
                                hover:-translate-y-1 transform touch-manipulation"
                      style={{ opacity: 0 }} // Initially invisible for animation
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wonder-yellow/20 to-wonder-yellow flex items-center justify-center text-wonder-yellow-dark">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <ChevronRight className="h-4 w-4 text-wonder-purple/60" />
                      </div>
                      <h3 className="font-medium text-sm text-foreground font-rounded leading-tight">{topic}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-rounded">Click to explore</p>
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
