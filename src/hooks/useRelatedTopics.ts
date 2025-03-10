
import { useState, useCallback } from "react";
import { toast } from "sonner";

// Cache for storing generated topics to prevent redundant API calls
const topicsCache = new Map<string, string[]>();

export const useRelatedTopics = (
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateRelatedTopics = useCallback(
    async (topic: string, ageRange: string, language: string): Promise<string[]> => {
      // Create a cache key based on topic, age and language
      const cacheKey = `${topic}-${ageRange}-${language}`;
      
      // Check if we already have these topics cached
      if (topicsCache.has(cacheKey)) {
        console.log(`[RelatedTopics] Using cached topics for: ${cacheKey}`);
        return topicsCache.get(cacheKey) || [];
      }
      
      console.log(`[RelatedTopics] Generating related topics for: ${topic} with language: ${language}`);
      setIsGenerating(true);
      
      try {
        const prompt = `Generate 5 related topics that would interest someone learning about "${topic}". Return these as a simple comma-separated list with no numbering, introduction or explanation. Make each suggestion brief (2-5 words).`;
        
        const response = await generateResponse(prompt, ageRange, language);
        
        // Process the response to get a clean array of topics
        const topics = parseTopicsFromResponse(response);
        console.log(`[RelatedTopics] Generated ${topics.length} topics:`, topics);
        
        // Cache the results
        topicsCache.set(cacheKey, topics);
        
        return topics;
      } catch (error) {
        console.error("[RelatedTopics] Error generating related topics:", error);
        toast.error("Couldn't generate related topics right now.");
        return [];
      } finally {
        setIsGenerating(false);
      }
    },
    [generateResponse]
  );

  return {
    generateRelatedTopics,
    isGenerating
  };
};

// Helper function to parse topics from the API response
const parseTopicsFromResponse = (response: string): string[] => {
  // Try different parsing strategies
  
  // First, try to parse as comma-separated list (most likely format)
  const commaList = response
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0 && item.length < 50);
  
  if (commaList.length >= 3) {
    return commaList.slice(0, 5);
  }
  
  // Try to parse as line-separated list
  const lineList = response
    .split('\n')
    .map(item => item.replace(/^\d+\.\s*/, '').trim()) // Remove any numbering
    .filter(item => item.length > 0 && item.length < 50);
  
  if (lineList.length >= 3) {
    return lineList.slice(0, 5);
  }
  
  // If all else fails, just return a partial list or empty list
  return commaList.length > 0 ? commaList.slice(0, 5) : ['More about ' + response.slice(0, 20)];
};

export default useRelatedTopics;
