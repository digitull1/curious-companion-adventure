
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { QuizQuestion } from '@/types/learning';

// Create a Supabase client safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if we have both URL and key
const supabaseClient = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Hook declaration starts here
export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);

  // Generate response from AI
  const generateResponse = async (prompt: string, ageRange: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Check if supabaseClient is available
      if (!supabaseClient) {
        console.error('Supabase client not initialized. Check your environment variables.');
        return 'Could not connect to the AI service. Please check your configuration.';
      }

      // In a real implementation, this would call an API
      const { data, error } = await supabaseClient.functions.invoke('generate-response', {
        body: { prompt, ageRange }
      });

      if (error) {
        console.error('Error generating response:', error);
        throw new Error('Failed to generate response');
      }

      return data?.response || 'I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return 'Sorry, there was an error generating a response. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  // Generate image based on prompt
  const generateImage = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Mock implementation - in a real app, this would call an image generation API
      // For now, we'll just return a placeholder image URL
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      return '/placeholder.svg';
    } catch (error) {
      console.error('Error generating image:', error);
      return '/placeholder.svg';
    } finally {
      setIsLoading(false);
    }
  };

  // Generate quiz questions
  const generateQuiz = async (topic: string): Promise<QuizQuestion> => {
    setIsLoading(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      return {
        question: `What is the most interesting fact about ${topic}?`,
        options: [
          'It was discovered in 1901',
          'It changed how we understand the world',
          'It was invented by accident',
          'It has influenced modern technology'
        ],
        correctAnswer: 1,
        explanation: 'This fact fundamentally changed our understanding of the world around us.'
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      return {
        question: 'Quiz generation failed. Try again?',
        options: ['Yes', 'No'],
        correctAnswer: 0
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateResponse,
    generateImage,
    generateQuiz
  };
}

export default useOpenAI;
