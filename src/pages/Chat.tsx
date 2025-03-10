
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
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();
  const [ageRange, setAgeRange] = useState(localStorage.getItem("wonderwhiz_age_range") || "8-10");
  const [avatar, setAvatar] = useState(localStorage.getItem("wonderwhiz_avatar") || "explorer");
  const [userName, setUserName] = useState(localStorage.getItem("wonderwhiz_username") || "Explorer");
  const [language, setLanguage] = useState(localStorage.getItem("wonderwhiz_language") || "en");
  const [processingImage, setProcessingImage] = useState(false);
  
  // Use our custom hooks to manage state and logic
  const chatState = useChatState(userName, ageRange, avatar, language);
  const { generateRelatedTopics } = useRelatedTopics(chatState.generateResponse);
  
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
  
  // Save completed topics to localStorage when they change
  useEffect(() => {
    if (chatState.previousTopics.length > 0) {
      localStorage.setItem("wonderwhiz_previous_topics", JSON.stringify(chatState.previousTopics));
      console.log("Saved previous topics to localStorage:", chatState.previousTopics);
    }
  }, [chatState.previousTopics]);
  
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
  
  // Initialize chat - optimized to reduce rerenders
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

  // Memoized event handlers to reduce rerenders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    chatState.setInputValue(e.target.value);
  }, [chatState.setInputValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && chatState.inputValue.trim() && !chatState.isProcessing) {
      handleSendMessage();
    }
  }, [chatState.inputValue, chatState.isProcessing]);

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
    
    // Clear chat and generate new welcome message in selected language
    clearChat();
  }, []);

  // Generate fresh topics for the ideas feature
  const generateFreshTopics = useCallback(async () => {
    try {
      chatState.setIsProcessing(true);
      const prompt = "Generate 6 fascinating educational topics for children aged " + ageRange + 
                     ". Topics should be diverse and cover different subject areas. Return just the list of topics with no numbering or introduction.";
      
      const response = await chatState.generateResponse(prompt, ageRange, language);
      
      // Process the response to extract topics
      const topics = response
        .split(/\n+/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("Here") && !line.includes("topics") && !line.includes("Topics"))
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, ''))
        .slice(0, 6);
      
      console.log("Generated fresh topics:", topics);
      
      if (topics.length > 0) {
        chatState.setSuggestedTopics(topics);
      } else {
        // Fallback if no valid topics were extracted
        chatState.setSuggestedTopics(chatState.defaultSuggestedPrompts);
      }
    } catch (error) {
      console.error("Error generating fresh topics:", error);
      toast.error("Couldn't generate new topics. Try again later!");
      chatState.setSuggestedTopics(chatState.defaultSuggestedPrompts);
    } finally {
      chatState.setIsProcessing(false);
    }
  }, [ageRange, language, chatState]);

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image too large! Please upload an image smaller than 5MB.");
      return;
    }
    
    // Valid image types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF, WEBP).");
      return;
    }
    
    try {
      setProcessingImage(true);
      chatState.setIsProcessing(true);
      
      // Create a unique ID for the image
      const imageId = Date.now().toString();
      const userMessageId = `user-image-${imageId}`;
      
      // Add image message from user
      chatState.setMessages(prev => [
        ...prev, 
        {
          id: userMessageId,
          text: "[Image uploaded]",
          isUser: true,
          imageUrl: URL.createObjectURL(file)
        }
      ]);
      
      // Show typing indicator
      chatState.setShowTypingIndicator(true);
      
      // Convert image to base64
      const base64Image = await readFileAsBase64(file);
      
      // Call the process-image edge function
      const { data, error } = await supabase.functions.invoke('process-image', {
        body: { 
          image: base64Image,
          ageRange,
          language
        }
      });
      
      if (error) {
        throw new Error(`Error processing image: ${error.message}`);
      }
      
      // Hide typing indicator
      chatState.setShowTypingIndicator(false);
      
      // Add AI response message
      const aiMessageId = `ai-image-${imageId}`;
      chatState.setMessages(prev => [
        ...prev,
        {
          id: aiMessageId,
          text: data.content,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true
        }
      ]);
      
      // Award points for image processing
      chatState.setPoints(prev => prev + 15);
      
      toast.success("Image analyzed successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      chatState.setShowTypingIndicator(false);
      toast.error("Failed to process image. Please try again.");
      
      // Add error message
      chatState.setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: "I had trouble understanding that image. Could you try another one or describe what you wanted to know?",
          isUser: false,
          error: {
            message: error instanceof Error ? error.message : "Unknown error processing image"
          }
        }
      ]);
    } finally {
      setProcessingImage(false);
      chatState.setIsProcessing(false);
    }
  }, [ageRange, language, chatState]);

  // Helper function to read file as base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
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
    } else {
      // Handle regular messages
      console.log("Handling regular message (not a new topic)");
      await processMessage(chatState.inputValue);
    }
  };

  const handleBlockClick = useCallback((type: BlockType, messageId: string, messageText: string) => {
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
  }, [
    ageRange, 
    language, 
    chatState.setIsProcessing, 
    chatState.setShowTypingIndicator, 
    chatState.setPoints, 
    chatState.setMessages, 
    chatState.generateResponse, 
    chatState.generateQuiz
  ]);

  const handleSuggestedPromptClick = useCallback((prompt: string) => {
    console.log("Suggested prompt clicked:", prompt);
    
    // Directly process the suggested topic instead of putting it in the input field
    chatState.setIsProcessing(true);
    
    // Add user message
    const userMessageId = `user-${Date.now()}`;
    chatState.setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        text: prompt,
        isUser: true
      }
    ]);
    
    // Process the prompt
    processMessage(prompt, false, true).then(() => {
      // Add points for using a suggested prompt
      chatState.setPoints(prev => prev + 5);
    });
  }, [chatState, processMessage]);

  const handleVoiceInput = useCallback((transcript: string) => {
    chatState.setInputValue(transcript);
  }, [chatState.setInputValue]);
  
  const toggleListening = useCallback(() => {
    chatState.setIsListening(prev => !prev);
  }, [chatState.setIsListening]);
  
  const clearChat = useCallback(() => {
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
            isProcessing={chatState.isProcessing || processingImage}
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
            onImageUpload={handleImageUpload}
            generateFreshTopics={generateFreshTopics}
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
