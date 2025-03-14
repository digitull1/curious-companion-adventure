
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import AgeRangeSelector from "@/components/AgeRangeSelector";
import { BlockType } from "@/types/chat";
import { useChatState } from "@/hooks/useChatState";
import { useChatInitialization } from "@/hooks/useChatInitialization";
import { useRelatedTopics } from "@/hooks/useRelatedTopics";
import { useMessageHandling } from "@/hooks/useMessageHandling";
import { useTopicManagement } from "@/hooks/useTopicManagement";
import { useSectionHandling } from "@/hooks/useSectionHandling";
import { useInputHandling } from "@/hooks/useInputHandling";
import { handleBlockClick as handleLearningBlockClick } from "@/services/learningBlockService";
import { useOpenAI } from "@/hooks/useOpenAI";

const Chat = () => {
  const navigate = useNavigate();
  const [ageRange, setAgeRange] = useState(localStorage.getItem("wonderwhiz_age_range") || "8-10");
  const [avatar, setAvatar] = useState(localStorage.getItem("wonderwhiz_avatar") || "explorer");
  const [userName, setUserName] = useState(localStorage.getItem("wonderwhiz_username") || "Explorer");
  const [language, setLanguage] = useState(localStorage.getItem("wonderwhiz_language") || "en");
  
  const { generateQuiz } = useOpenAI();
  
  const chatState = useChatState(userName, ageRange, avatar, language);
  const { generateRelatedTopics } = useRelatedTopics(chatState.generateResponse);
  
  const [isInitialView, setIsInitialView] = useState(true);
  const [hasUserStarted, setHasUserStarted] = useState(false);
  
  const { processMessage } = useMessageHandling(
    chatState.generateResponse,
    ageRange,
    language,
    chatState.setMessages,
    chatState.setIsProcessing,
    chatState.setShowTypingIndicator,
    chatState.setInputValue,
    chatState.setPoints
  );
  
  const { handleNewTopicRequest, isNewTopicRequest, generateTopicRelations } = useTopicManagement(
    chatState.selectedTopic,
    chatState.topicSectionsGenerated,
    chatState.messages,
    chatState.completedSections,
    chatState.relatedTopics,
    chatState.generateResponse,
    ageRange,
    language,
    chatState.setLearningComplete,
    chatState.setRelatedTopics,
    generateRelatedTopics,
    chatState.inputValue,
    chatState.isProcessing,
    chatState.setMessages,
    chatState.setInputValue,
    chatState.setIsProcessing,
    chatState.setShowTypingIndicator,
    chatState.setSelectedTopic,
    chatState.setTopicSectionsGenerated,
    chatState.setCompletedSections,
    chatState.setCurrentSection,
    chatState.setPreviousTopics,
    chatState.setPoints,
    chatState.setLearningProgress
  );
  
  const { handleTocSectionClick, handleRelatedTopicClick } = useSectionHandling(
    chatState.messages,
    chatState.selectedTopic,
    chatState.completedSections,
    processMessage,
    chatState.setCurrentSection,
    chatState.setCompletedSections,
    chatState.setPoints,
    chatState.setLearningProgress
  );
  
  const {
    isListening,
    setIsListening,
    handleInputChange,
    handleKeyDown,
    handleSendMessage,
    handleVoiceInput,
    toggleListening,
    handleSuggestedPromptClick,
    handleBlockClick
  } = useInputHandling(
    chatState.inputValue,
    chatState.setInputValue,
    chatState.isProcessing,
    processMessage,
    chatState.selectedTopic,
    chatState.topicSectionsGenerated,
    chatState.learningComplete,
    chatState.setPreviousTopics,
    chatState.setTopicSectionsGenerated,
    chatState.setCompletedSections,
    chatState.setCurrentSection,
    chatState.setLearningComplete,
    chatState.setRelatedTopics,
    isNewTopicRequest,
    handleNewTopicRequest
  );

  useChatInitialization(
    ageRange,
    avatar,
    userName,
    language,
    chatState.generateResponse,
    chatState.setShowTypingIndicator,
    chatState.setSuggestedTopics,
    chatState.setMessages,
    chatState.setShowSuggestedPrompts,
    chatState.setStreakCount,
    chatState.setPoints,
    chatState.defaultSuggestedPrompts,
    hasUserStarted
  );

  const handleAgeRangeChange = useCallback((newRange: string) => {
    setAgeRange(newRange);
    localStorage.setItem("wonderwhiz_age_range", newRange);
    chatState.setShowAgeSelector(false);
    toast.success(`Learning content will now be tailored for age ${newRange}!`);
  }, [chatState.setShowAgeSelector]);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("wonderwhiz_language", newLanguage);
    toast.success(`Language changed to ${newLanguage}!`);
    
    clearChat();
  }, []);

  const clearChat = useCallback(() => {
    console.log("Clearing chat");
    chatState.setMessages(() => [
      {
        id: "welcome-new",
        text: "Chat cleared! What would you like to explore now?",
        isUser: false,
        blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
        showBlocks: true,
        isIntroduction: true
      }
    ]);
    chatState.setSelectedTopic(null);
    chatState.setTopicSectionsGenerated(false);
    chatState.setCompletedSections([]);
    chatState.setCurrentSection(null);
    chatState.setLearningProgress(0);
    chatState.setLearningComplete(false);
    chatState.setRelatedTopics([]);
    chatState.setPreviousTopics([]);
    toast.success("Chat cleared! Ready for a new adventure!");
  }, [
    chatState.setMessages,
    chatState.setSelectedTopic,
    chatState.setTopicSectionsGenerated,
    chatState.setCompletedSections,
    chatState.setCurrentSection,
    chatState.setLearningProgress,
    chatState.setLearningComplete,
    chatState.setRelatedTopics,
    chatState.setPreviousTopics
  ]);

  const handleBlockClickWrapper = (type: BlockType, messageId: string, messageText: string) => {
    handleLearningBlockClick(
      type,
      messageId,
      messageText,
      ageRange,
      language,
      chatState.setIsProcessing,
      chatState.setShowTypingIndicator,
      chatState.setPoints,
      chatState.setMessages,
      chatState.generateResponse,
      generateQuiz
    );
  };

  const handleStartLearning = useCallback(() => {
    setIsInitialView(false);
    setHasUserStarted(true);
    
    toast.success("Great! Choose a section to begin your learning journey!");
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <img 
          src="/lovable-uploads/22fa1957-ce26-4f1a-ae37-bf442630d36d.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <Header 
        avatar={avatar} 
        streakCount={chatState.streakCount}
        points={chatState.points}
        learningProgress={chatState.learningProgress}
        topicSectionsGenerated={chatState.topicSectionsGenerated}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="flex-1 overflow-hidden backdrop-blur-sm relative z-10">
        <div className="w-full h-full mx-auto flex flex-col">
          <ChatArea 
            messages={chatState.messages}
            showTypingIndicator={chatState.showTypingIndicator}
            completedSections={chatState.completedSections}
            currentSection={chatState.currentSection}
            relatedTopics={chatState.relatedTopics}
            learningComplete={chatState.learningComplete}
            onBlockClick={handleBlockClickWrapper}
            onTocSectionClick={handleTocSectionClick}
            onRelatedTopicClick={handleRelatedTopicClick}
            learningProgress={chatState.learningProgress}
            isInitialView={isInitialView}
            onStartLearning={handleStartLearning}
          />
          
          <ChatInput 
            inputValue={chatState.inputValue}
            isProcessing={chatState.isProcessing}
            selectedTopic={chatState.selectedTopic}
            suggestedPrompts={chatState.suggestedTopics.length > 0 ? chatState.suggestedTopics : chatState.defaultSuggestedPrompts}
            isListening={isListening}
            showSuggestedPrompts={chatState.showSuggestedPrompts}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
            toggleListening={toggleListening}
            onSuggestedPromptClick={handleSuggestedPromptClick}
            setShowSuggestedPrompts={chatState.setShowSuggestedPrompts}
            disabled={isInitialView}
          />
        </div>
      </main>
      
      {chatState.showAgeSelector && (
        <AgeRangeSelector 
          currentRange={ageRange} 
          onSelect={handleAgeRangeChange}
          onClose={() => chatState.setShowAgeSelector(false)}
        />
      )}
    </div>
  );
};

export default Chat;
