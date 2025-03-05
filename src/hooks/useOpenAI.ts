
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { QuizQuestion } from '@/types/learning';
import { toast } from 'sonner';

// Create a Supabase client safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log environment variable status to help with debugging
console.log('Supabase URL status:', supabaseUrl ? 'Exists' : 'Missing');
console.log('Supabase Key status:', supabaseKey ? 'Exists' : 'Missing');

// Only create the client if we have both URL and key
const supabaseClient = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabaseClient) {
  console.error('Failed to initialize Supabase client. URL or Key is missing.');
}

// Hook declaration starts here
export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);

  // Generate response from AI
  const generateResponse = async (prompt: string, ageRange: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Check if supabaseClient is available
      if (!supabaseClient) {
        console.error('Supabase client not initialized. Check your environment variables:', {
          urlExists: Boolean(supabaseUrl),
          keyExists: Boolean(supabaseKey)
        });
        toast.error('Could not connect to the AI service. Please check your environment variables.');
        return 'Could not connect to the AI service. Please check your configuration.';
      }

      console.log('Calling Supabase Edge Function with prompt:', prompt);
      
      // We're calling an edge function here, so let's try a direct call with proper error handling
      const { data, error } = await supabaseClient.functions.invoke('generate-response', {
        body: { 
          prompt, 
          ageRange,
          requestType: 'text' // Adding requestType to match edge function expectations
        }
      });

      if (error) {
        console.error('Error generating response from Edge Function:', error);
        throw new Error(`Failed to generate response: ${error.message}`);
      }

      console.log('Response received from Edge Function:', data);
      
      // The Edge Function sends back data.content for text responses
      return data?.content || 'I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('Error in generateResponse:', error);
      toast.error('Sorry, there was an error connecting to the AI service.');
      return 'Sorry, there was an error generating a response. Please check your configuration and try again.';
    } finally {
      setIsLoading(false);
    }
  };

  // Generate image based on prompt
  const generateImage = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      if (!supabaseClient) {
        console.error('Supabase client not initialized for image generation');
        return '/placeholder.svg';
      }

      console.log('Calling Edge Function for image generation with prompt:', prompt);
      
      const { data, error } = await supabaseClient.functions.invoke('generate-response', {
        body: { 
          prompt, 
          requestType: 'image'
        }
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      console.log('Image generation response:', data);
      return data?.imageUrl || '/placeholder.svg';
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
      if (!supabaseClient) {
        console.error('Supabase client not initialized for quiz generation');
        return {
          question: 'Quiz generation failed. Try again?',
          options: ['Yes', 'No'],
          correctAnswer: 0
        };
      }

      console.log('Calling Edge Function for quiz generation with topic:', topic);
      
      const { data, error } = await supabaseClient.functions.invoke('generate-response', {
        body: { 
          prompt: topic, 
          requestType: 'quiz'
        }
      });

      if (error) {
        console.error('Error generating quiz:', error);
        throw error;
      }

      console.log('Quiz generation response:', data);
      
      return data || {
        question: 'Quiz generation failed. Try again?',
        options: ['Yes', 'No'],
        correctAnswer: 0
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
