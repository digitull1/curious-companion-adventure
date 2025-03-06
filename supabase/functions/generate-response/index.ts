
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');
const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY');

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
    const { prompt, ageRange, requestType, language = 'en' } = await req.json();
    
    if (!groqApiKey && requestType !== 'image') {
      console.error('GROQ_API_KEY is not set in environment variables');
      throw new Error('GROQ_API_KEY is not set in environment variables');
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
      - Occasionally use storytelling to explain complex concepts
      - IMPORTANT: Stay 100% on topic and directly address the specific question or topic`;
      
      // Add language-specific instructions
      if (language !== 'en') {
        systemMessage += `\n\nIMPORTANT: Respond in ${language} language only. All your content must be in ${language}.`;
      }
      
      try {
        // Use Groq API instead of OpenAI
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',  // Using Llama3 model
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 600
          }),
        });
        
        const data = await response.json();
        
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
        
        return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (textError) {
        console.error("Text generation error:", textError);
        // Return a fallback response instead of an error
        const fallbackResponse = generateFallbackTextResponse(prompt, language);
        return new Response(JSON.stringify({ content: fallbackResponse }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } 
    
    else if (requestType === 'image') {
      try {
        console.log("Starting image generation with prompt:", prompt);
        
        // Check if we have the Hugging Face API Key
        if (!huggingFaceApiKey) {
          console.warn("No HUGGINGFACE_API_KEY found, using fallback image");
          const fallbackImageUrl = getFallbackImageUrlByTopic(prompt);
          return new Response(JSON.stringify({ imageUrl: fallbackImageUrl }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Process and enhance the prompt for better image generation results
        const enhancedPrompt = enhanceImagePrompt(prompt, ageRange);
        console.log("Enhanced image prompt:", enhancedPrompt);
        
        try {
          console.log("Calling Hugging Face API with key length:", huggingFaceApiKey ? huggingFaceApiKey.length : 0);
          
          // Using Huggingface's Flux-1 model for image generation
          response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${huggingFaceApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: enhancedPrompt,
              options: {
                wait_for_model: true
              }
            }),
          });
          
          console.log("Hugging Face API response status:", response.status);
          console.log("Response headers:", Object.fromEntries(response.headers.entries()));
          
          // Check if response is ok
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Hugging Face API error response:", errorText);
            throw new Error(`Hugging Face API error: ${errorText}`);
          }
          
          // Handle binary response (image data)
          const imageBlob = await response.blob();
          console.log("Received image blob:", {
            size: imageBlob.size,
            type: imageBlob.type
          });
          
          // Convert blob to base64
          const imageBase64 = await blobToBase64(imageBlob);
          console.log("Base64 conversion successful, length:", 
            typeof imageBase64 === 'string' ? imageBase64.length : 0);
          
          console.log("Successfully processed image data");
          
          return new Response(JSON.stringify({ 
            imageUrl: imageBase64,
            debug: {
              blobSize: imageBlob.size,
              blobType: imageBlob.type,
              base64Length: typeof imageBase64 === 'string' ? imageBase64.length : 0
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
          
        } catch (hfError) {
          console.error("Detailed error with Hugging Face API:", {
            error: hfError,
            message: hfError.message,
            stack: hfError.stack
          });
          
          // Try an alternative model if the first one fails
          try {
            console.log("Trying alternative Hugging Face model");
            
            response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${huggingFaceApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                inputs: enhancedPrompt 
              }),
            });
            
            if (!response.ok) {
              throw new Error(`Alternative model failed with status: ${response.status}`);
            }
            
            const imageBlob = await response.blob();
            const imageBase64 = await blobToBase64(imageBlob);
            
            return new Response(JSON.stringify({ 
              imageUrl: imageBase64,
              debug: {
                blobSize: imageBlob.size,
                blobType: imageBlob.type,
                base64Length: typeof imageBase64 === 'string' ? imageBase64.length : 0,
                alternativeModel: true
              }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } catch (altError) {
            console.error("Alternative model also failed:", altError);
            
            // Fall back to placeholder images if all attempts fail
            const fallbackImageUrl = getFallbackImageUrlByTopic(prompt);
            return new Response(JSON.stringify({ 
              imageUrl: fallbackImageUrl,
              error: "All image generation attempts failed",
              fallback: true
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (imageError) {
        console.error("Top-level image generation error:", {
          error: imageError,
          message: imageError.message,
          stack: imageError.stack
        });
        
        // Return a more graceful error with fallback image
        const fallbackImageUrl = getFallbackImageUrlByTopic(prompt);
        return new Response(
          JSON.stringify({ 
            imageUrl: fallbackImageUrl,
            error: imageError.message,
            fallback: true
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } 
    
    else if (requestType === 'quiz') {
      let systemMessage = `You are an educational quiz generator for children aged ${ageRange}. Create a single multiple-choice question about the specific topic provided that is educational, engaging, and appropriate for children of this age group. 

      The response must be in the following JSON format exactly, with no additional text:
      {
        "question": "The question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0,
        "funFact": "A brief, fascinating fact related to the correct answer that would amaze a child."
      }
      
      Where "correctAnswer" is the index (0-3) of the correct option in the "options" array.
      Make sure the question is age-appropriate, factually accurate, and educational.
      The fun fact should be mind-blowing and memorable.
      IMPORTANT: The question MUST be directly related to the topic provided and not generic.`;
      
      // Add language-specific instructions
      if (language !== 'en') {
        systemMessage += `\n\nIMPORTANT: Generate the quiz in ${language} language only. All content including question, options, and fun fact must be in ${language}.`;
      }
      
      try {
        // Use Groq for quiz generation
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: `Create a quiz question about: ${prompt}` }
            ],
            temperature: 0.7,
            max_tokens: 400
          }),
        });
        
        const data = await response.json();
        
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error("Invalid response structure from Groq quiz generation:", JSON.stringify(data));
          throw new Error("Invalid response from quiz generation");
        }
        
        let quizData;
        
        try {
          quizData = JSON.parse(data.choices[0].message.content);
          
          // Ensure all required fields are present
          if (!quizData.question || !quizData.options || !Array.isArray(quizData.options) || 
              typeof quizData.correctAnswer !== 'number' || quizData.options.length < 2) {
            console.error("Invalid quiz data structure:", JSON.stringify(quizData));
            throw new Error("Invalid quiz data structure");
          }
          
          if (!quizData.funFact) {
            quizData.funFact = "Did you know? Learning is like exercise for your brain - it makes your brain stronger!";
          }
          
          console.log("Successfully generated quiz:", JSON.stringify(quizData).substring(0, 100) + "...");
        } catch (parseError) {
          console.error("Error parsing quiz JSON:", parseError, "Raw content:", data.choices[0].message.content);
          quizData = generateFallbackQuiz(prompt, language);
        }
        
        return new Response(JSON.stringify(quizData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (quizError) {
        console.error("Quiz generation error:", quizError);
        
        // Return a fallback quiz
        const fallbackQuiz = generateFallbackQuiz(prompt, language);
        return new Response(
          JSON.stringify(fallbackQuiz),
          { 
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

// Helper function to convert Blob to Base64
const blobToBase64 = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return `data:${blob.type};base64,${base64}`;
};

// Helper function to enhance image prompts for better results
const enhanceImagePrompt = (prompt: string, ageRange: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Base enhancement with child-friendly and educational aspects
  let enhancedPrompt = `Create a child-friendly, educational illustration of: ${prompt}. The image should be colorful, engaging, suitable for children aged ${ageRange}, with a playful art style.`;
  
  // Add topic-specific enhancements
  if (lowerPrompt.includes("dinosaur") && (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater"))) {
    enhancedPrompt = `Create a scientifically accurate, child-friendly illustration of carnivorous dinosaurs. The image should show dinosaur predators with their hunting adaptations like sharp teeth and claws. Colorful, detailed, educational style suitable for ${ageRange} year olds.`;
  } else if (lowerPrompt.includes("dinosaur")) {
    enhancedPrompt = `Create a scientifically accurate, child-friendly illustration of dinosaurs. Detailed, colorful, educational style suitable for ${ageRange} year olds.`;
  } else if (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater")) {
    enhancedPrompt = `Create an educational illustration of carnivorous animals showing their predatory adaptations. The image should be colorful, engaging, suitable for children aged ${ageRange}, with a playful art style.`;
  }
  
  return enhancedPrompt;
};

// Helper function to generate fallback text responses
function generateFallbackTextResponse(prompt: string, language: string = "en") {
  // English responses
  if (language === "en") {
    // Mock response based on the prompt
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("dinosaur") && (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater"))) {
      return `Carnivorous dinosaurs were fascinating predators that roamed the Earth millions of years ago! These meat-eating dinosaurs had special adaptations to help them hunt, like sharp teeth for tearing flesh, powerful jaws for crushing bones, and some even had sharp claws for grabbing prey. The most famous carnivorous dinosaur is probably Tyrannosaurus Rex (T-Rex), which had teeth as big as bananas and a bite force strong enough to crush a car!\n\nNot all carnivorous dinosaurs were giants like T-Rex though. Some were small and quick, like Velociraptor, which was about the size of a turkey but could run very fast and hunt in packs. Others, like Spinosaurus, were even bigger than T-Rex and could swim to catch fish! Carnivorous dinosaurs were at the top of the food chain in their ecosystems, helping to keep the population of plant-eating dinosaurs in check, just like lions and tigers do with plant-eaters today.`;
    } else if (lowerPrompt.includes("dinosaur")) {
      return `Dinosaurs were amazing creatures that lived millions of years ago! They came in all shapes and sizes, from the tiny Compsognathus that was about the size of a chicken, to the enormous Argentinosaurus that could grow up to 30 meters long - that's as long as 3 school buses! They roamed the Earth for about 165 million years, which is much longer than humans have been around.\n\nScientists learn about dinosaurs by studying fossils, which are the preserved remains or traces of ancient animals and plants. When paleontologists (scientists who study fossils) find dinosaur bones, they carefully dig them up and put them together like a puzzle. This helps them figure out what the dinosaurs looked like, what they ate, and how they lived. Some dinosaurs were plant-eaters with long necks to reach tall trees, while others were meat-eaters with sharp teeth and claws!`;
    } else if (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater")) {
      return `Carnivores are animals that eat mainly or only meat. These amazing creatures have special body features that help them hunt and eat other animals. For example, lions have sharp teeth for tearing meat, strong jaws for crushing bones, and powerful legs for chasing down prey. Other carnivores like wolves hunt in packs to take down animals that are bigger than they are!\n\nCarnivores play a very important role in nature. They help keep the populations of other animals healthy by hunting the weak or sick ones. This is called being at the top of the food chain or being an apex predator. Some carnivores you might know are tigers, eagles, sharks, and even your pet cat! Not all carnivores are big - some, like spiders and frogs, are quite small but are still fierce hunters in their own way.`;
    } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space")) {
      return `Our solar system is an incredible place filled with planets, moons, asteroids, and comets! The Sun sits at the center, and eight planets orbit around it. From closest to farthest from the Sun, they are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique - Earth is the only one we know has life, Jupiter has a giant storm called the Great Red Spot, and Saturn has beautiful rings made of ice and rock particles!\n\nSpace is mostly empty, but it's also filled with amazing objects. Stars are giant balls of gas that produce their own light and heat through a process called nuclear fusion. Galaxies are enormous collections of stars, gas, and dust held together by gravity. Our galaxy is called the Milky Way, and it contains billions of stars, including our Sun. Scientists are constantly making new discoveries about space using powerful telescopes and spacecraft!`;
    } else {
      return `That's a great question! Curiosity is the first step to learning amazing things about our world. When we ask questions and explore new ideas, we're exercising our brains just like athletes exercise their muscles. Scientists, inventors, and explorers throughout history have made incredible discoveries because they were curious and wanted to understand how things work.\n\nLearning is an adventure that never ends! Every day, people around the world are making new discoveries and creating new inventions. Some questions have answers we already know, while others are mysteries waiting to be solved. The more you learn, the more connections your brain makes between different subjects, which helps you come up with creative ideas and solve problems in new ways. What other fascinating topics would you like to explore today?`;
    }
  } else {
    // For non-English languages, return a generic response that acknowledges the language
    return `I'm responding in your selected language (${language}). Let's explore fascinating topics together! What would you like to learn about today?`;
  }
}

// Helper function to get fallback image URLs
function getFallbackImageUrlByTopic(prompt: string) {
  // Extract keywords from prompt to find relevant image
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("dinosaur") && (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater"))) {
    return "https://images.unsplash.com/photo-1525877442103-5ddb2089b2bb?w=800&q=80";
  } else if (lowerPrompt.includes("dinosaur")) {
    return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79?w=800&q=80";
  } else if (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater")) {
    return "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80";
  } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space") || lowerPrompt.includes("solar system")) {
    return "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80";
  } else if (lowerPrompt.includes("robot") || lowerPrompt.includes("technology")) {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
  } else if (lowerPrompt.includes("animal") || lowerPrompt.includes("wildlife")) {
    return "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80";
  } else if (lowerPrompt.includes("ocean") || lowerPrompt.includes("sea")) {
    return "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=800&q=80";
  } else if (lowerPrompt.includes("butter chicken") || lowerPrompt.includes("food") || lowerPrompt.includes("cooking")) {
    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80";
  } else if (lowerPrompt.includes("history") || lowerPrompt.includes("ancient")) {
    return "https://images.unsplash.com/photo-1564399263809-d2e8673cb2a4?w=800&q=80";
  } else if (lowerPrompt.includes("science") || lowerPrompt.includes("experiment")) {
    return "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80";
  } else if (lowerPrompt.includes("nature") || lowerPrompt.includes("landscape")) {
    return "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80";
  } else {
    // Default image for other topics
    return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
  }
}

// Helper function to generate fallback quizzes
function generateFallbackQuiz(topic: string, language: string = "en") {
  // For English quizzes
  if (language === "en") {
    // Mock quiz based on topic
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes("dinosaur") && (lowerTopic.includes("carnivore") || lowerTopic.includes("meat-eater"))) {
      return {
        question: "Which of these dinosaurs was a carnivore (meat-eater)?",
        options: ["Brachiosaurus", "Tyrannosaurus Rex", "Triceratops", "Stegosaurus"],
        correctAnswer: 1,
        funFact: "Tyrannosaurus Rex had teeth that were up to 12 inches (30 cm) long, as big as bananas!"
      };
    } else if (lowerTopic.includes("dinosaur")) {
      return {
        question: "Which dinosaur was the largest meat-eater?",
        options: ["Tyrannosaurus Rex", "Velociraptor", "Spinosaurus", "Allosaurus"],
        correctAnswer: 2,
        funFact: "Spinosaurus was even larger than T-Rex and could swim!"
      };
    } else if (lowerTopic.includes("carnivore") || lowerTopic.includes("meat-eater")) {
      return {
        question: "Which of these animals is NOT a carnivore (meat-eater)?",
        options: ["Lion", "Elephant", "Wolf", "Eagle"],
        correctAnswer: 1,
        funFact: "Elephants are herbivores and can eat up to 300 pounds (136 kg) of plants in a single day!"
      };
    } else if (lowerTopic.includes("planet") || lowerTopic.includes("space") || lowerTopic.includes("solar")) {
      return {
        question: "Which planet has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correctAnswer: 1,
        funFact: "Saturn has over 80 moons, with more still being discovered!"
      };
    } else if (lowerTopic.includes("robot") || lowerTopic.includes("ai")) {
      return {
        question: "Which of these is NOT a real robot?",
        options: ["Sophia", "Atlas", "R2-D2", "Spot"],
        correctAnswer: 2,
        funFact: "Boston Dynamics' robot dog 'Spot' can open doors and climb stairs!"
      };
    } else if (lowerTopic.includes("butter chicken") || lowerTopic.includes("food")) {
      return {
        question: "Which country did Butter Chicken originate from?",
        options: ["Thailand", "India", "China", "Mexico"],
        correctAnswer: 1,
        funFact: "Butter Chicken was invented in the 1950s at a restaurant in Delhi, India!"
      };
    } else {
      return {
        question: "Which animal has the best sense of smell?",
        options: ["Elephant", "Dog", "Bear", "Shark"],
        correctAnswer: 1,
        funFact: "Dogs can smell about 10,000 to 100,000 times better than humans!"
      };
    }
  } else {
    // Non-English quiz (Hindi and others)
    if (language === "hi") {
      return {
        question: "भारत की राष्ट्रीय पक्षी कौन सी है?",
        options: ["कबूतर", "मोर", "बाज़", "तोता"],
        correctAnswer: 1,
        funFact: "मोर की आवाज इतनी तेज होती है कि इसे 1 किलोमीटर दूर से भी सुना जा सकता है!"
      };
    }
    
    // Generic fallback for other languages
    return {
      question: "Which is the correct answer?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      funFact: "Learning in multiple languages enhances brain development!"
    };
  }
}
