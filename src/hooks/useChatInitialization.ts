
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
        
        // Generate age-appropriate topics with better prompt
        const topicsPrompt = `Generate 6 fascinating, educational topics specifically for a ${ageRange} year old child. 
        Include a mix of science, history, and hands-on activities they could explore. 
        Topics should be engaging, age-appropriate, and spark curiosity.
        Format as a simple comma-separated list without numbers or explanations.`;
        
        const topicsResponse = await generateResponse(topicsPrompt, ageRange, language);
        console.log("Generated topics response:", topicsResponse);
        
        // Process topics from the response string
        const topics = processTopicsFromResponse(topicsResponse);
        console.log("Processed topics:", topics);
        
        // Make sure we have exactly 6 topics
        const finalTopics = topics.length >= 6 ? topics.slice(0, 6) : [...topics, ...defaultSuggestedPrompts.slice(0, 6 - topics.length)];
        console.log("Final topics list:", finalTopics);
        
        setSuggestedTopics(finalTopics);
        
        // Get previous topics from localStorage if available
        const previousTopicsJson = localStorage.getItem("wonderwhiz_previous_topics");
        const previousTopics = previousTopicsJson ? JSON.parse(previousTopicsJson) : [];
        
        // Create personalized welcome message with name
        let welcomeText = "";
        
        if (language === "en") {
          if (previousTopics.length > 0) {
            // Returning user with previous topics
            const lastTopic = previousTopics[previousTopics.length - 1];
            const suggestedTopic = finalTopics[0]; // Use the first topic as a suggestion
            
            welcomeText = `Hey ${userName}! 👋 Last time we learned about "${lastTopic}". Would you like to explore "${suggestedTopic}" today? Or ask me anything else you're curious about!`;
          } else {
            // New user or no previous topics
            welcomeText = `Hey ${userName}! 👋 I'm your WonderWhiz assistant. Ask me anything you're curious about, get help with homework, or use me as a dictionary. What would you like to learn today?`;
          }
        } else {
          // This will be translated by the API for other languages
          // Using simpler message for translation purposes
          if (previousTopics.length > 0) {
            const lastTopic = previousTopics[previousTopics.length - 1];
            welcomeText = `Hey ${userName}! Last time we learned about "${lastTopic}". What would you like to explore today?`;
          } else {
            welcomeText = `Hey ${userName}! I'm your WonderWhiz assistant. What would you like to learn today?`;
          }
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
        }, 800);
        
      } catch (error) {
        console.error("Error generating personalized topics:", error);
        setSuggestedTopics(defaultSuggestedPrompts);
        
        // Fallback welcome message
        const welcomeMessage: Message = {
          id: "welcome",
          text: `Hey ${userName}! 👋 I'm your WonderWhiz assistant. Ask me anything you're curious about! What would you like to learn today?`,
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
        }, 800);
      }
    };
    
    generatePersonalizedTopics();
  }, [ageRange, avatar, language, userName]);
};
