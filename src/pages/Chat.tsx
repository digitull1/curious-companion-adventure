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
import { handleBlockClick as handleLearningBlockClick } from "@/services/learningBlockService";

const Chat = () => {
  const navigate = useNavigate();
  const [ageRange, setAgeRange] = useState(localStorage.getItem("wonderwhiz_age_range") || "8-10");
  const [avatar, setAvatar] = useState(localStorage.getItem("wonderwhiz_avatar") || "explorer");
  const [userName, setUserName] = useState(localStorage.getItem("wonderwhiz_username") || "Explorer");
  const [language, setLanguage] = useState(localStorage.getItem("wonderwhiz_language") || "en");
  
  // Use our custom hooks to manage state and logic
  const chatState = useChatState(userName, ageRange, avatar, language);
  const { generateRelatedTopics } = useRelatedTopics(chatState.generateResponse);
  
  // For debugging the TOC issue
  useEffect(() => {
    console.log("[Chat][Debug] Current messages:", chatState.messages.length);
    console.log("[Chat][Debug] Messages with TOC:", 
      chatState.messages.filter(m => m.tableOfContents).length);
    console.log("[Chat][Debug] Selected topic:", chatState.selectedTopic);
    console.log("[Chat][Debug] Topic sections generated:", chatState.topicSectionsGenerated);
  }, [chatState.messages, chatState.selectedTopic, chatState.topicSectionsGenerated]);
  
  // Initialize message handling hook
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
  
  // Initialize topic management hook
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
  
  // Initialize section handling hook
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
  
  // Initialize chat
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
    chatState.defaultSuggestedPrompts
  );

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    chatState.setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && chatState.inputValue.trim() && !chatState.isProcessing) {
      handleSendMessage();
    }
  };

  const handleAgeRangeChange = (newRange: string) => {
    setAgeRange(newRange);
    localStorage.setItem("wonderwhiz_age_range", newRange);
    chatState.setShowAgeSelector(false);
    toast.success(`Learning content will now be tailored for age ${newRange}!`);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("wonderwhiz_language", newLanguage);
    toast.success(`Language changed to ${newLanguage}!`);
    
    // Clear chat and generate new welcome message in selected language
    clearChat();
  };

  const handleSendMessage = async () => {
    if (!chatState.inputValue.trim() || chatState.isProcessing) return;

    console.log("Handling send message with input:", chatState.inputValue);
    console.log("Current state - selectedTopic:", chatState.selectedTopic, 
                "topicSectionsGenerated:", chatState.topicSectionsGenerated, 
                "learningComplete:", chatState.learningComplete);

    // If starting a new topic after completing previous one
    if (chatState.learningComplete && chatState.topicSectionsGenerated) {
      // Save the previous topic before resetting
      if (chatState.selectedTopic) {
        console.log("Saving previous topic before starting new one:", chatState.selectedTopic);
        chatState.setPreviousTopics(prev => [...prev, chatState.selectedTopic!]);
      }
      
      // Reset topic-related states
      console.log("Resetting topic states for new topic");
      chatState.setTopicSectionsGenerated(false);
      chatState.setCompletedSections([]);
      chatState.setCurrentSection(null);
      chatState.setLearningComplete(false);
      chatState.setRelatedTopics([]);
    }

    // Check if this is a new topic request (not a follow-up on sections)
    const isTopicRequest = isNewTopicRequest(
      chatState.inputValue, 
      chatState.selectedTopic, 
      chatState.topicSectionsGenerated
    );
    
    console.log("Handle send message - isNewTopicRequest:", isTopicRequest);
    
    // If it's a new topic, generate table of contents
    if (isTopicRequest) {
      await handleNewTopicRequest();
      
      // Add debug logic: Check if TOC was generated
      setTimeout(() => {
        console.log("[Chat][Debug] After handleNewTopicRequest:");
        console.log("[Chat][Debug] Messages with TOC:", 
          chatState.messages.filter(m => m.tableOfContents).length);
        console.log("[Chat][Debug] topicSectionsGenerated:", chatState.topicSectionsGenerated);
        
        const tocMessage = chatState.messages.find(m => m.tableOfContents);
        if (!tocMessage) {
          console.error("[Chat][Error] No TOC message was added to messages!");
          
          // Force generate TOC if it wasn't created
          if (chatState.selectedTopic && !chatState.topicSectionsGenerated) {
            console.log("[Chat][Debug] Forcing TOC generation for:", chatState.selectedTopic);
            generateTopicRelations().catch(err => 
              console.error("[Chat][Error] Force TOC generation failed:", err)
            );
          }
        }
      }, 500);
    } else {
      // Handle regular messages
      console.log("Handling regular message (not a new topic)");
      await processMessage(chatState.inputValue);
    }
  };

  const handleBlockClick = (type: BlockType, messageId: string, messageText: string) => {
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
      chatState.generateQuiz
    );
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    console.log("Suggested prompt clicked:", prompt);
    chatState.setInputValue(prompt);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleVoiceInput = (transcript: string) => {
    chatState.setInputValue(transcript);
  };
  
  const toggleListening = () => {
    chatState.setIsListening(prev => !prev);
  };
  
  const clearChat = () => {
    console.log("Clearing chat");
    chatState.setMessages([
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
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-wonder-background to-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <img 
          src="/lovable-uploads/22fa1957-ce26-4f1a-ae37-bf442630d36d.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header with Stats integrated */}
      <Header 
        avatar={avatar} 
        streakCount={chatState.streakCount}
        points={chatState.points}
        learningProgress={chatState.learningProgress}
        topicSectionsGenerated={chatState.topicSectionsGenerated}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden backdrop-blur-sm relative z-10">
        <div className="w-full h-full mx-auto flex flex-col">
          {/* Chat Messages */}
          <ChatArea 
            messages={chatState.messages}
            showTypingIndicator={chatState.showTypingIndicator}
            completedSections={chatState.completedSections}
            currentSection={chatState.currentSection}
            relatedTopics={chatState.relatedTopics}
            learningComplete={chatState.learningComplete}
            onBlockClick={handleBlockClick}
            onTocSectionClick={handleTocSectionClick}
            onRelatedTopicClick={handleRelatedTopicClick}
            learningProgress={chatState.learningProgress}
          />
          
          {/* Chat Input */}
          <ChatInput 
            inputValue={chatState.inputValue}
            isProcessing={chatState.isProcessing}
            selectedTopic={chatState.selectedTopic}
            suggestedPrompts={chatState.suggestedTopics.length > 0 ? chatState.suggestedTopics : chatState.defaultSuggestedPrompts}
            isListening={chatState.isListening}
            showSuggestedPrompts={chatState.showSuggestedPrompts}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={handleSendMessage}
            onVoiceInput={handleVoiceInput}
            toggleListening={toggleListening}
            onSuggestedPromptClick={handleSuggestedPromptClick}
            setShowSuggestedPrompts={chatState.setShowSuggestedPrompts}
          />
        </div>
      </main>
      
      {/* Age Selector Modal */}
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
