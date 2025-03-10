
import React, { useState, useEffect, useRef } from "react";
import { ArrowUpCircle } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import LearningBlock, { BlockType } from "@/components/LearningBlock";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import TypingIndicator from "@/components/TypingIndicator";
import TableOfContents from "@/components/TableOfContents";
import ImageBlock from "@/components/ImageBlock";
import QuizBlock from "@/components/QuizBlock";

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
  setShowSuggestedPrompts
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white overflow-hidden">
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
        <div ref={messagesEndRef} />
      </main>
    </div>
  );
};

export default ChatInterface;
