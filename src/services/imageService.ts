
import { toast } from "sonner";

// Queue for managing image generation requests
interface ImageRequest {
  prompt: string;
  onSuccess: (url: string) => void;
  onError: (error: Error) => void;
}

// Simple in-memory cache for generated images
const imageCache: Map<string, string> = new Map();
const requestQueue: ImageRequest[] = [];
let isProcessingQueue = false;

// Process the queue one at a time
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  const request = requestQueue.shift();
  
  if (!request) {
    isProcessingQueue = false;
    return;
  }
  
  try {
    // Check cache first
    const cachedUrl = imageCache.get(request.prompt);
    if (cachedUrl) {
      console.log("[ImageService] Using cached image for prompt:", request.prompt.substring(0, 30) + "...");
      request.onSuccess(cachedUrl);
    } else {
      console.log("[ImageService] Generating new image for prompt:", request.prompt.substring(0, 30) + "...");
      // Actual image generation would happen here, using the implementation from useOpenAI
      const imageUrl = await generateImageMock(request.prompt);
      
      // Cache the result
      imageCache.set(request.prompt, imageUrl);
      request.onSuccess(imageUrl);
    }
  } catch (error) {
    console.error("[ImageService] Error generating image:", error);
    request.onError(error instanceof Error ? error : new Error(String(error)));
  } finally {
    isProcessingQueue = false;
    // Process next in queue
    setTimeout(processQueue, 50);
  }
};

// Mock image generation that mimics the implementation in useOpenAI
const generateImageMock = async (prompt: string): Promise<string> => {
  // This would be replaced with actual implementation
  console.log("[ImageService] Mock generating image for:", prompt.substring(0, 30) + "...");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return different image URLs based on the prompt (same as in useOpenAI)
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("dinosaur") && (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater"))) {
    return "https://images.unsplash.com/photo-1525877442103-5ddb2089b2bb?w=800&q=80";
  } else if (lowerPrompt.includes("dinosaur")) {
    return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79?w=800&q=80";
  } else if (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater")) {
    return "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80";
  } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space") || lowerPrompt.includes("solar")) {
    return "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80";
  } else if (lowerPrompt.includes("robot")) {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
  } else if (lowerPrompt.includes("animal")) {
    return "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80";
  } else if (lowerPrompt.includes("ocean")) {
    return "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=800&q=80";
  } else if (lowerPrompt.includes("history") || lowerPrompt.includes("ancient")) {
    return "https://images.unsplash.com/photo-1564399263809-d2e8673cb2a4?w=800&q=80";
  } else {
    // Default image
    return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
  }
};

// Public API for the image service
export const generateImage = async (prompt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check cache first for immediate response
    const cachedUrl = imageCache.get(prompt);
    if (cachedUrl) {
      console.log("[ImageService] Immediate cache hit for:", prompt.substring(0, 30) + "...");
      resolve(cachedUrl);
      return;
    }
    
    // Add to queue
    requestQueue.push({
      prompt,
      onSuccess: resolve,
      onError: reject
    });
    
    // Start processing queue if not already running
    processQueue();
  });
};

// Clear cache (useful for testing or when language/age range changes)
export const clearImageCache = () => {
  console.log("[ImageService] Clearing image cache");
  imageCache.clear();
};

export default {
  generateImage,
  clearImageCache
};
