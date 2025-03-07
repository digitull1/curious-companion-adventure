
import { useState, useEffect } from "react";
import { Message, BlockType } from "@/types/chat";
import { useOpenAI } from "@/hooks/useOpenAI";
import { toast } from "sonner";

export const useChatState = (
  userName: string,
  ageRange: string,
  avatar: string,
  language: string
) => {
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [showAgeSelector, setShowAgeSelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicSectionsGenerated, setTopicSectionsGenerated] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [learningComplete, setLearningComplete] = useState(false);
  const { isLoading, generateResponse, generateImage, generateQuiz } = useOpenAI();
  const [streakCount, setStreakCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [learningProgress, setLearningProgress] = useState(0);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [previousTopics, setPreviousTopics] = useState<string[]>([]);

  // Predefined suggested prompts (fallback if API fails)
  const defaultSuggestedPrompts = [
    "Tell me about dinosaurs",
    "How do planets form?",
    "What are robots?",
    "Why is the sky blue?",
    "How do animals communicate?"
  ];

  return {
    // State
    messages,
    inputValue,
    isProcessing,
    isListening,
    showTypingIndicator,
    showAgeSelector,
    selectedTopic,
    topicSectionsGenerated,
    completedSections,
    currentSection,
    relatedTopics,
    learningComplete,
    streakCount,
    points,
    learningProgress,
    showSuggestedPrompts,
    suggestedTopics,
    previousTopics,
    defaultSuggestedPrompts,

    // State setters
    setMessages,
    setInputValue,
    setIsProcessing,
    setIsListening,
    setShowTypingIndicator,
    setShowAgeSelector,
    setSelectedTopic,
    setTopicSectionsGenerated,
    setCompletedSections,
    setCurrentSection,
    setRelatedTopics,
    setLearningComplete,
    setStreakCount,
    setPoints,
    setLearningProgress,
    setShowSuggestedPrompts,
    setSuggestedTopics,
    setPreviousTopics,

    // OpenAI methods
    generateResponse,
    generateImage,
    generateQuiz,
    isLoading
  };
};
