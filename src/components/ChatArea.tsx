
import React, { useRef, useEffect, memo } from "react";
import { Message } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import ContentBox from "@/components/ContentBox";
import TableOfContents from "@/components/TableOfContents";
import RelatedTopicsCard from "@/components/RelatedTopicsCard";
import { BlockType } from "@/components/LearningBlock";

interface ChatAreaProps {
  messages: Message[];
  showTypingIndicator: boolean;
  completedSections: string[];
  currentSection: string | null;
  relatedTopics: string[];
  learningComplete: boolean;
  onBlockClick: (block: BlockType, messageId: string, messageText: string) => void;
  onTocSectionClick: (section: string) => void;
  onRelatedTopicClick: (topic: string) => void;
  learningProgress: number;
}

const ChatArea: React.FC<ChatAreaProps> = memo(({
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
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change or typing indicator appears
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showTypingIndicator]);
  
  // Check if we have a TOC message
  const tocMessage = messages.find(m => m.tableOfContents);
  
  // Get previous and next section based on current
  const getSiblingSection = (currentSection: string | null, direction: 'prev' | 'next') => {
    if (!tocMessage || !currentSection) return null;
    
    const sections = tocMessage.tableOfContents || [];
    if (sections.length === 0) return null;
    
    const currentIndex = sections.findIndex(s => s === currentSection);
    if (currentIndex === -1) return null;
    
    if (direction === 'prev') {
      return currentIndex > 0 ? sections[currentIndex - 1] : null;
    } else {
      return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
    }
  };
  
  // Get content for current section
  const getCurrentSectionContent = () => {
    if (!currentSection) return null;
    
    // Find the last message for the current section
    const sectionMessages = messages.filter(m => 
      !m.isUser && 
      !m.tableOfContents && 
      !m.blockType
    );
    
    // Default to the last one
    return sectionMessages[sectionMessages.length - 1];
  };
  
  const currentSectionMessage = getCurrentSectionContent();
  const prevSection = getSiblingSection(currentSection, 'prev');
  const nextSection = getSiblingSection(currentSection, 'next');
  
  // Function to handle block clicks for a specific message
  const handleBlockClick = (block: BlockType, messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      onBlockClick(block, messageId, message.text);
    }
  };

  return (
    <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-4 space-y-6 md:px-6">
      {/* Main content */}
      <div className="max-w-3xl w-full mx-auto relative z-10 pb-4">
        {/* Regular chat messages */}
        {messages.map((message) => {
          // Skip TOC message, we'll display it separately
          if (message.tableOfContents) return null;
          
          // Skip the current section's content message as we show it in ContentBox
          if (currentSectionMessage && message.id === currentSectionMessage.id) return null;
          
          return (
            <ChatMessage 
              key={message.id}
              message={message}
              onBlockClick={(block) => handleBlockClick(block, message.id)}
            />
          );
        })}
        
        {/* Table of Contents */}
        {tocMessage && (
          <TableOfContents 
            sections={tocMessage.tableOfContents || []} 
            completedSections={completedSections}
            currentSection={currentSection}
            onSectionClick={onTocSectionClick}
            onBlockClick={(blockType) => {
              // Find an appropriate message to connect with this block
              const targetMessage = currentSectionMessage || messages[messages.length - 1];
              if (targetMessage) {
                onBlockClick(blockType, targetMessage.id, targetMessage.text);
              }
            }}
          />
        )}
        
        {/* Current Section Content Box */}
        {currentSectionMessage && currentSection && (
          <ContentBox 
            title={currentSection}
            content={currentSectionMessage.text}
            prevSection={prevSection}
            nextSection={nextSection}
            blocks={currentSectionMessage.blocks || []}
            onBlockClick={(block) => handleBlockClick(block, currentSectionMessage.id)}
            onNavigate={onTocSectionClick}
            activeBlock={currentSectionMessage.blockType}
            imagePrompt={currentSectionMessage.imagePrompt}
            quiz={currentSectionMessage.quiz}
          />
        )}
        
        {/* Related Topics */}
        {learningComplete && relatedTopics.length > 0 && (
          <RelatedTopicsCard 
            topics={relatedTopics} 
            onTopicClick={onRelatedTopicClick}
          />
        )}
        
        {/* Typing Indicator */}
        {showTypingIndicator && (
          <div className="flex items-start space-x-4 mt-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-wonder-purple to-wonder-blue">
              <div className="h-full w-full bg-[url('/lovable-uploads/22fa1957-ce26-4f1a-ae37-bf442630d36d.png')] bg-cover opacity-20"></div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] rounded-tl-none">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        {/* Spacer for scrolling to bottom */}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
});

ChatArea.displayName = 'ChatArea';

export default ChatArea;
