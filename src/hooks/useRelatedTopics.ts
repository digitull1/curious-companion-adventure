import { useState, useCallback, useRef } from "react";
import { processTopicsFromResponse } from "@/utils/topicUtils";

export const useRelatedTopics = (
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>
) => {
  // Keep track of topics we've already generated
  const generatedTopicsCache = useRef<Map<string, string[]>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateRelatedTopics = useCallback(async (topic: string, ageRange: string, language: string) => {
    try {
      // First check if we already have this topic in cache
      const cacheKey = `${topic}-${ageRange}-${language}`;
      if (generatedTopicsCache.current.has(cacheKey)) {
        console.log("Using cached related topics for:", topic);
        return generatedTopicsCache.current.get(cacheKey)!;
      }
      
      // Prevent multiple concurrent requests for the same topic
      if (isGenerating) {
        console.log("Already generating related topics, skipping duplicate request");
        return [];
      }
      
      setIsGenerating(true);
      console.log("Generating related topics for:", topic);
      const relatedTopicsPrompt = `Generate 5 related topics to "${topic}" that might interest a learner aged ${ageRange}. Format as a short comma-separated list.`;
      const relatedTopicsResponse = await generateResponse(relatedTopicsPrompt, ageRange, language);
      console.log("Raw related topics response:", relatedTopicsResponse);
      
      // Process the response to extract topics
      const newRelatedTopics = processTopicsFromResponse(relatedTopicsResponse);
      console.log("Processed related topics:", newRelatedTopics);
      
      // Make sure we have up to 5 topics
      const finalRelatedTopics = newRelatedTopics.slice(0, 5);
      console.log("Final related topics list:", finalRelatedTopics);
      
      // Save to cache
      generatedTopicsCache.current.set(cacheKey, finalRelatedTopics);
      
      return finalRelatedTopics;
    } catch (error) {
      console.error("Error generating related topics:", error);
      // Fallback related topics
      return [
        "Space exploration", 
        "Astronomy facts", 
        "Planets and moons", 
        "Solar system formation", 
        "Black holes"
      ];
    } finally {
      setIsGenerating(false);
    }
  }, [generateResponse, isGenerating]);

  return { generateRelatedTopics };
};
