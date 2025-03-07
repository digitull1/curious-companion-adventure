
import { useState } from "react";
import { toast } from "sonner";
import { BlockType } from "@/types/chat";
import { handleBlockClick as handleLearningBlockClick } from "@/services/learningBlockService";

export const useInputHandling = (
  inputValue: string,
  setInputValue: (value: string) => void,
  isProcessing: boolean,
  processMessage: (prompt: string) => Promise<any>,
  selectedTopic: string | null,
  topicSectionsGenerated: boolean,
  learningComplete: boolean,
  setPreviousTopics: (prev: (prevTopics: string[]) => string[]) => void,
  setTopicSectionsGenerated: (value: boolean) => void,
  setCompletedSections: (value: string[]) => void, 
  setCurrentSection: (value: string | null) => void,
  setLearningComplete: (value: boolean) => void,
  setRelatedTopics: (value: string[]) => void,
  isNewTopicRequest: (input: string, currentTopic: string | null, sectionsGenerated: boolean) => boolean,
  handleNewTopicRequest: () => Promise<void>
) => {
  const [isListening, setIsListening] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() && !isProcessing) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    console.log("Handling send message with input:", inputValue);
    console.log("Current state - selectedTopic:", selectedTopic, 
                "topicSectionsGenerated:", topicSectionsGenerated, 
                "learningComplete:", learningComplete);

    // If starting a new topic after completing previous one
    if (learningComplete && topicSectionsGenerated) {
      // Save the previous topic before resetting
      if (selectedTopic) {
        console.log("Saving previous topic before starting new one:", selectedTopic);
        setPreviousTopics(prev => [...prev, selectedTopic]);
      }
      
      // Reset topic-related states
      console.log("Resetting topic states for new topic");
      setTopicSectionsGenerated(false);
      setCompletedSections([]);
      setCurrentSection(null);
      setLearningComplete(false);
      setRelatedTopics([]);
    }

    // Check if this is a new topic request (not a follow-up on sections)
    const isTopicRequest = isNewTopicRequest(
      inputValue, 
      selectedTopic, 
      topicSectionsGenerated
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
    setIsListening(prev => !prev);
  };

  const handleSuggestedPromptClick = (prompt: string) => {
    console.log("Suggested prompt clicked:", prompt);
    setInputValue(prompt);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleBlockClick = (type: BlockType, messageId: string, messageText: string, 
    ageRange: string, language: string, setIsProcessing: (value: boolean) => void,
    setShowTypingIndicator: (value: boolean) => void, setPoints: any, 
    setMessages: any, generateResponse: any, generateQuiz: any) => {
    
    handleLearningBlockClick(
      type,
      messageId,
      messageText,
      ageRange,
      language,
      setIsProcessing,
      setShowTypingIndicator,
      setPoints,
      setMessages,
      generateResponse,
      generateQuiz
    );
  };

  return {
    isListening,
    setIsListening,
    handleInputChange,
    handleKeyDown,
    handleSendMessage,
    handleVoiceInput,
    toggleListening,
    handleSuggestedPromptClick,
    handleBlockClick
  };
};
