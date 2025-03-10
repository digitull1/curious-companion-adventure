
import { useState } from "react";
import { toast } from "sonner";
import { BlockType, MessageProcessingResult } from "@/types/chat";
import { handleBlockClick as handleLearningBlockClick } from "@/services/learningBlockService";

export const useInputHandling = (
  inputValue: string,
  setInputValue: (value: string) => void,
  isProcessing: boolean,
  setIsListening: (value: boolean) => void,
  isListening: boolean,
  isNewTopicRequest: (input: string, currentTopic: string | null, sectionsGenerated: boolean) => boolean,
  handleNewTopicRequest: () => Promise<void>,
  processMessage: (prompt: string, isUserMessage?: boolean, skipUserMessage?: boolean) => Promise<MessageProcessingResult>,
  setShowSuggestedPrompts: (show: boolean) => void,
  generateQuiz: any,
  generateImage: any,
  ageRange: string,
  language: string,
  setMessages: any
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() && !isProcessing) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isProcessing) return;

    console.log("Handling send message with input:", inputValue);

    // Check if this is a new topic request
    const isTopicRequest = isNewTopicRequest(
      inputValue, 
      null, // Replace with selectedTopic from props
      false // Replace with topicSectionsGenerated from props
    );
    
    console.log("Handle send message - isNewTopicRequest:", isTopicRequest);
    
    // If it's a new topic, generate table of contents
    if (isTopicRequest) {
      await handleNewTopicRequest();
    } else {
      // Handle regular messages
      console.log("Handling regular message (not a new topic)");
      await processMessage(inputValue);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
  };
  
  const toggleListening = () => {
    // Fix: Pass a boolean directly instead of a function
    setIsListening(!isListening);
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    console.log("Suggested prompt clicked:", prompt);
    setInputValue(prompt);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  const handleBlockClick = (type: BlockType, messageId: string, messageText: string) => {
    handleLearningBlockClick(
      type,
      messageId,
      messageText,
      ageRange,
      language,
      (value: boolean) => {}, // setIsProcessing placeholder
      (value: boolean) => {}, // setShowTypingIndicator placeholder
      (points: any) => {}, // setPoints placeholder
      setMessages,
      generateQuiz,
      generateImage
    );
  };

  return {
    isListening,
    setIsListening,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    handleVoiceInput,
    toggleListening,
    handleSuggestedPromptClick,
    handleBlockClick
  };
};
