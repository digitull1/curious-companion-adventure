
import React, { useRef } from "react";
import { BlockType } from "@/types/chat";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";

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
    answered?: boolean;
    selectedAnswer?: number;
  };
  code?: {
    snippet: string;
    language: string;
  };
  tableOfContents?: string[];
  isIntroduction?: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  isProcessing: boolean;
  showTypingIndicator: boolean;
  selectedTopic: string | null;
  topicSectionsGenerated: boolean;
  completedSections: string[];
  currentSection: string | null;
  relatedTopics: string[];
  learningComplete: boolean;
  avatar: string;
  streak: number;
  points: number;
  learningProgress: number;
  suggestedPrompts: string[];
  isListening: boolean;
  showSuggestedPrompts: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onBlockClick: (type: BlockType, messageId: string, messageText: string) => void;
  onTocSectionClick: (section: string) => void;
  onRelatedTopicClick: (topic: string) => void;
  onVoiceInput: (transcript: string) => void;
  toggleListening: () => void;
  onSuggestedPromptClick: (prompt: string) => void;
  setShowSuggestedPrompts: (show: boolean) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages,
  inputValue,
  isProcessing,
  showTypingIndicator,
  selectedTopic,
  topicSectionsGenerated,
  completedSections,
  currentSection,
  relatedTopics,
  learningComplete,
  avatar,
  streak,
  points,
  learningProgress,
  suggestedPrompts,
  isListening,
  showSuggestedPrompts,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onBlockClick,
  onTocSectionClick,
  onRelatedTopicClick,
  onVoiceInput,
  toggleListening,
  onSuggestedPromptClick,
  setShowSuggestedPrompts,
  language = "en",
  onLanguageChange = () => {}
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white overflow-hidden">
      {/* Pass all required props to Header component */}
      <Header 
        avatar={avatar} 
        streakCount={streak}
        points={points}
        learningProgress={learningProgress}
        topicSectionsGenerated={topicSectionsGenerated}
        language={language}
        onLanguageChange={onLanguageChange}
      />
      <main className="flex-1 overflow-hidden relative">
        <ChatArea 
          messages={messages}
          showTypingIndicator={showTypingIndicator}
          completedSections={completedSections}
          currentSection={currentSection}
          relatedTopics={relatedTopics}
          learningComplete={learningComplete}
          onBlockClick={onBlockClick}
          onTocSectionClick={onTocSectionClick}
          onRelatedTopicClick={onRelatedTopicClick}
          learningProgress={learningProgress}
        />
        
        <ChatInput 
          inputValue={inputValue}
          isProcessing={isProcessing}
          selectedTopic={selectedTopic}
          suggestedPrompts={suggestedPrompts}
          isListening={isListening}
          showSuggestedPrompts={showSuggestedPrompts}
          onInputChange={onInputChange}
          onKeyDown={onKeyDown}
          onSendMessage={onSendMessage}
          onVoiceInput={onVoiceInput}
          toggleListening={toggleListening}
          onSuggestedPromptClick={onSuggestedPromptClick}
          setShowSuggestedPrompts={setShowSuggestedPrompts}
        />
      </main>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
