
import { useState, useCallback } from "react";
import { toast } from "sonner";

// Cache for storing generated topics to prevent redundant API calls
const topicsCache = new Map<string, string[]>();

export const useRelatedTopics = (
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
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
      setGenerationError(null);
      
      try {
        // Improved prompt to generate more contextual related topics
        const prompt = `
          As an engaging educator, generate 5 fascinating related topics that would spark a ${ageRange} year old child's curiosity after learning about "${topic}".
          
          Make your suggestions:
          1. Directly related to aspects of "${topic}"
          2. Interesting and age-appropriate for a ${ageRange} year old
          3. Brief (2-5 words)
          4. Phrased in an intriguing way
          
          Return ONLY a simple comma-separated list with no numbering, introduction or explanation.
          
          For example, if the topic was "Dinosaurs", you might return:
          "Prehistoric Plants, Fossil Discovery, Ancient Oceans, Extinction Theories, Modern Dinosaur Relatives"
        `;
        
        const response = await generateResponse(prompt, ageRange, language);
        
        // Process the response to get a clean array of topics
        const topics = parseTopicsFromResponse(response, topic);
        console.log(`[RelatedTopics] Generated ${topics.length} topics:`, topics);
        
        // Show a fun success message if topics were generated
        if (topics.length > 0) {
          toast.success("Discovered exciting new adventures!", {
            description: "Check out these amazing related topics!",
            duration: 3000,
          });
        }
        
        // Cache the results
        topicsCache.set(cacheKey, topics);
        
        return topics;
      } catch (error) {
        console.error("[RelatedTopics] Error generating related topics:", error);
        const errorMessage = "Couldn't find new adventures right now. Let's try again later!";
        setGenerationError(errorMessage);
        toast.error("Oops! Adventure Detour!", {
          description: errorMessage,
        });
        return generateContextualFallbackTopics(topic);
      } finally {
        setIsGenerating(false);
      }
    },
    [generateResponse]
  );

  return {
    generateRelatedTopics,
    isGenerating,
    generationError
  };
};

// Helper function to parse topics from the API response
const parseTopicsFromResponse = (response: string, originalTopic: string): string[] => {
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
  
  // Try to parse as semicolon-separated list
  const semicolonList = response
    .split(';')
    .map(item => item.trim())
    .filter(item => item.length > 0 && item.length < 50);
    
  if (semicolonList.length >= 3) {
    return semicolonList.slice(0, 5);
  }
  
  // If all else fails, create contextual fallback topics
  return generateContextualFallbackTopics(originalTopic);
};

// Generate context-aware fallback related topics
const generateContextualFallbackTopics = (topic: string): string[] => {
  const lowerTopic = topic.toLowerCase();
  
  // History and landmarks fallbacks
  if (
    lowerTopic.includes("taj mahal") || 
    lowerTopic.includes("monument") || 
    lowerTopic.includes("temple") ||
    lowerTopic.includes("building") ||
    lowerTopic.includes("wonder") ||
    lowerTopic.includes("pyramid") ||
    lowerTopic.includes("palace")
  ) {
    return [
      "Famous Landmarks",
      "Architectural Wonders",
      "Ancient Buildings",
      "World Heritage Sites",
      "Historical Monuments"
    ];
  }
  
  // Space related fallbacks
  if (
    lowerTopic.includes("space") || 
    lowerTopic.includes("planet") || 
    lowerTopic.includes("star") || 
    lowerTopic.includes("moon") || 
    lowerTopic.includes("rocket") ||
    lowerTopic.includes("galaxy") ||
    lowerTopic.includes("astronaut")
  ) {
    return [
      "Planet Exploration",
      "Space Missions",
      "Astronaut Adventures",
      "Galaxy Discoveries",
      "Space Technology"
    ];
  }
  
  // Animal related fallbacks
  if (
    lowerTopic.includes("animal") || 
    lowerTopic.includes("tiger") || 
    lowerTopic.includes("lion") || 
    lowerTopic.includes("elephant") || 
    lowerTopic.includes("wildlife") ||
    lowerTopic.includes("zoo") ||
    lowerTopic.includes("pet")
  ) {
    return [
      "Animal Habitats",
      "Wildlife Protection",
      "Amazing Creatures",
      "Animal Families",
      "Endangered Species"
    ];
  }
  
  // Science related fallbacks
  if (
    lowerTopic.includes("science") || 
    lowerTopic.includes("experiment") || 
    lowerTopic.includes("laboratory") || 
    lowerTopic.includes("chemical") || 
    lowerTopic.includes("biology") ||
    lowerTopic.includes("physics")
  ) {
    return [
      "Fun Experiments",
      "Scientific Discoveries",
      "Famous Scientists",
      "Science in Action",
      "Everyday Science"
    ];
  }
  
  // Technology related fallbacks
  if (
    lowerTopic.includes("robot") || 
    lowerTopic.includes("computer") || 
    lowerTopic.includes("technology") || 
    lowerTopic.includes("internet") || 
    lowerTopic.includes("gadget") ||
    lowerTopic.includes("machine")
  ) {
    return [
      "Robot Helpers",
      "Future Technology",
      "Amazing Inventions",
      "Smart Machines",
      "Coding Adventures"
    ];
  }
  
  // Generic but somewhat related fallbacks
  return [
    `The History of ${topic}`,
    `${topic} Adventures`,
    `Amazing ${topic} Facts`,
    `${topic} Around the World`,
    `Fun with ${topic}`
  ];
};

export default useRelatedTopics;
