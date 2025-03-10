import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format response similar to the existing generate-response function
const formatLLMResponse = (text: string): string => {
  if (!text) return '';
  
  // Track emoji usage to limit frequency
  let emojiCount = 0;
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const emojisInText = text.match(emojiRegex) || [];
  emojiCount = emojisInText.length;
  
  let formattedText = text;
  
  // 1. Reduce excessive emojis (limit to ~1 emoji per paragraph)
  if (emojiCount > 3) {
    // Count paragraphs to determine reasonable emoji count
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const targetEmojiCount = Math.min(paragraphs.length + 1, 5); // Max 5 emojis
    
    if (emojiCount > targetEmojiCount) {
      // Extract all emojis
      const emojis = Array.from(text.matchAll(emojiRegex)).map(m => m[0]);
      
      // Keep only the first few emojis
      const emojisToKeep = emojis.slice(0, targetEmojiCount);
      const emojisToRemove = emojis.slice(targetEmojiCount);
      
      // Remove excess emojis
      let cleanedText = formattedText;
      emojisToRemove.forEach(emoji => {
        cleanedText = cleanedText.replace(new RegExp(emoji, 'g'), '');
      });
      
      formattedText = cleanedText;
    }
  }
  
  // 2. Remove emoji clusters (more than 2 consecutive emojis)
  formattedText = formattedText.replace(/(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}]{2,})/gu, match => {
    return match.slice(0, 1); // Keep only the first emoji
  });
  
  // 3. Fix formatting issues
  // Fix excessive spaces
  formattedText = formattedText.replace(/\s{2,}/g, ' ');
  
  // Restore paragraph breaks (keep existing ones)
  if (!formattedText.includes('\n\n')) {
    formattedText = formattedText.replace(/\.\s+([A-Z])/g, '.\n\n$1');
  }
  
  // 4. Remove duplicate paragraph breaks
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
  
  return formattedText;
};

const getSystemPromptForImageAnalysis = (ageRange: string, language: string = 'en'): string => {
  let systemPrompt = `You are WonderWhiz, an educational AI assistant for children aged ${ageRange} that specializes in analyzing images. A child has sent you an image of their homework, a problem, or something they want to understand better.

  Your task is to:
  1. Identify what's in the image (homework, math problem, science diagram, etc.)
  2. Provide a clear, child-friendly explanation of the content
  3. If it's a homework question or problem, help the child understand how to solve it (without directly giving the answer)
  4. Include interesting related facts to make the explanation engaging
  5. If appropriate, suggest a simple activity or experiment related to the topic

  Your responses should be:
  - Age-appropriate for ${ageRange} year olds
  - Educational and accurate
  - Encouraging and supportive
  - Written with simple vocabulary and short sentences
  - Structured with paragraph breaks for readability
  - Include 1-2 emojis maximum to emphasize key points
  - End with a question to encourage further exploration

  NEVER say you can't see or analyze the image. Always make your best effort to identify what's in it and provide helpful information. If the image is unclear, focus on the most likely interpretation.`;
  
  if (language !== 'en') {
    systemPrompt += `\n\nIMPORTANT: Respond in ${language} language only. All your content must be in ${language}.`;
  }
  
  return systemPrompt;
};

// Generate fallback response if image processing fails
const generateFallbackResponse = (language: string = 'en') => {
  if (language === 'en') {
    return "I see your image! It looks like you're working on something interesting. Could you tell me a bit more about what you'd like to learn or what help you need with this? I can explain concepts, help with homework, or share fun facts about what I see!";
  } else {
    // Generic response in other languages
    return "I see your image! Please tell me what you'd like to know about it.";
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, ageRange = '8-12', language = 'en' } = await req.json();
    console.log(`[DEBUG] Processing image for age: ${ageRange}, language: ${language}`);
    
    // Check API key
    if (!groqApiKey) {
      console.error('[ERROR] GROQ_API_KEY is not set in environment variables');
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    
    // Define the system message with content guidelines
    const systemMessage = getSystemPromptForImageAnalysis(ageRange, language);
    
    try {
      console.log("[DEBUG] Sending image to Groq for analysis...");
      
      // Use Groq's llama3-70b-8192 model which has vision capabilities
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',  // Using Llama3 with vision capabilities
          messages: [
            { role: 'system', content: systemMessage },
            { 
              role: 'user', 
              content: [
                { type: 'text', text: 'Please analyze this image and help me understand it:' },
                { type: 'image_url', image_url: { url: image } }
              ]
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        }),
      });
      
      const data = await response.json();
      console.log("[DEBUG] Received response from Groq");
      
      // Add error logging and check for expected response structure
      if (!data) {
        console.error("Empty response from Groq");
        throw new Error("Empty response from Groq");
      }
      
      if (data.error) {
        console.error("Groq API error:", data.error);
        throw new Error(`Groq API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected response from Groq:", JSON.stringify(data));
        throw new Error("Invalid response from Groq");
      }
      
      // Apply content formatting guidelines to clean up the response
      const formattedContent = formatLLMResponse(data.choices[0].message.content);
      console.log("[DEBUG] Formatted image analysis content:", formattedContent.substring(0, 100) + "...");
      
      return new Response(JSON.stringify({ content: formattedContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      
      // Return a fallback response instead of an error
      return new Response(JSON.stringify({ content: generateFallbackResponse(language) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('[ERROR] Error in process-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
