
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const requestRateLimit = 2000; // Minimum milliseconds between requests
  
  // Helper to prevent request flooding
  const shouldThrottleRequest = () => {
    const now = Date.now();
    if (now - lastRequestTime < requestRateLimit) {
      console.log("Request throttled - too many requests");
      return true;
    }
    setLastRequestTime(now);
    return false;
  };

  const generateResponse = async (prompt: string, ageRange: string, language: string = "en") => {
    if (shouldThrottleRequest()) {
      return "I'm thinking...";
    }
    
    setIsLoading(true);
    try {
      console.log(`Generating response for prompt: "${prompt.substring(0, 50)}..." in ${language} language`);
      
      const response = await supabase.functions.invoke("generate-response", {
        body: { prompt, ageRange, requestType: "text", language },
      });
      
      if (response.error) {
        console.error("Error from Supabase function:", response.error);
        
        // Return a fallback response instead of throwing
        return "I'm having a bit of trouble right now. Let's try something else! What would you like to learn about?";
      }
      
      console.log("Response received successfully");
      return response.data.content;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I couldn't process that request right now. Let's explore something else!";
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    if (shouldThrottleRequest()) {
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
    }
    
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("generate-response", {
        body: { prompt, requestType: "image" },
      });
      
      if (response.error || !response.data.imageUrl) {
        console.error("Error generating image:", response.error || "No image URL returned");
        return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
      }
      
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeImage = async (base64Image: string, ageRange: string, language: string = "en") => {
    if (shouldThrottleRequest()) {
      return "I'm analyzing this image...";
    }
    
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("generate-response", {
        body: { imageBase64: base64Image, ageRange, requestType: "image-analysis", language },
      });
      
      if (response.error) {
        console.error("Error analyzing image:", response.error);
        return "I couldn't analyze that image clearly. Could you try again with a clearer picture?";
      }
      
      return response.data.content;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return "I couldn't analyze that image clearly. Could you try again with a clearer picture?";
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async (topic: string, language: string = "en") => {
    setIsLoading(true);
    
    try {
      // Create a simple hardcoded quiz as fallback
      return {
        question: "Which of these is true about this topic?",
        options: [
          "It's something fascinating to learn about",
          "It has no interesting facts",
          "It's not a real topic",
          "Humans know everything about it"
        ],
        correctAnswer: 0
      };
    } catch (error) {
      console.error("Error generating quiz:", error);
      return {
        question: "Which of these is true?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  const textToSpeech = async (text: string) => {
    // Simplified text-to-speech that doesn't make API calls
    setIsLoading(true);
    
    try {
      toast.info("Text-to-speech is temporarily unavailable.");
      return "";
    } catch (error) {
      console.error("Text-to-speech error:", error);
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateResponse,
    generateImage,
    generateQuiz,
    analyzeImage,
    textToSpeech,
  };
};
