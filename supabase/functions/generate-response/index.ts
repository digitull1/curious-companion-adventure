
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
      - Structured in the following format for each section:
        1. HOOK & CURIOSITY (50 words): Start with a question, challenge, or fun fact to spark interest
        2. CORE EXPLANATION (300-350 words): Break down the topic into 3-4 engaging sub-sections
        3. MIND-BLOWING FACT (50 words): Introduce a surprising fact that keeps curiosity alive
        4. MINI CHALLENGE (50 words): Ask a thought-provoking question, role-playing scenario, or problem
      - Section length should be approximately 500 words total
      - Include smooth transitions between sections that summarize key points while teasing the next topic
      - Use storytelling techniques with varied approaches for each section
      - Include selective use of emojis to enhance engagement
      - Use conversational, curiosity-driven language with short sentences
      - Include paragraph breaks for readability
      - Focus on creating mental images through descriptive language
      - End with a prompt for the user to try a quiz or see a visual representation
      - Avoid using formal academic language or jargon unless explaining it in simple terms`;
      
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
          max_tokens: 1000
        }),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (requestType === 'toc') {
      const systemMessage = `You are WonderWhiz, an educational AI assistant designed for children. Create an engaging table of contents for a topic with 4-5 sections. Each section should have:
      1. A captivating title
      2. A brief 1-2 line description that creates curiosity
      3. An appropriate emoji
      
      Format the response as a valid JSON array of objects with "title", "description", and "emoji" fields. Example:
      [
        {
          "title": "The Rise of the Gupta Empire",
          "description": "How did a small kingdom grow into a mighty empire?",
          "emoji": "👑"
        }
      ]
      
      Make the TOC feel like an adventure, not a flat list. The descriptions should make children curious to learn more.`;
      
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
            { role: 'user', content: `Create a table of contents for learning about: ${prompt}` }
          ],
          temperature: 0.7,
          max_tokens: 600
        }),
      });
      
      const data = await response.json();
      let tocData;
      
      try {
        tocData = JSON.parse(data.choices[0].message.content);
      } catch (error) {
        console.error("Error parsing TOC JSON:", error);
        tocData = [
          {
            title: "Introduction to the Topic",
            description: "What makes this topic so fascinating?",
            emoji: "✨"
          },
          {
            title: "Key Concepts",
            description: "The building blocks you need to understand",
            emoji: "🧩"
          },
          {
            title: "Amazing Applications",
            description: "How this knowledge is used in the real world",
            emoji: "🔍"
          },
          {
            title: "Fun Facts & Discoveries",
            description: "Mind-blowing things you never knew!",
            emoji: "🤯"
          }
        ];
      }
      
      return new Response(JSON.stringify({ topics: tocData }), {
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
    
    else if (requestType === 'relatedTopics') {
      const systemMessage = `You are an educational content planner for children aged ${ageRange}. Generate 5 related topics that would interest a child who just learned about the main topic. Format as a JSON array of objects with "title", "description", and "emoji" fields. Example:
      [
        {
          "title": "The Wonders of Ancient China",
          "description": "Discover amazing inventions and the Great Wall!",
          "emoji": "🏯"
        }
      ]`;
      
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
            { role: 'user', content: `Generate 5 related topics to ${prompt} that might interest a ${ageRange} year old learner.` }
          ],
          temperature: 0.7,
          max_tokens: 600
        }),
      });
      
      const data = await response.json();
      let relatedTopicsData;
      
      try {
        relatedTopicsData = JSON.parse(data.choices[0].message.content);
      } catch (error) {
        console.error("Error parsing related topics JSON:", error);
        relatedTopicsData = [
          {
            title: "Related Topic 1",
            description: "Something interesting related to the main topic",
            emoji: "🌟"
          },
          {
            title: "Related Topic 2",
            description: "Another fascinating connection",
            emoji: "🔍"
          }
        ];
      }
      
      return new Response(JSON.stringify({ topics: relatedTopicsData }), {
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
        "explanation": "A brief, child-friendly explanation of why this answer is correct and what makes it important to know.",
        "funFact": "A brief, fascinating fact related to the correct answer that would amaze a child."
      }
      
      Where "correctAnswer" is the index (0-3) of the correct option in the "options" array.
      Make sure the question is age-appropriate, factually accurate, and educational.
      The fun fact should be mind-blowing and memorable.
      The explanation should help children understand the topic better.`;
      
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
          max_tokens: 500
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
        if (!quizData.explanation) {
          quizData.explanation = "Understanding this helps us make sense of the world around us!";
        }
      } catch (error) {
        console.error("Error parsing quiz JSON:", error);
        quizData = {
          question: "Which animal has the best sense of smell?",
          options: ["Elephant", "Dog", "Bear", "Shark"],
          correctAnswer: 1,
          explanation: "Dogs have a sense of smell that's up to 100,000 times stronger than humans because they have up to 300 million olfactory receptors in their noses, compared to about 6 million in humans.",
          funFact: "Did you know? A dog's sense of smell is so powerful that they can detect certain diseases in humans, including some types of cancer and diabetes!"
        };
      }
      
      return new Response(JSON.stringify(quizData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (requestType === 'miniChallenge') {
      const systemMessage = `You are an educational content creator for children aged ${ageRange}. Create an engaging mini-challenge related to the topic that will make learning active rather than passive. The challenge should be one of these types:
      1. Role-playing: Put the child in a historical/scientific/mathematical scenario
      2. Decision-making: Ask them to make a choice and explain why
      3. Predictive: Ask them what they think might happen
      4. Thought experiment: Pose a "what if" scenario
      
      Format as a JSON object with "question" and "type" fields:
      {
        "question": "The engaging challenge text here",
        "type": "role-playing" (or one of the other types)
      }`;
      
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
            { role: 'user', content: `Create a mini-challenge about: ${prompt}` }
          ],
          temperature: 0.8,
          max_tokens: 300
        }),
      });
      
      const data = await response.json();
      let challengeData;
      
      try {
        challengeData = JSON.parse(data.choices[0].message.content);
      } catch (error) {
        console.error("Error parsing challenge JSON:", error);
        challengeData = {
          question: "Imagine you're a scientist studying this topic. What experiment would you design to learn more about it?",
          type: "role-playing"
        };
      }
      
      return new Response(JSON.stringify(challengeData), {
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
