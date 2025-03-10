
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import { useChatState } from "@/hooks/useChatState";
import { useChatInitialization } from "@/hooks/useChatInitialization";
import { useMessageHandling } from "@/hooks/useMessageHandling";
import useTopicManagement, { generateTopicRelations } from "@/hooks/useTopicManagement";
import { useSectionHandling } from "@/hooks/useSectionHandling";
import useRelatedTopics from "@/hooks/useRelatedTopics";
import { useInputHandling } from "@/hooks/useInputHandling";
import { BlockType } from "@/types/chat";

const Chat = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userName = localStorage.getItem("wonderwhiz_username") || "Explorer";
  const ageRange = localStorage.getItem("wonderwhiz_age_range") || "8-10";
  const avatar = localStorage.getItem("wonderwhiz_avatar") || "explorer";
  const language = localStorage.getItem("wonderwhiz_language") || "en";
  
  // Redirect to onboarding if user data is missing
  useEffect(() => {
    if (!ageRange || !avatar) {
      navigate("/onboarding");
    }
  }, [ageRange, avatar, navigate]);
  
  console.log("[Chat] Component mounted with user data:", { userName, ageRange, avatar, language });
  
  // Initialize chat state from custom hook
  const chatState = useChatState(userName, ageRange, avatar, language);
  
  // Extract state from chatState
  const {
    messages, setMessages,
    inputValue, setInputValue,
    isProcessing, setIsProcessing,
    isListening, setIsListening,
    showTypingIndicator, setShowTypingIndicator,
    selectedTopic, setSelectedTopic,
    topicSectionsGenerated, setTopicSectionsGenerated,
    completedSections, setCompletedSections,
    currentSection, setCurrentSection,
    relatedTopics, setRelatedTopics,
    learningComplete, setLearningComplete,
    streakCount, setStreakCount,
    points, setPoints,
    learningProgress, setLearningProgress,
    showSuggestedPrompts, setShowSuggestedPrompts,
    suggestedTopics, setSuggestedTopics,
    previousTopics, setPreviousTopics,
    defaultSuggestedPrompts,
    generateResponse, generateImage, generateQuiz
  } = chatState;
  
  // Message processing handler
  const { processMessage } = useMessageHandling(
    generateResponse,
    ageRange,
    language,
    setMessages,
    setIsProcessing,
    setShowTypingIndicator,
    setInputValue,
    setPoints
  );
  
  // Topic management
  const { isNewTopicRequest, handleNewTopicRequest } = useTopicManagement(
    selectedTopic,
    topicSectionsGenerated,
    messages,
    completedSections,
    relatedTopics,
    generateResponse,
    ageRange,
    language,
    setLearningComplete,
    setRelatedTopics,
    (topic) => generateTopicRelations(
      topic,
      generateResponse,
      ageRange,
      language,
      setRelatedTopics
    ),
    inputValue,
    isProcessing,
    setMessages,
    setInputValue,
    setIsProcessing,
    setShowTypingIndicator,
    setSelectedTopic,
    setTopicSectionsGenerated,
    setCompletedSections,
    setCurrentSection,
    setPreviousTopics,
    setPoints,
    setLearningProgress
  );
  
  // Section handling
  const { handleSectionClick } = useSectionHandling(
    selectedTopic,
    currentSection,
    completedSections,
    processMessage,
    setCurrentSection,
    setCompletedSections,
    setLearningProgress,
    setLearningComplete,
    messages
  );
  
  // Related topic handling
  const { handleRelatedTopicClick } = useRelatedTopics(
    isProcessing,
    setSelectedTopic,
    setTopicSectionsGenerated,
    setInputValue,
    setPreviousTopics
  );
  
  // Input handling
  const { 
    handleInputChange, 
    handleKeyDown, 
    handleSubmit, 
    handleVoiceInput, 
    handleBlockClick, 
    handleSuggestedPromptClick 
  } = useInputHandling(
    inputValue,
    setInputValue,
    isProcessing,
    setIsListening,
    isListening,
    isNewTopicRequest,
    handleNewTopicRequest,
    processMessage,
    setShowSuggestedPrompts,
    generateQuiz,
    generateImage,
    ageRange,
    language,
    setMessages
  );
  
  // Initialize chat and load suggested topics
  useChatInitialization(
    ageRange,
    avatar,
    userName,
    language,
    generateResponse,
    setShowTypingIndicator,
    setSuggestedTopics,
    setMessages,
    setShowSuggestedPrompts,
    setStreakCount,
    setPoints,
    defaultSuggestedPrompts
  );
  
  console.log("[Chat] Rendering chat interface with state:", { 
    messagesCount: messages.length,
    showTypingIndicator,
    completedSections,
    currentSection,
    topicSectionsGenerated,
    learningProgress
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header 
        avatar={avatar}
        streakCount={streakCount}
        points={points}
        learningProgress={learningProgress}
        topicSectionsGenerated={topicSectionsGenerated}
        language={language}
      />
      <main className="flex-1 overflow-hidden flex flex-col pb-safe">
        <ChatInterface 
          messages={messages}
          inputValue={inputValue}
          isProcessing={isProcessing}
          isListening={isListening}
          showTypingIndicator={showTypingIndicator}
          selectedTopic={selectedTopic}
          topicSectionsGenerated={topicSectionsGenerated}
          completedSections={completedSections}
          currentSection={currentSection}
          relatedTopics={relatedTopics}
          learningComplete={learningComplete}
          avatar={avatar}
          streak={streakCount}
          points={points}
          learningProgress={learningProgress}
          suggestedPrompts={suggestedTopics}
          showSuggestedPrompts={showSuggestedPrompts}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSendMessage={handleSubmit}
          onBlockClick={handleBlockClick}
          onTocSectionClick={handleSectionClick}
          onRelatedTopicClick={handleRelatedTopicClick}
          onVoiceInput={handleVoiceInput}
          toggleListening={() => setIsListening(!isListening)}
          onSuggestedPromptClick={handleSuggestedPromptClick}
          setShowSuggestedPrompts={setShowSuggestedPrompts}
        />
      </main>
    </div>
  );
};

export default Chat;
