
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
      // Enhanced system message that guides the AI to respond with more depth and structure
      const systemMessage = `You are WonderWhiz, an educational AI assistant designed for children aged ${ageRange}. 

CONTENT STRUCTURE GUIDELINES:
- Each section must be approximately 500 words for depth
- Follow this structure for each section:
  1. Hook & Curiosity (50 words): Start with a question, challenge, or fun fact to spark interest
  2. Core Explanation (300-350 words): Break down the topic into 3-4 engaging sub-sections
  3. Mind-Blowing Fact (50 words): Introduce a surprising fact that keeps curiosity alive
  4. Mini Challenge (50 words): Ask a thought-provoking question or problem to keep kids engaged

YOUR TONE SHOULD BE:
- Engaging, friendly, encouraging, and conversational
- Using relatable metaphors and stories to explain complex concepts
- Age-appropriate in language and content (for ${ageRange} year olds)
- Using varied storytelling techniques to maintain interest
- Include selective use of emojis to enhance engagement (not overdo it)

EDUCATIONAL PRINCIPLES:
- Educational and factually accurate
- Structured with clear paragraph breaks for readability
- Include mind-blowing facts that will fascinate children
- Use role-playing scenarios and decision-making questions to make learning interactive
- Create smooth transitions between topics that summarize key points while teasing the next section

REMEMBER:
- Make learning feel like an adventure, not a lecture
- Use storytelling to explain complex concepts
- Maintain a curious and wonder-filled tone throughout
- Ask the child reflective questions to encourage critical thinking`;
      
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
    
    else if (requestType === 'image') {
      // Enhanced image prompt for more engaging visuals
      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a highly engaging, educational illustration of: ${prompt}. The image should be colorful, detailed, and visually stimulating for children aged ${ageRange}. Make it look like a professional educational illustration from a high-quality children's book or interactive app, with a Pixar-inspired art style. Include interesting details that would spark curiosity and conversation. The image should look magical and wonder-inducing.`,
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
      // Enhanced quiz generation with more engaging questions and fun facts
      const systemMessage = `You are an educational quiz generator for children aged ${ageRange}. Create an engaging multiple-choice question about the topic provided that is educational, thought-provoking, and appropriate for children of this age group. 

Make the question feel like a mini-adventure or challenge, not just a test of facts. Include interesting context and frame the question in a way that makes the child feel like they're solving a mystery or making a discovery.

The response must be in the following JSON format exactly, with no additional text:
{
  "question": "The question text here - make it engaging and curiosity-driven",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "explanation": "A brief, child-friendly explanation of why this answer is correct",
  "funFact": "A truly mind-blowing, fascinating fact related to the correct answer that would amaze and delight a child."
}
      
Where "correctAnswer" is the index (0-3) of the correct option in the "options" array.
Make sure the question is age-appropriate, factually accurate, and educational.
The fun fact should be truly surprising and memorable, something that makes kids say "Wow!"`;
      
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
            { role: 'user', content: `Create an engaging quiz question about: ${prompt}` }
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
          quizData.explanation = "Great job! You selected the correct answer!";
        }
      } catch (error) {
        console.error("Error parsing quiz JSON:", error);
        quizData = {
          question: "Which animal has the best sense of smell?",
          options: ["Elephant", "Dog", "Bear", "Shark"],
          correctAnswer: 1,
          explanation: "Dogs have incredible noses with up to 300 million scent receptors, compared to our 6 million!",
          funFact: "Did you know? A dog's sense of smell is up to 100,000 times stronger than humans! They can even smell some diseases in humans before doctors can detect them with tests!"
        };
      }
      
      return new Response(JSON.stringify(quizData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (requestType === 'toc') {
      // Enhanced Table of Contents generation with more engaging descriptions
      const systemMessage = `You are creating an engaging Table of Contents for a child aged ${ageRange} about a specific topic. 

Create a Table of Contents with 4-5 sections that would make an exciting learning journey through this topic. Each section should:
1. Have a catchy, question-based or curiosity-driven title
2. Include a 1-2 line description that teases what they'll learn
3. Feel like a step in an adventure, not just a dry topic list

Format your response as clean JSON with no additional text:
{
  "title": "The overall topic title, made exciting and age-appropriate",
  "sections": [
    {
      "sectionTitle": "Section 1: Exciting Title With A Question?",
      "description": "A brief teaser description that makes kids curious to learn more",
      "emoji": "✨" 
    },
    {
      "sectionTitle": "Section 2: Another Engaging Title",
      "description": "Another teaser that builds on the first section",
      "emoji": "🔍"
    }
  ]
}

Choose appropriate emojis that match each section's theme. Make the sections flow logically to tell a complete story about the topic.`;
      
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
            { role: 'user', content: `Create an engaging table of contents about: ${prompt}` }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });
      
      const data = await response.json();
      let tocData;
      
      try {
        tocData = JSON.parse(data.choices[0].message.content);
      } catch (error) {
        console.error("Error parsing TOC JSON:", error);
        tocData = {
          title: prompt,
          sections: [
            {
              sectionTitle: "What Is This Topic All About?",
              description: "An introduction to this fascinating subject",
              emoji: "🔍"
            },
            {
              sectionTitle: "The Amazing History",
              description: "Discover how it all began and developed over time",
              emoji: "📜"
            },
            {
              sectionTitle: "How Does It Work?",
              description: "The science and secrets behind this topic",
              emoji: "⚙️"
            },
            {
              sectionTitle: "Why Is It Important?",
              description: "How this topic affects our world today",
              emoji: "🌍"
            },
            {
              sectionTitle: "The Future Possibilities",
              description: "What might happen next and what we can learn",
              emoji: "🚀"
            }
          ]
        };
      }
      
      return new Response(JSON.stringify(tocData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (requestType === 'relatedTopics') {
      // Generate engaging related topics
      const systemMessage = `You are creating a list of engaging related topics for a child aged ${ageRange} who has just learned about a specific subject. 

Create 5 fascinating related topics that would spark curiosity and encourage further exploration. Each topic should:
1. Be clearly related to the main topic they just learned about
2. Have an engaging, question-based title that sparks curiosity
3. Include a brief 1-line description of what they'll discover
4. Have a relevant emoji

Format your response as clean JSON with no additional text:
{
  "topics": [
    {
      "title": "Fascinating Related Topic As A Question?",
      "description": "A brief teaser that makes kids curious to learn more",
      "emoji": "🔍"
    },
    {
      "title": "Another Engaging Topic",
      "description": "Another interesting angle to explore",
      "emoji": "✨"
    }
  ]
}

Choose diverse topics that cover different aspects related to the main subject. Make each one uniquely appealing and intriguing.`;
      
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
            { role: 'user', content: `Create engaging related topics for: ${prompt}` }
          ],
          temperature: 0.8,
          max_tokens: 500
        }),
      });
      
      const data = await response.json();
      let relatedTopicsData;
      
      try {
        relatedTopicsData = JSON.parse(data.choices[0].message.content);
      } catch (error) {
        console.error("Error parsing related topics JSON:", error);
        relatedTopicsData = {
          topics: [
            {
              title: "Related Topic 1",
              description: "Learn more about this fascinating subject",
              emoji: "🔍"
            },
            {
              title: "Related Topic 2",
              description: "Explore another amazing aspect",
              emoji: "✨"
            },
            {
              title: "Related Topic 3",
              description: "Discover surprising connections",
              emoji: "🌟"
            },
            {
              title: "Related Topic 4",
              description: "Uncover hidden secrets",
              emoji: "🔑"
            },
            {
              title: "Related Topic 5",
              description: "Journey into related wonders",
              emoji: "🚀"
            }
          ]
        };
      }
      
      return new Response(JSON.stringify(relatedTopicsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (requestType === 'certificate') {
      // Generate completion certificate text
      const systemMessage = `You are creating a fun, encouraging completion certificate message for a child aged ${ageRange} who has just learned about a specific topic. 

Create a short, motivating message that:
1. Congratulates them on completing the topic
2. Mentions 1-2 specific skills or knowledge they've gained
3. Encourages them to continue learning
4. Has a playful, celebratory tone

Format your response as clean text (not JSON) with no additional formatting.`;
      
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
            { role: 'user', content: `Create a completion certificate message for learning about: ${prompt}` }
          ],
          temperature: 0.7,
          max_tokens: 200
        }),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
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
