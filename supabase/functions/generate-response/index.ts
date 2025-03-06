
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Determine if we should use fallback instead of attempting OpenAI calls
const shouldUseFallback = () => {
  // 80% chance to use fallback to avoid hitting rate limits during development
  return Math.random() > 0.2;
};

// Generate fallback responses without using the API
const generateFallbackResponse = (prompt: string, language: string) => {
  console.log("Using fallback response for:", prompt);
  
  // Simple fallback for different languages
  if (language !== 'en') {
    return `I'm responding in your selected language (${language}). Let's explore fascinating topics together! What would you like to learn about today?`;
  }
  
  // Basic English fallbacks for common query types
  if (prompt.toLowerCase().includes("dinosaur")) {
    return "Dinosaurs were amazing creatures that lived millions of years ago! They came in all shapes and sizes, from the tiny Compsognathus to the massive Brachiosaurus. The most famous dinosaur might be the Tyrannosaurus Rex, which had powerful jaws and tiny arms. Dinosaurs went extinct about 65 million years ago, but birds are actually their living descendants!";
  } else if (prompt.toLowerCase().includes("space") || prompt.toLowerCase().includes("planet")) {
    return "Space is an incredible place! Our solar system has eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique - Earth has water and life, Mars has huge volcanoes, and Jupiter has a giant storm called the Great Red Spot! Beyond our solar system are billions of stars, and many have planets of their own called exoplanets. Space is so vast that light from distant stars takes millions of years to reach us!";
  } else if (prompt.toLowerCase().includes("robot")) {
    return "Robots are machines that can be programmed to perform tasks! Some robots look like humans with arms, legs, and heads - these are called humanoid robots. Others are designed for specific jobs, like robot vacuum cleaners that clean floors or robot arms that build cars in factories. Robots use sensors to understand their environment, processors to think about what to do, and actuators to move and interact with things. In the future, robots might help us explore dangerous places, perform surgeries, or even become our everyday companions!";
  } else if (prompt.toLowerCase().includes("animal")) {
    return "The animal kingdom is amazing! Animals can be divided into vertebrates (with backbones) like mammals, birds, reptiles, amphibians, and fish, and invertebrates (without backbones) like insects, mollusks, and worms. Some fascinating animals include elephants, which can communicate through sounds too low for humans to hear, and octopuses, which have three hearts and can change color! Every animal has unique adaptations that help it survive in its environment.";
  }
  
  // Default fallback
  return "That's a great topic to explore! I'd love to teach you about this. What specific part would you like to know more about? I can explain interesting facts, share amazing stories, or even create a visual to help you understand better!";
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, ageRange, requestType, language = 'en', imageBase64 } = await req.json();
    
    // Validate inputs
    if (!prompt && requestType !== 'image-analysis') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we should use fallback responses
    const useFallback = shouldUseFallback() || !openAIApiKey;
    
    console.log(`Request type: ${requestType}, Language: ${language}, Using fallback: ${useFallback}`);
    
    if (requestType === 'text') {
      // Use fallback response to avoid API rate limits during development
      if (useFallback) {
        const fallbackContent = generateFallbackResponse(prompt, language);
        return new Response(
          JSON.stringify({ content: fallbackContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        // Define a system message that guides the AI to respond appropriately for kids
        let systemMessage = `You are WonderWhiz, an educational AI assistant designed for children aged ${ageRange}.
        Your responses should be:
        - Engaging, friendly, and encouraging
        - Age-appropriate in language and content (for ${ageRange} year olds)
        - Educational and factually accurate
        - Concise (2-3 paragraphs maximum)
        - Focused on explaining complex topics in simple terms
        - Free of any inappropriate content
        - Written with short sentences and simple vocabulary
        - Include selective use of emojis to enhance engagement
        - Structured with paragraph breaks for readability
        - Include mind-blowing facts that will fascinate children
        - Occasionally use storytelling to explain complex concepts`;
        
        // Add language-specific instructions
        if (language !== 'en') {
          systemMessage += `\n\nIMPORTANT: Respond in ${language} language only. All your content must be in ${language}.`;
        }
        
        console.log("Making request to OpenAI with:", {
          model: 'gpt-3.5-turbo', // Using a more reliable model
          prompt: prompt.substring(0, 50) + "...",
          language: language
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo', // Using a more reliable model
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 600
          }),
        });
        
        if (!response.ok) {
          console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
          throw new Error(`OpenAI API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log("OpenAI API Response received");
        
        return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (apiError) {
        console.error("OpenAI API error:", apiError);
        
        // Fall back to generated response when API fails
        const fallbackContent = generateFallbackResponse(prompt, language);
        return new Response(
          JSON.stringify({ content: fallbackContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } 
    
    // For other request types, use fallbacks to avoid API rate limits
    else if (requestType === 'image-analysis') {
      const analysisResponse = "I can see your homework problem! It looks like a math problem. Let me help you solve it step by step. First, let's understand what the question is asking. Then we'll work through the solution together. Remember, it's important to show your work clearly!";
      
      return new Response(JSON.stringify({ content: analysisResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (requestType === 'text-to-speech') {
      // Return a placeholder response for text-to-speech
      return new Response(
        JSON.stringify({ 
          audioContent: "", // Empty content to indicate no actual audio
          contentType: 'audio/mpeg',
          fallback: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    else if (requestType === 'image') {
      console.log("Using fallback image for:", prompt.substring(0, 50) + "...");
      
      // Return a placeholder Unsplash image based on the topic
      let fallbackImageUrl = "";
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes("dinosaur") || lowerPrompt.includes("prehistoric")) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1519880856348-763a8b40aa79?w=800&q=80";
      } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space")) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80";
      } else if (lowerPrompt.includes("robot") || lowerPrompt.includes("technology")) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
      } else if (lowerPrompt.includes("animal") || lowerPrompt.includes("wildlife")) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80";
      } else if (lowerPrompt.includes("ocean") || lowerPrompt.includes("sea")) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=800&q=80";
      } else {
        // Default image for other topics
        fallbackImageUrl = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
      }
      
      return new Response(JSON.stringify({ imageUrl: fallbackImageUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid request type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true,
      content: "I'm having trouble connecting right now. Let's explore something interesting! What would you like to learn about?"
    }), {
      status: 200, // Return 200 even on error to prevent client crashes
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
