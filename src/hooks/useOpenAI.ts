import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  
  const generateResponse = async (prompt: string, ageRange: string = "8-12", language: string = "en") => {
    setIsLoading(true);
    
    try {
      console.log(`Generating response for prompt: "${prompt.substring(0, 50)}..." in ${language} language`);
      
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { prompt, ageRange, requestType: 'text', language }
      });
      
      if (error) {
        console.error("Error from Supabase function:", error);
        throw new Error(error.message || "Failed to generate response");
      }
      
      if (!data || !data.content) {
        console.error("Invalid response data structure:", data);
        throw new Error("Invalid response data");
      }
      
      return data.content;
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Oops! Something went wrong. Falling back to sample responses.");
      return generateMockResponse(prompt, language);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Analyze an image using OpenAI's vision capabilities
  const analyzeImage = async (imageBase64: string, ageRange: string = "8-12", language: string = "en") => {
    setIsLoading(true);
    
    try {
      console.log("Analyzing image with OpenAI...");
      
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { imageBase64, ageRange, requestType: 'image-analysis', language }
      });
      
      if (error) {
        console.error("Error from Supabase function:", error);
        throw new Error(error.message || "Failed to analyze image");
      }
      
      if (!data || !data.content) {
        console.error("Invalid response data structure:", data);
        throw new Error("Invalid image analysis data");
      }
      
      return data.content;
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Oops! Couldn't analyze this image. Please try again or take a clearer picture.");
      return "I couldn't analyze this image. Please try again or take a clearer picture of your homework problem.";
    } finally {
      setIsLoading(false);
    }
  };
  
  // Convert text to speech using OpenAI's TTS capabilities
  const textToSpeech = async (text: string) => {
    setIsLoading(true);
    
    try {
      console.log("Converting text to speech...");
      
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { prompt: text, requestType: 'text-to-speech' }
      });
      
      if (error) {
        console.error("Error from Supabase function:", error);
        throw new Error(error.message || "Failed to convert text to speech");
      }
      
      if (!data || !data.audioContent) {
        console.error("Invalid TTS response data structure:", data);
        throw new Error("Invalid TTS data");
      }
      
      return {
        audioContent: data.audioContent,
        contentType: data.contentType || 'audio/mpeg'
      };
    } catch (error) {
      console.error("Error converting text to speech:", error);
      toast.error("Could not generate speech. Please try again later.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback mock responses when API requests fail
  const generateMockResponse = (prompt: string, language: string = "en") => {
    // Simulate API call with timeout
    return new Promise<string>(resolve => {
      setTimeout(() => {
        // English responses
        if (language === "en") {
          // Mock response based on the prompt
          let response = "";
          if (prompt.toLowerCase().includes("dinosaur")) {
            response = `Dinosaurs were amazing creatures that lived millions of years ago! They came in all shapes and sizes, from the tiny Compsognathus that was about the size of a chicken, to the enormous Argentinosaurus that could grow up to 30 meters long - that's as long as 3 school buses! They roamed the Earth for about 165 million years, which is much longer than humans have been around.\n\nScientists learn about dinosaurs by studying fossils, which are the preserved remains or traces of ancient animals and plants. When paleontologists (scientists who study fossils) find dinosaur bones, they carefully dig them up and put them together like a puzzle. This helps them figure out what the dinosaurs looked like, what they ate, and how they lived. Some dinosaurs were plant-eaters with long necks to reach tall trees, while others were meat-eaters with sharp teeth and claws!`;
          } else if (prompt.toLowerCase().includes("planet") || prompt.toLowerCase().includes("space")) {
            response = `Our solar system is an incredible place filled with planets, moons, asteroids, and comets! The Sun sits at the center, and eight planets orbit around it. From closest to farthest from the Sun, they are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique - Earth is the only one we know has life, Jupiter has a giant storm called the Great Red Spot, and Saturn has beautiful rings made of ice and rock particles!\n\nSpace is mostly empty, but it's also filled with amazing objects. Stars are giant balls of gas that produce their own light and heat through a process called nuclear fusion. Galaxies are enormous collections of stars, gas, and dust held together by gravity. Our galaxy is called the Milky Way, and it contains billions of stars, including our Sun. Scientists are constantly making new discoveries about space using powerful telescopes and spacecraft!`;
          } else if (prompt.toLowerCase().includes("robot") || prompt.toLowerCase().includes("ai")) {
            response = `Robots and artificial intelligence (AI) are amazing technologies that help us solve problems and make our lives easier! Robots are machines that can be programmed to perform tasks automatically. Some robots build cars in factories, others explore dangerous places like volcanoes or the deep ocean, and some even help doctors perform surgery with super-precise movements.\n\nArtificial intelligence is the technology that allows computers to learn from experience and make decisions, kind of like humans do. AI helps your favorite video games create challenges that adapt to how you play, powers the voice assistants that answer your questions, and helps scientists analyze huge amounts of data to make new discoveries. As technology continues to advance, robots and AI will become even more helpful and do things we can barely imagine today!`;
          } else if (prompt.toLowerCase().includes("butter chicken")) {
            response = `Butter Chicken is a delicious Indian dish that's loved all around the world! It features tender pieces of chicken in a creamy tomato sauce that's flavored with aromatic spices. The dish was created in Delhi, India, in the 1950s by a chef who mixed leftover tandoori chicken with a buttery tomato gravy.\n\nThe secret to great Butter Chicken is in the blend of spices - it usually includes garam masala, turmeric, cumin, and coriander. These spices give the dish its distinctive flavor without making it too spicy. The creamy sauce gets its richness from butter (of course!), cream, and tomatoes, which are all simmered together until smooth and velvety. It's traditionally served with fluffy naan bread or steamed rice, which are perfect for soaking up all that delicious sauce!`;
          } else {
            response = `That's a great question! Curiosity is the first step to learning amazing things about our world. When we ask questions and explore new ideas, we're exercising our brains just like athletes exercise their muscles. Scientists, inventors, and explorers throughout history have made incredible discoveries because they were curious and wanted to understand how things work.\n\nLearning is an adventure that never ends! Every day, people around the world are making new discoveries and creating new inventions. Some questions have answers we already know, while others are mysteries waiting to be solved. The more you learn, the more connections your brain makes between different subjects, which helps you come up with creative ideas and solve problems in new ways. What other fascinating topics would you like to explore today?`;
          }
          resolve(response);
        } else {
          // For non-English languages, return a generic response that acknowledges the language
          resolve(`I'm responding in your selected language (${language}). Let's explore fascinating topics together! What would you like to learn about today?`);
        }
      }, 1500);
    });
  };
  
  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        console.log(`Generating image (attempt ${retryCount + 1}) with prompt:`, prompt.substring(0, 50) + "...");
        
        // First, try to get the image from the Edge Function
        const { data, error } = await supabase.functions.invoke('generate-response', {
          body: { prompt, requestType: 'image' }
        });
        
        if (error) {
          console.error("Supabase function error:", error);
          throw new Error(error.message || "Failed to generate image");
        }
        
        if (!data) {
          console.error("Empty response from image generation");
          throw new Error("Empty response from image generation");
        }
        
        if (data.error) {
          console.error("Error in image generation response:", data.error);
          throw new Error(data.error);
        }
        
        if (!data.imageUrl) {
          console.error("No image URL returned:", data);
          throw new Error("No image URL returned");
        }
        
        // Validate the URL by trying to fetch it
        try {
          const response = await fetch(data.imageUrl, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`Image URL returned error: ${response.status}`);
          }
        } catch (fetchError) {
          console.error("Error validating image URL:", fetchError);
          throw new Error("Invalid image URL");
        }
        
        console.log("Image URL validated and received:", data.imageUrl);
        return data.imageUrl;
      } catch (error) {
        console.error(`Error generating image (attempt ${retryCount + 1}):`, error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying image generation, attempt ${retryCount + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
        } else {
          // After max retries, fall back to placeholder
          console.log("Max retries reached, using fallback image");
          return generateMockImageUrl(prompt);
        }
      } finally {
        if (retryCount === maxRetries) {
          setIsLoading(false);
        }
      }
    }
    
    // Default fallback (should not reach here due to the return in the loop)
    setIsLoading(false);
    return generateMockImageUrl(prompt);
  };
  
  // Fallback mock image URLs when API requests fail
  const generateMockImageUrl = (prompt: string) => {
    console.log("Generating mock image URL for prompt:", prompt.substring(0, 50) + "...");
    
    // Return different image URLs based on the prompt
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("dinosaur")) {
      return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79?w=800&q=80";
    } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space") || lowerPrompt.includes("solar")) {
      return "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80";
    } else if (lowerPrompt.includes("robot")) {
      return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
    } else if (lowerPrompt.includes("animal")) {
      return "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80";
    } else if (lowerPrompt.includes("ocean")) {
      return "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=800&q=80";
    } else if (lowerPrompt.includes("butter chicken") || lowerPrompt.includes("food") || lowerPrompt.includes("dish")) {
      return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80";
    } else {
      // Default image
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
    }
  };
  
  const generateQuiz = async (topic: string, language: string = "en") => {
    setIsLoading(true);
    
    try {
      console.log(`Generating quiz for topic: "${topic.substring(0, 50)}..." in ${language} language`);
      
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { prompt: topic, requestType: 'quiz', language }
      });
      
      if (error) {
        console.error("Error from quiz generation:", error);
        throw new Error(error.message || "Failed to generate quiz");
      }
      
      // Validate quiz data structure
      if (!data || !data.question || !Array.isArray(data.options) || 
          typeof data.correctAnswer !== 'number' || data.options.length < 2) {
        console.error("Invalid quiz data received:", data);
        throw new Error("Invalid quiz data");
      }
      
      console.log("Quiz generated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Oops! Couldn't create a quiz right now. Using a sample quiz instead.");
      return generateMockQuiz(topic, language);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback mock quiz when API requests fail
  const generateMockQuiz = (topic: string, language: string = "en") => {
    console.log("Generating mock quiz for:", topic);
    
    // For English quizzes
    if (language === "en") {
      // Mock quiz based on topic
      const lowerTopic = topic.toLowerCase();
      
      if (lowerTopic.includes("dinosaur")) {
        return {
          question: "Which dinosaur was the largest meat-eater?",
          options: ["Tyrannosaurus Rex", "Velociraptor", "Spinosaurus", "Allosaurus"],
          correctAnswer: 2,
          funFact: "Spinosaurus was even larger than T-Rex and could swim!"
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
      const lowerTopic = topic.toLowerCase();
      
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
  };
  
  return { 
    isLoading, 
    generateResponse, 
    generateImage, 
    generateQuiz, 
    analyzeImage,
    textToSpeech
  };
}
