
import { useEffect } from "react";
import { toast } from "sonner";
import { processTopicsFromResponse } from "@/utils/topicUtils";
import { Message } from "@/types/chat";

export const useChatInitialization = (
  ageRange: string,
  avatar: string,
  userName: string,
  language: string,
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>,
  setShowTypingIndicator: (show: boolean) => void,
  setSuggestedTopics: (topics: string[]) => void,
  setMessages: (messageSetter: (prev: Message[]) => Message[]) => void,
  setShowSuggestedPrompts: (show: boolean) => void,
  setStreakCount: (count: number) => void,
  setPoints: (points: number) => void,
  defaultSuggestedPrompts: string[]
) => {
  useEffect(() => {
    console.log("Chat component mounted, initializing...");
    console.log("User data:", { userName, ageRange, avatar, language });
    
    // Initialize streak and points
    const savedStreak = Math.floor(Math.random() * 5) + 1; // Random 1-5 for demo
    const savedPoints = Math.floor(Math.random() * 500); // Random points for demo
    setStreakCount(savedStreak);
    setPoints(savedPoints);
    
    // Set initial loading state
    setShowTypingIndicator(true);
    
    // Generate personalized topics based on age range
    const generatePersonalizedTopics = async () => {
      try {
        console.log("Generating personalized topics for age range:", ageRange);
        
        // Generate age-appropriate topics
        const topicsPrompt = `Generate 5 engaging, educational topics that would interest a ${ageRange} year old child. Format as a short comma-separated list. Topics should be interesting and appropriate for their age group.`;
        const topicsResponse = await generateResponse(topicsPrompt, ageRange, language);
        console.log("Generated topics response:", topicsResponse);
        
        // Process topics from the response string
        const topics = processTopicsFromResponse(topicsResponse);
        console.log("Processed topics:", topics);
        
        // Make sure we have exactly 5 topics
        const finalTopics = topics.length >= 5 ? topics.slice(0, 5) : [...topics, ...defaultSuggestedPrompts.slice(0, 5 - topics.length)];
        console.log("Final topics list:", finalTopics);
        
        setSuggestedTopics(finalTopics);
        
        // Create personalized welcome message with name
        let welcomeText = "";
        
        if (language === "en") {
          welcomeText = `Hi ${userName}! I'm your WonderWhiz assistant, created by leading IB educationalists and Cambridge University child psychologists. I'm here to help you learn fascinating topics in depth. What would you like to explore today?`;
        } else {
          // This will be translated by the API for other languages
          welcomeText = `Hi ${userName}! I'm your WonderWhiz assistant. I'm here to help you learn fascinating topics in depth. What would you like to explore today?`;
        }
        
        const welcomeMessage: Message = {
          id: "welcome",
          text: welcomeText,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true,
          isIntroduction: true
        };
        
        console.log("Setting welcome message:", welcomeMessage);
        setMessages(() => [welcomeMessage]);
        setShowTypingIndicator(false);
        
        // Auto-show suggested prompts after welcome
        setTimeout(() => {
          setShowSuggestedPrompts(true);
        }, 1000);
        
      } catch (error) {
        console.error("Error generating personalized topics:", error);
        setSuggestedTopics(defaultSuggestedPrompts);
        
        // Fallback welcome message
        const welcomeMessage: Message = {
          id: "welcome",
          text: `Hi ${userName}! I'm your WonderWhiz assistant. I'm here to help you learn fascinating topics in depth. What would you like to explore today?`,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true,
          isIntroduction: true
        };
        
        console.log("Setting fallback welcome message");
        setMessages(() => [welcomeMessage]);
        setShowTypingIndicator(false);
        
        // Auto-show suggested prompts after welcome
        setTimeout(() => {
          setShowSuggestedPrompts(true);
        }, 1000);
      }
    };
    
    generatePersonalizedTopics();
  }, [ageRange, avatar, language, userName]);
};
