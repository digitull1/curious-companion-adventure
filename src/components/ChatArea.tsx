import React, { useRef, useEffect, useState } from "react";
import { ChevronRight, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import RelatedTopicsCard from "@/components/RelatedTopicsCard";
import TableOfContents from "@/components/TableOfContents";
import { BlockType } from "@/types/chat";

interface ChatAreaProps {
  messages: any[];
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

interface TableOfContentsProps {
  sections: string[];
  completedSections: string[];
  currentSection: string | null;
  onSectionClick: (section: string) => void;
  progress: number;
}

interface RelatedTopicsCardProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
}

const ChatArea = ({
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
  const chatContainerRef = useRef(null);
  const [showRelatedTopics, setShowRelatedTopics] = useState(false);
  let tocMessage = null;

  useEffect(() => {
    // Scroll to bottom on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Show related topics when learning is complete
    if (learningComplete) {
      setShowRelatedTopics(true);
    } else {
      setShowRelatedTopics(false);
    }
  }, [learningComplete]);

  // Function to check if a message has a table of contents
  const getMessageWithToc = () => {
    for (const message of messages) {
      if (message.tableOfContents && message.isIntroduction) {
        return message;
      }
    }
    return null;
  };

  // Function to check if a message has suggested prompts
  const hasSuggestedPrompts = (message) => {
    return message.suggestedPrompts && message.suggestedPrompts.length > 0;
  };

  return (
    <div className="chat-area flex-1 overflow-y-auto pb-4 px-4 sm:px-6" ref={chatContainerRef}>
      {/* Welcome message and suggestions */}
      {messages.length === 0 && (
        <div className="text-center mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Welcome to WonderWhiz!</h2>
          <p className="text-gray-500">Start exploring by asking a question or choosing a topic below:</p>
          {/* Add suggested topics or prompts here */}
        </div>
      )}
      
      {/* Chat messages */}
      <div className="space-y-4 pt-4">
        {/* Introductory elements */}
        {messages.length === 1 && messages[0].isIntroduction && (
          <div className="text-center">
            <BookOpen className="mx-auto h-6 w-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Let's start our learning journey!</p>
          </div>
        )}
        
        {messages.map((message, index) => {
          // Skip messages with errors
          if (message.error) {
            return null;
          }
          
          // Skip system messages
          if (message.isSystem) {
            return null;
          }
          
          // Skip TOC message for now, we'll render it separately
          if (message.tableOfContents && message.isIntroduction) {
            tocMessage = message;
            return null;
          }
          
          return (
            <div 
              key={message.id} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start`}
            >
              <ChatMessage
                message={message}
                showBlocks={message.showBlocks || false}
                onBlockClick={(type) => onBlockClick(type, message.id, message.text)}
              />
            </div>
          );
        })}
        
        {/* Display TOC message if it exists */}
        {tocMessage && (
          <div key={tocMessage.id} className="flex justify-start items-start">
            <ChatMessage message={tocMessage}>
              <TableOfContents 
                sections={tocMessage.tableOfContents || []}
                completedSections={completedSections}
                currentSection={currentSection}
                onSectionClick={onTocSectionClick}
                progress={learningProgress}
              />
            </ChatMessage>
          </div>
        )}
        
        {/* Related topics */}
        {showRelatedTopics && (
          <div className="flex justify-center mt-4">
            <RelatedTopicsCard
              topics={relatedTopics}
              onTopicClick={onRelatedTopicClick}
            />
          </div>
        )}
        
        {/* Typing indicator */}
        {showTypingIndicator && (
          <div className="flex justify-start items-start">
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
