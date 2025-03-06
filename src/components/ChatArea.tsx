
import React, { useRef, useEffect, useState } from "react";
import { ChevronRight, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import ContentBox from "@/components/ContentBox";
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
    funFact?: string;
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
  const relatedTopicsRef = useRef<HTMLDivElement>(null);
  const [currentSectionMessage, setCurrentSectionMessage] = useState<Message | null>(null);
  const [currentBlockMessage, setCurrentBlockMessage] = useState<Message | null>(null);
  const [activeBlock, setActiveBlock] = useState<BlockType | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  // When a new message with image or quiz is added, update the current block message
  useEffect(() => {
    const blockMessage = messages.find(m => (m.imagePrompt || m.quiz) && !m.isUser);
    if (blockMessage) {
      setCurrentBlockMessage(blockMessage);
    }
  }, [messages]);

  useEffect(() => {
    // Find the most recent non-user message about the current section that isn't a block-related message
    if (currentSection) {
      const sectionMessage = [...messages]
        .reverse()
        .find(m => !m.isUser && !m.tableOfContents && !m.imagePrompt && !m.quiz);
      
      if (sectionMessage) {
        setCurrentSectionMessage(sectionMessage);
      }
    } else {
      setCurrentSectionMessage(null);
      setCurrentBlockMessage(null);
      setActiveBlock(null);
    }
  }, [currentSection, messages]);

  useEffect(() => {
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
  }, [learningComplete, relatedTopics]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to get previous and next section based on current section
  const getAdjacentSections = () => {
    if (!currentSection) return { prev: null, next: null };
    
    const toc = messages.find(m => m.tableOfContents)?.tableOfContents || [];
    if (toc.length === 0) return { prev: null, next: null };
    
    const currentIndex = toc.findIndex(section => section === currentSection);
    if (currentIndex === -1) return { prev: null, next: null };
    
    const prev = currentIndex > 0 ? toc[currentIndex - 1] : null;
    const next = currentIndex < toc.length - 1 ? toc[currentIndex + 1] : null;
    
    return { prev, next };
  };

  // Topic pill instead of a sticky header
  const renderTopicPill = () => {
    if (!currentSection) return null;
    
    // Remove asterisks from current section
    const cleanedSection = currentSection.replace(/\*\*/g, "");
    
    return (
      <div className="mx-auto max-w-3xl px-4 my-3">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-2 rounded-full border border-wonder-purple/10 shadow-sm">
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-wonder-purple/10 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-wonder-purple" />
            </div>
            <span className="text-xs text-wonder-purple/70">Learning about:</span>
            <span className="text-sm font-medium text-wonder-purple truncate max-w-[150px] sm:max-w-[300px]">
              {cleanedSection}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Handle specific block click within ContentBox
  const handleContentBoxBlockClick = (block: BlockType) => {
    if (currentSectionMessage) {
      setActiveBlock(block);
      onBlockClick(block, currentSectionMessage.id, currentSectionMessage.text);
    }
  };

  // Find the welcome message
  const welcomeMessage = messages.find(m => !m.isUser && m.text.includes("Hi") && !m.tableOfContents);
  
  // Find the introduction message that contains the table of contents
  const introMessage = messages.find(m => m.isIntroduction && m.tableOfContents);
  
  // Check if we have related topics to display and if learning is complete
  const shouldShowRelatedTopics = relatedTopics.length > 0 && learningComplete;

  // Get adjacent sections for navigation
  const { prev, next } = getAdjacentSections();

  return (
    <div 
      className="flex-1 overflow-y-auto py-6 scrollbar-thin relative" 
      ref={chatHistoryRef}
    >
      {currentSection && renderTopicPill()}
      
      {/* Display welcome message first */}
      {welcomeMessage && (
        <div className="fade-scale-in mb-6 px-4">
          <ChatMessage message={welcomeMessage.text} isUser={welcomeMessage.isUser} />
        </div>
      )}
      
      {/* Display the intro message with Table of Contents */}
      {introMessage && (
        <div className="fade-scale-in mb-6 px-4">
          <ChatMessage message={introMessage.text} isUser={introMessage.isUser}>
            <TableOfContents 
              sections={introMessage.tableOfContents || []} 
              completedSections={completedSections}
              currentSection={currentSection}
              onSectionClick={onTocSectionClick}
            />
          </ChatMessage>
        </div>
      )}
      
      {/* Display user messages */}
      {messages.filter(m => m.isUser).map((message) => (
        <div key={message.id} className="fade-scale-in px-4">
          <ChatMessage message={message.text} isUser={true} />
        </div>
      ))}
      
      {/* Display content box for current section if selected */}
      {currentSection && currentSectionMessage && (
        <div className="px-4 max-w-4xl mx-auto">
          <ContentBox
            title={currentSection}
            content={currentSectionMessage.text}
            prevSection={prev}
            nextSection={next}
            blocks={currentSectionMessage.blocks || ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"]}
            onBlockClick={handleContentBoxBlockClick}
            onNavigate={onTocSectionClick}
            activeBlock={activeBlock}
            imagePrompt={currentBlockMessage?.imagePrompt}
            quiz={currentBlockMessage?.quiz}
          />
        </div>
      )}
      
      {/* Show related topics at the bottom if learning is complete */}
      {shouldShowRelatedTopics && (
        <div className="mx-auto max-w-3xl px-4 mb-6" ref={relatedTopicsRef}>
          <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-wonder-purple/20 shadow-magical">
            <h3 className="text-sm font-medium mb-3 text-wonder-purple">🎉 Explore more topics:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
        </div>
      )}
      
      {/* Show a message if all sections are completed but no related topics are displayed */}
      {learningComplete && !shouldShowRelatedTopics && (
        <div className="px-4 mt-8 mb-6 max-w-3xl mx-auto">
          <div className="p-4 bg-white/90 rounded-xl border border-wonder-purple/10 shadow-sm">
            <div className="text-center">
              <h3 className="text-wonder-purple font-medium mb-2">🎉 Congratulations!</h3>
              <p className="text-muted-foreground text-sm">You've completed all sections of this topic.</p>
            </div>
          </div>
        </div>
      )}
      
      {showTypingIndicator && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
