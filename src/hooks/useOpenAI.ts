
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  
  const generateResponse = async (prompt: string, ageRange: string = "8-12") => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { prompt, ageRange, requestType: 'text' }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate response");
      }
      
      return data.content;
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Oops! Something went wrong. Falling back to sample responses.");
      return generateMockResponse(prompt);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback mock responses when API requests fail
  const generateMockResponse = (prompt: string) => {
    // Simulate API call with timeout
    return new Promise<string>(resolve => {
      setTimeout(() => {
        // Mock response based on the prompt
        let response = "";
        if (prompt.toLowerCase().includes("dinosaur")) {
          response = `Dinosaurs were amazing creatures that lived millions of years ago! They came in all shapes and sizes, from the tiny Compsognathus that was about the size of a chicken, to the enormous Argentinosaurus that could grow up to 30 meters long - that's as long as 3 school buses! They roamed the Earth for about 165 million years, which is much longer than humans have been around.\n\nScientists learn about dinosaurs by studying fossils, which are the preserved remains or traces of ancient animals and plants. When paleontologists (scientists who study fossils) find dinosaur bones, they carefully dig them up and put them together like a puzzle. This helps them figure out what the dinosaurs looked like, what they ate, and how they lived. Some dinosaurs were plant-eaters with long necks to reach tall trees, while others were meat-eaters with sharp teeth and claws!`;
        } else if (prompt.toLowerCase().includes("planet") || prompt.toLowerCase().includes("space")) {
          response = `Our solar system is an incredible place filled with planets, moons, asteroids, and comets! The Sun sits at the center, and eight planets orbit around it. From closest to farthest from the Sun, they are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique - Earth is the only one we know has life, Jupiter has a giant storm called the Great Red Spot, and Saturn has beautiful rings made of ice and rock particles!\n\nSpace is mostly empty, but it's also filled with amazing objects. Stars are giant balls of gas that produce their own light and heat through a process called nuclear fusion. Galaxies are enormous collections of stars, gas, and dust held together by gravity. Our galaxy is called the Milky Way, and it contains billions of stars, including our Sun. Scientists are constantly making new discoveries about space using powerful telescopes and spacecraft!`;
        } else if (prompt.toLowerCase().includes("robot") || prompt.toLowerCase().includes("ai")) {
          response = `Robots and artificial intelligence (AI) are amazing technologies that help us solve problems and make our lives easier! Robots are machines that can be programmed to perform tasks automatically. Some robots build cars in factories, others explore dangerous places like volcanoes or the deep ocean, and some even help doctors perform surgery with super-precise movements.\n\nArtificial intelligence is the technology that allows computers to learn from experience and make decisions, kind of like humans do. AI helps your favorite video games create challenges that adapt to how you play, powers the voice assistants that answer your questions, and helps scientists analyze huge amounts of data to make new discoveries. As technology continues to advance, robots and AI will become even more helpful and do things we can barely imagine today!`;
        } else {
          response = `That's a great question! Curiosity is the first step to learning amazing things about our world. When we ask questions and explore new ideas, we're exercising our brains just like athletes exercise their muscles. Scientists, inventors, and explorers throughout history have made incredible discoveries because they were curious and wanted to understand how things work.\n\nLearning is an adventure that never ends! Every day, people around the world are making new discoveries and creating new inventions. Some questions have answers we already know, while others are mysteries waiting to be solved. The more you learn, the more connections your brain makes between different subjects, which helps you come up with creative ideas and solve problems in new ways. What other fascinating topics would you like to explore today?`;
        }
        resolve(response);
      }, 1500);
    });
  };
  
  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { prompt, requestType: 'image' }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate image");
      }
      
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Oops! Couldn't create an image right now. Using a placeholder instead.");
      return generateMockImageUrl(prompt);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback mock image URLs when API requests fail
  const generateMockImageUrl = (prompt: string) => {
    // Return different image URLs based on the prompt
    if (prompt.toLowerCase().includes("dinosaur")) {
      return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79";
    } else if (prompt.toLowerCase().includes("planet") || prompt.toLowerCase().includes("space")) {
      return "https://images.unsplash.com/photo-1614732414444-096e5f1122d5";
    } else if (prompt.toLowerCase().includes("robot")) {
      return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
    } else {
      // Default image
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b";
    }
  };
  
  const generateQuiz = async (topic: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { prompt: topic, requestType: 'quiz' }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to generate quiz");
      }
      
      return data;
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Oops! Couldn't create a quiz right now. Using a sample quiz instead.");
      return generateMockQuiz(topic);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback mock quiz when API requests fail
  const generateMockQuiz = (topic: string) => {
    // Mock quiz based on topic
    if (topic.toLowerCase().includes("dinosaur")) {
      return {
        question: "Which dinosaur was the largest meat-eater?",
        options: ["Tyrannosaurus Rex", "Velociraptor", "Spinosaurus", "Allosaurus"],
        correctAnswer: 2
      };
    } else if (topic.toLowerCase().includes("planet") || topic.toLowerCase().includes("space")) {
      return {
        question: "Which planet has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correctAnswer: 1
      };
    } else if (topic.toLowerCase().includes("robot") || topic.toLowerCase().includes("ai")) {
      return {
        question: "Which of these is NOT a real robot?",
        options: ["Sophia", "Atlas", "R2-D2", "Spot"],
        correctAnswer: 2
      };
    } else {
      return {
        question: "Which animal has the best sense of smell?",
        options: ["Elephant", "Dog", "Bear", "Shark"],
        correctAnswer: 1
      };
    }
  };
  
  return { isLoading, generateResponse, generateImage, generateQuiz };
}
