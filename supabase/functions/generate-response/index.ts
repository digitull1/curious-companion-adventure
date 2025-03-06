
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, ageRange, requestType, language = 'en', imageBase64 } = await req.json();
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    let response;
    
    if (requestType === 'text') {
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
        model: 'gpt-4o-mini',
        prompt: prompt,
        language: language,
        systemMessage: systemMessage
      });

      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 600
        }),
      });
      
      const data = await response.json();
      console.log("OpenAI API Response:", data);
      
      if (!data) {
        console.error("Empty response from OpenAI");
        throw new Error("Empty response from OpenAI");
      }
      
      if (data.error) {
        console.error("OpenAI API error:", data.error);
        throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected response from OpenAI:", JSON.stringify(data));
        throw new Error("Invalid response from OpenAI");
      }
      
      return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (requestType === 'image-analysis') {
      try {
        console.log("Analyzing image with OpenAI...");
        
        let systemPrompt = `You are WonderWhiz, an educational AI assistant designed to help children aged ${ageRange} with homework. 
        You will be shown an image of a homework problem, most likely in subjects like math, science, or language arts.
        
        For MATH PROBLEMS:
        1. Clearly identify what the problem is asking
        2. Break down the solution into step-by-step explanations
        3. Use simple, child-friendly language to explain each step
        4. Teach the underlying concept, not just the answer
        5. Include a final answer clearly marked
        
        For SCIENCE QUESTIONS:
        1. Explain the core concept in simple terms
        2. Use relevant real-world examples that children can relate to
        3. Break down complex ideas into smaller, digestible parts
        
        For LANGUAGE ARTS:
        1. Explain grammar rules clearly
        2. For writing prompts, suggest an approach and structure
        3. For reading comprehension, help identify key elements
        
        Your explanations should be:
        - Age-appropriate (for ${ageRange} year olds)
        - Encouraging and supportive
        - Educational and factually accurate
        - Structured in clear steps
        - Include selective use of emojis to maintain engagement
        - End with a question or suggestion to deepen understanding`;

        // Add language-specific instructions
        if (language !== 'en') {
          systemPrompt += `\n\nIMPORTANT: Respond in ${language} language only. All your content must be in ${language}.`;
        }
        
        console.log("Making request to OpenAI Vision API with:", {
          model: 'gpt-4o-mini',
          imageBase64: imageBase64.substring(0, 50) + "...",
          language: language
        });

        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { 
                role: 'user', 
                content: [
                  { type: 'text', text: 'Help me solve this homework problem:' },
                  { type: 'image_url', image_url: { url: imageBase64 } }
                ] 
              }
            ],
            temperature: 0.5,
            max_tokens: 800
          }),
        });
        
        const data = await response.json();
        console.log("OpenAI Vision API Response:", data);
        
        if (data.error) {
          console.error("OpenAI image analysis error:", data.error);
          throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        console.log("Image analysis successful");
        
        return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (imageAnalysisError) {
        console.error("Image analysis error:", imageAnalysisError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to analyze image",
            message: imageAnalysisError.message
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } 
    
    else if (requestType === 'text-to-speech') {
      try {
        console.log("Generating speech with OpenAI TTS...");
        
        const voice = "nova"; // Use 'alloy', 'echo', 'fable', 'onyx', 'nova', or 'shimmer'
        
        response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: voice,
            input: prompt,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI TTS error:", errorData);
          throw new Error(`OpenAI TTS API error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        // Get the audio data as an ArrayBuffer
        const audioBuffer = await response.arrayBuffer();
        
        // Convert to base64
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
        
        console.log("TTS generation successful");
        
        return new Response(
          JSON.stringify({ 
            audioContent: base64Audio,
            contentType: 'audio/mpeg' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (ttsError) {
        console.error("Text-to-speech error:", ttsError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate speech",
            message: ttsError.message
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
    
    else if (requestType === 'image') {
      try {
        console.log("Generating image with prompt:", prompt);
        
        // Check if we have an OpenAI API error log indicating rate limit issues
        // This is a simplified approach - in production you'd use a proper rate limiter
        const shouldUseFallback = Math.random() > 0.4; // 60% chance to use fallback to avoid rate limits
        
        if (shouldUseFallback) {
          console.log("Using fallback image for rate limit protection");
          
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
          } else if (lowerPrompt.includes("butter chicken") || lowerPrompt.includes("food")) {
            fallbackImageUrl = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80";
          } else {
            // Default image for other topics
            fallbackImageUrl = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
          }
          
          return new Response(JSON.stringify({ imageUrl: fallbackImageUrl }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Simplify the prompt to avoid errors
        const simplifiedPrompt = prompt.length > 500 ? prompt.substring(0, 500) + "..." : prompt;
        
        response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Create a child-friendly, educational illustration of: ${simplifiedPrompt}. The image should be colorful, engaging, suitable for children aged ${ageRange}, with a Pixar-inspired art style.`,
            n: 1,
            size: "1024x1024",
            response_format: "url"
          }),
        });
        
        const data = await response.json();
        console.log("OpenAI Image API Response:", data);
        
        if (!data) {
          console.error("Empty response from OpenAI image API");
          throw new Error("Empty response from image generation API");
        }
        
        if (data.error) {
          console.error("OpenAI API error:", data.error);
          // If hit rate limit, throw specific error
          if (data.error.code === "rate_limit_exceeded") {
            console.log("Rate limit exceeded, returning fallback image");
            
            // Return a placeholder Unsplash image
            const fallbackImageUrl = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
            return new Response(JSON.stringify({ imageUrl: fallbackImageUrl }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        return new Response(JSON.stringify({ imageUrl: data.data[0].url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (imageError) {
        console.error("Image generation error:", imageError);
        
        // Return a more graceful error with status code
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate image",
            message: imageError.message,
            fallback: true
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } 
    
    return new Response(JSON.stringify({ error: 'Invalid request type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-response function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
