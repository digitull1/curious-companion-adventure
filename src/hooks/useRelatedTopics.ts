
import { processTopicsFromResponse } from "@/utils/topicUtils";

export const useRelatedTopics = (
  generateResponse: (prompt: string, ageRange: string, language: string) => Promise<string>
) => {
  const generateRelatedTopics = async (topic: string, ageRange: string, language: string) => {
    try {
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
    }
  };

  return { generateRelatedTopics };
};
