
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
  defaultSuggestedPrompts: string[],
  hasUserStarted: boolean
) => {
  useEffect(() => {
    const initializeChat = async () => {
      // Always show welcome message first
      setMessages(() => [
        {
          id: "welcome",
          text: `Hi ${userName}! I'm your WonderWhiz assistant, created by Lovable to help you learn amazing things. What would you like to explore today?`,
          isUser: false,
          blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
          showBlocks: true,
          isIntroduction: true
        }
      ]);

      // Initialize streak and points regardless of whether user has started
      const savedStreak = Math.floor(Math.random() * 5) + 1; // Random 1-5 for demo
      const savedPoints = Math.floor(Math.random() * 500); // Random points for demo
      setStreakCount(savedStreak);
      setPoints(savedPoints);

      // Only generate topics if user has started
      if (hasUserStarted) {
        try {
          console.log("Chat component mounted, initializing...");
          console.log("User data:", { userName, ageRange, avatar, language });
          
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
              
              // Auto-show suggested prompts after welcome
              setTimeout(() => {
                setShowSuggestedPrompts(true);
              }, 800);
              
            } catch (error) {
              console.error("Error generating personalized topics:", error);
              setSuggestedTopics(defaultSuggestedPrompts);
              
              // Auto-show suggested prompts after welcome
              setTimeout(() => {
                setShowSuggestedPrompts(true);
              }, 800);
            } finally {
              setShowTypingIndicator(false);
            }
          };
          
          generatePersonalizedTopics();
        } catch (error) {
          console.error("Error initializing chat:", error);
          setShowTypingIndicator(false);
        }
      } else {
        // Even if user hasn't started, show suggested prompts
        setSuggestedTopics(defaultSuggestedPrompts);
        setTimeout(() => {
          setShowSuggestedPrompts(true);
        }, 800);
      }
    };

    initializeChat();
  }, [ageRange, avatar, language, userName, generateResponse, hasUserStarted, setMessages, setPoints, setShowSuggestedPrompts, setShowTypingIndicator, setStreakCount, setSuggestedTopics, defaultSuggestedPrompts]);
};
