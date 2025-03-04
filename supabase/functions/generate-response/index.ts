
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
    const { prompt, ageRange, requestType } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    let response;
    
    if (requestType === 'text') {
      // Define a system message that guides the AI to respond appropriately for kids
      const systemMessage = `You are WonderWhiz, an educational AI assistant designed for children aged ${ageRange}. 
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
      
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 600
        }),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (requestType === 'image') {
      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a child-friendly, educational illustration of: ${prompt}. The image should be colorful, engaging, suitable for children aged ${ageRange}, with a Pixar-inspired art style. Include cute details and visual elements that would appeal to children.`,
          n: 1,
          size: "1024x1024",
          response_format: "url"
        }),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify({ imageUrl: data.data[0].url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (requestType === 'quiz') {
      const systemMessage = `You are an educational quiz generator for children aged ${ageRange}. Create a single multiple-choice question about the topic provided that is educational, engaging, and appropriate for children of this age group. 

      The response must be in the following JSON format exactly, with no additional text:
      {
        "question": "The question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0,
        "funFact": "A brief, fascinating fact related to the correct answer that would amaze a child."
      }
      
      Where "correctAnswer" is the index (0-3) of the correct option in the "options" array.
      Make sure the question is age-appropriate, factually accurate, and educational.
      The fun fact should be mind-blowing and memorable.`;
      
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `Create a quiz question about: ${prompt}` }
          ],
          temperature: 0.7,
          max_tokens: 400
        }),
      });
      
      const data = await response.json();
      let quizData;
      
      try {
        quizData = JSON.parse(data.choices[0].message.content);
        
        // Ensure all required fields are present
        if (!quizData.funFact) {
          quizData.funFact = "Did you know? Learning is like exercise for your brain - it makes your brain stronger!";
        }
      } catch (error) {
        console.error("Error parsing quiz JSON:", error);
        quizData = {
          question: "Which animal has the best sense of smell?",
          options: ["Elephant", "Dog", "Bear", "Shark"],
          correctAnswer: 1,
          funFact: "Did you know? A dog's sense of smell is up to 100,000 times stronger than humans! They can even smell some diseases."
        };
      }
      
      return new Response(JSON.stringify(quizData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
