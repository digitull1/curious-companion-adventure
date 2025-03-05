
import { useState } from "react";
import { supabaseClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Topic, QuizQuestion, MiniChallenge } from "@/types/learning";

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const generateResponse = async (prompt: string, ageRange: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.functions.invoke("generate-response", {
        body: { prompt, ageRange, requestType: "text" },
      });
      
      if (error) throw error;
      
      return data.content;
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response. Please try again.");
      return "I'm sorry, I couldn't generate a response at the moment. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateTableOfContents = async (topic: string, ageRange: string): Promise<Topic[]> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.functions.invoke("generate-response", {
        body: { prompt: topic, ageRange, requestType: "toc" },
      });
      
      if (error) throw error;
      
      return data.topics || [];
    } catch (error) {
      console.error("Error generating table of contents:", error);
      toast.error("Failed to generate table of contents. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateRelatedTopics = async (topic: string, ageRange: string): Promise<Topic[]> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.functions.invoke("generate-response", {
        body: { prompt: topic, ageRange, requestType: "relatedTopics" },
      });
      
      if (error) throw error;
      
      return data.topics || [];
    } catch (error) {
      console.error("Error generating related topics:", error);
      toast.error("Failed to generate related topics. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateImage = async (prompt: string, ageRange: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.functions.invoke("generate-response", {
        body: { prompt, ageRange, requestType: "image" },
      });
      
      if (error) throw error;
      
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateQuiz = async (topic: string, ageRange: string): Promise<QuizQuestion> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.functions.invoke("generate-response", {
        body: { prompt: topic, ageRange, requestType: "quiz" },
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
      return {
        question: "What makes learning fun?",
        options: ["Curiosity", "Challenges", "Discovery", "All of the above"],
        correctAnswer: 3,
        explanation: "Learning is most fun when we're curious, face interesting challenges, and discover new things!",
        funFact: "Your brain forms new connections every time you learn something new!"
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateMiniChallenge = async (topic: string, ageRange: string): Promise<MiniChallenge> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.functions.invoke("generate-response", {
        body: { prompt: topic, ageRange, requestType: "miniChallenge" },
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error generating mini challenge:", error);
      toast.error("Failed to generate challenge. Please try again.");
      return {
        question: "Imagine you're exploring this topic for the first time. What would you want to learn about it?",
        type: "thought-experiment"
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    generateResponse,
    generateTableOfContents,
    generateRelatedTopics,
    generateImage,
    generateQuiz,
    generateMiniChallenge
  };
};
