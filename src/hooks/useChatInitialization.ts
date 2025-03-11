
import { useEffect, useRef } from "react";
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
  const initialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      // Initialize welcome message only if there are no messages
      setMessages(prev => {
        if (prev.length === 0) {
          return [{
            id: "welcome",
            text: `Hi ${userName}! I'm your WonderWhiz assistant, created by Lovable to help you learn amazing things. What would you like to explore today?`,
            isUser: false,
            blocks: ["did-you-know", "mind-blowing", "amazing-stories", "see-it", "quiz"],
            showBlocks: true,
            isIntroduction: true
          }];
        }
        return prev;
      });

      // Initialize demo streak and points only once
      if (!initialized.current) {
        initialized.current = true;
        const savedStreak = Math.floor(Math.random() * 5) + 1;
        const savedPoints = Math.floor(Math.random() * 500);
        setStreakCount(savedStreak);
        setPoints(savedPoints);
      }

      // Generate topics only if user has started and we're still mounted
      if (hasUserStarted && isMounted) {
        try {
          console.log("Generating personalized topics...");
          setShowTypingIndicator(true);

          const topicsPrompt = `Generate 6 fascinating, educational topics specifically for a ${ageRange} year old child. 
            Include a mix of science, history, and hands-on activities they could explore. 
            Topics should be engaging, age-appropriate, and spark curiosity.
            Format as a simple comma-separated list without numbers or explanations.`;

          const topicsResponse = await generateResponse(topicsPrompt, ageRange, language);
          
          if (isMounted) {
            const topics = processTopicsFromResponse(topicsResponse);
            const finalTopics = topics.length >= 6 ? topics.slice(0, 6) : [...topics, ...defaultSuggestedPrompts.slice(0, 6 - topics.length)];
            
            setSuggestedTopics(finalTopics);
            
            // Delay showing prompts slightly
            setTimeout(() => {
              if (isMounted) {
                setShowSuggestedPrompts(true);
              }
            }, 800);
          }
        } catch (error) {
          console.error("Error generating topics:", error);
          if (isMounted) {
            setSuggestedTopics(defaultSuggestedPrompts);
            setShowSuggestedPrompts(true);
          }
        } finally {
          if (isMounted) {
            setShowTypingIndicator(false);
          }
        }
      } else if (isMounted) {
        // Set default topics for new users
        setSuggestedTopics(defaultSuggestedPrompts);
        setTimeout(() => {
          if (isMounted) {
            setShowSuggestedPrompts(true);
          }
        }, 800);
      }
    };

    initializeChat();

    // Cleanup function to prevent updates after unmount
    return () => {
      isMounted = false;
    };
  }, [ageRange, avatar, language, userName, generateResponse, hasUserStarted]);

  return;
};
