import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("[Generate Response] Request received");
    const { prompt, ageRange, requestType, language } = await req.json();
    
    console.log(`[Generate Response] Type: ${requestType}, Age: ${ageRange}, Language: ${language}`);
    console.log(`[Generate Response] Prompt: ${prompt.substring(0, 100)}...`);

    // Get GROQ API key for homework help requests
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // For homework help requests, use GROQ with Llama model
    if (requestType === 'homework') {
      console.log("[Generate Response] Processing homework help request with GROQ");
      
      if (!groqApiKey) {
        console.error("[Generate Response] GROQ API key is missing");
        throw new Error("GROQ API key is not configured");
      }
      
      try {
        // Use GROQ API with Llama model for homework help
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              {
                role: 'system',
                content: `You are WonderWhiz, an AI tutor for children aged ${ageRange}. 
                You're helping with homework problems.
                
                Guidelines:
                - Respond in ${language} language
                - Be encouraging, patient, and use simple language
                - Explain concepts step-by-step using analogies
                - Don't just give answers, guide the student through the solution
                - Use emoji occasionally to keep it fun
                - Keep responses concise (max 400 words)
                - If you can't see the image clearly, politely explain that and ask for a clearer photo
                - Sign off with an encouraging message`
              },
              {
                role: 'user',
                content: prompt.replace('[HOMEWORK HELP]', '')
              }
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Generate Response] GROQ API error: ${response.status} - ${errorText}`);
          throw new Error(`GROQ API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[Generate Response] GROQ response received, message length: ${result.choices[0].message.content.length}`);
        
        return new Response(
          JSON.stringify({ content: result.choices[0].message.content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(`[Generate Response] Error with GROQ: ${error}`);
        throw new Error(`Error with GROQ: ${error.message}`);
      }
    }
    
    // Handle text and quiz requests with OpenAI
    if (requestType === 'text' || requestType === 'quiz') {
      const openAiModel = 'gpt-3.5-turbo';
      console.log(`[Generate Response] Using OpenAI model: ${openAiModel}`);
      
      if (!openaiApiKey) {
        console.error("[Generate Response] OpenAI API key is missing");
        throw new Error("OpenAI API key is not configured");
      }
      
      try {
        const systemPrompt = requestType === 'quiz'
          ? `You are a quiz generator for children aged ${ageRange}. Generate a single question quiz about ${prompt}. Return a JSON object with keys "question", "options" (array of strings), "correctAnswer" (index of correct answer), and "funFact".`
          : `You are WonderWhiz, an AI tutor for children aged ${ageRange}. Respond in ${language} language. Be encouraging, patient, and use simple language. Explain concepts step-by-step using analogies. Use emoji occasionally to keep it fun. Keep responses concise (max 400 words). Sign off with an encouraging message.`;
          
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: openAiModel,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Generate Response] OpenAI API error: ${response.status} - ${errorText}`);
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[Generate Response] OpenAI response received, message length: ${result.choices[0].message.content.length}`);
        
        // If it's a quiz, try to parse the JSON
        if (requestType === 'quiz') {
          try {
            const quizContent = JSON.parse(result.choices[0].message.content);
            return new Response(
              JSON.stringify(quizContent),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          } catch (parseError) {
            console.error(`[Generate Response] Error parsing quiz JSON: ${parseError}`);
            throw new Error("Failed to parse quiz JSON");
          }
        }
        
        return new Response(
          JSON.stringify({ content: result.choices[0].message.content }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(`[Generate Response] Error with OpenAI: ${error}`);
        throw new Error(`Error with OpenAI: ${error.message}`);
      }
    }
    
    // Handle image generation requests with OpenAI
    if (requestType === 'image') {
      const openAiImageModel = 'dall-e-3';
      console.log(`[Generate Response] Using OpenAI image model: ${openAiImageModel}`);
      
      if (!openaiApiKey) {
        console.error("[Generate Response] OpenAI API key is missing");
        throw new Error("OpenAI API key is not configured");
      }
      
      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: openAiImageModel,
            prompt: prompt,
            n: 1,
            size: '512x512',
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Generate Response] OpenAI Image API error: ${response.status} - ${errorText}`);
          throw new Error(`OpenAI Image API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`[Generate Response] OpenAI image response received, image URL: ${result.data[0].url}`);
        
        return new Response(
          JSON.stringify({ imageUrl: result.data[0].url }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(`[Generate Response] Error with OpenAI Image API: ${error}`);
        throw new Error(`Error with OpenAI Image API: ${error.message}`);
      }
    }
    
    // Return mock response if something fails or is not implemented
    console.log("[Generate Response] Returning mock response");
    return new Response(
      JSON.stringify({ content: "This is a mock response. The actual functionality is not yet implemented." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`[Generate Response] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
