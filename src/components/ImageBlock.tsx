import React, { useState, useEffect } from "react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Image as ImageIcon, ImageOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ImageBlockProps {
  prompt: string;
  containerClass?: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ prompt, containerClass = "" }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [promptTruncated, setPromptTruncated] = useState<string>("");
  const { generateImage } = useOpenAI();

  // Truncate prompt for display
  useEffect(() => {
    const truncated = prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt;
    setPromptTruncated(truncated);
  }, [prompt]);

  // Enhanced prompt function focused on topic relevance
  const enhancePrompt = (originalPrompt: string): string => {
    // Extract main topic from prompt
    const lowerPrompt = originalPrompt.toLowerCase();
    let enhancedPrompt = "";
    
    // Topic-specific prompts for better relevance
    if (lowerPrompt.includes("dinosaur")) {
      enhancedPrompt = `Educational illustration of a dinosaur: ${originalPrompt.substring(0, 200)}. Detailed, scientifically accurate, colorful, child-friendly, digital art style.`;
    } else if (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater")) {
      enhancedPrompt = `Educational illustration of a carnivorous animal: ${originalPrompt.substring(0, 200)}. Show predatory adaptations like teeth and claws, in natural habitat, colorful, detailed, child-friendly.`;
    } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space")) {
      enhancedPrompt = `Educational illustration of space/planetary science: ${originalPrompt.substring(0, 200)}. Detailed, colorful, scientifically accurate, child-friendly.`;
    } else if (lowerPrompt.includes("ancient") || lowerPrompt.includes("history")) {
      enhancedPrompt = `Educational illustration of historical scene: ${originalPrompt.substring(0, 200)}. Detailed, historically accurate, colorful, child-friendly.`;
    } else {
      // Default enhancement for other topics
      enhancedPrompt = `Educational illustration about: ${originalPrompt.substring(0, 200)}. Detailed, colorful, child-friendly, educational style.`;
    }
    
    console.log("Enhanced image prompt:", enhancedPrompt);
    return enhancedPrompt;
  };

  // Load image with improved error handling
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");
      
      try {
        console.log(`Generating image (attempt ${retryCount + 1}) with prompt:`, prompt);
        
        // Create an enhanced prompt for better image generation
        const enhancedPrompt = enhancePrompt(prompt);
        
        // Simplify prompt to reduce errors
        const simplifiedPrompt = enhancedPrompt.length > 300 
          ? enhancedPrompt.substring(0, 300) 
          : enhancedPrompt;
          
        const response = await generateImage(simplifiedPrompt);
        console.log("Image generation response:", {
          responseReceived: !!response,
          urlLength: response?.length || 0,
          urlStart: response?.substring(0, 50) + "..." || "",
          isBase64: response?.startsWith("data:image") || false,
          isHttps: response?.startsWith("https:") || false
        });
        
        if (!response || response.trim() === "") {
          console.error("Empty image URL received");
          throw new Error("Failed to generate image");
        }
        
        // Preload the image to check if it's valid
        await preloadImage(response);
        console.log("Image preloaded successfully");
        
        if (isMounted) {
          setImageUrl(response);
          setHasError(false);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        
        if (isMounted) {
          setHasError(true);
          setErrorMessage(error instanceof Error ? error.message : "Unknown error");
          
          // Use a topic-specific fallback image
          const fallbackUrl = getFallbackImageUrl(prompt);
          console.log("Using fallback image:", fallbackUrl);
          setImageUrl(fallbackUrl);
          
          // Show toast notification for error
          toast.error("Couldn't generate an image right now. Using a sample image instead.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [prompt, generateImage, retryCount]);
  
  // Helper function to preload image
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully:", url.substring(0, 30) + "...");
        resolve();
      };
      img.onerror = (e) => {
        console.error("Error loading image:", e);
        reject(new Error("Failed to load image"));
      };
      img.src = url;
      
      // Add timeout to prevent hanging on slow loads
      setTimeout(() => reject(new Error("Image load timeout")), 20000);
    });
  };
  
  // Improved topic-specific fallback image function
  const getFallbackImageUrl = (prompt: string) => {
    // Extract keywords from prompt to find relevant image
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("dinosaur") && lowerPrompt.includes("carnivore")) {
      return "https://images.unsplash.com/photo-1525877442103-5ddb2089b2bb?w=800&q=80"; // T-Rex
    } else if (lowerPrompt.includes("dinosaur")) {
      return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79?w=800&q=80"; // General dinosaur
    } else if (lowerPrompt.includes("carnivore") || lowerPrompt.includes("meat-eater")) {
      return "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80"; // Lion or predator
    } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space")) {
      return "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80"; // Space
    } else if (lowerPrompt.includes("animal") || lowerPrompt.includes("wildlife")) {
      return "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80"; // Wildlife
    } else if (lowerPrompt.includes("ocean") || lowerPrompt.includes("sea")) {
      return "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=800&q=80"; // Ocean
    } else if (lowerPrompt.includes("history") || lowerPrompt.includes("ancient")) {
      return "https://images.unsplash.com/photo-1564399263809-d2e8673cb2a4?w=800&q=80"; // History
    } else {
      // Default image
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
    }
  };

  const handleRetry = () => {
    console.log("Retrying image generation...");
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className={`mt-4 overflow-hidden rounded-lg ${containerClass}`}>
      {isLoading ? (
        <div className="h-60 w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full border-4 border-wonder-purple/30 border-t-wonder-purple animate-spin mb-4"></div>
          <div className="text-wonder-purple font-medium">Creating your image...</div>
          <div className="text-muted-foreground text-sm mt-1">This might take a moment</div>
        </div>
      ) : hasError ? (
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt={promptTruncated}
            className="w-full h-auto rounded-lg shadow-wonder"
            style={{ maxHeight: "400px", objectFit: "cover" }}
            onError={(e) => {
              // If fallback image also fails, show a colored placeholder
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = "none";
              target.parentElement?.classList.add("bg-gray-200", "h-60", "flex", "items-center", "justify-center");
              const errorDiv = document.createElement("div");
              errorDiv.className = "flex flex-col items-center justify-center p-4 text-center";
              errorDiv.innerHTML = `
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500">
                    <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"></path>
                    <path d="M14 2L22 10"></path>
                    <path d="M22 2L14 10"></path>
                  </svg>
                </div>
                <div class="text-foreground font-medium">Couldn't load image</div>
                <div class="text-muted-foreground text-sm mt-1">Using a placeholder instead</div>
              `;
              target.parentElement?.appendChild(errorDiv);
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ImageOff className="h-4 w-4 mr-2 text-red-300" />
                <span>Using placeholder image</span>
              </div>
              <button 
                onClick={handleRetry}
                className="bg-wonder-purple/20 hover:bg-wonder-purple/30 text-white rounded-full p-1 transition-colors"
                title="Try again"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt={promptTruncated}
            className="w-full h-auto rounded-lg shadow-wonder animate-fade-in"
            style={{ maxHeight: "400px", objectFit: "cover" }}
            onError={(e) => {
              // If the image fails to load, replace with a fallback
              const target = e.target as HTMLImageElement;
              console.log("Image failed to load, using fallback");
              if (!target.src.includes('unsplash')) {
                target.src = getFallbackImageUrl(prompt);
                setHasError(true);
                target.onerror = null; // Prevent infinite fallback loops
              }
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm rounded-b-lg">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span>AI-generated image based on: "{promptTruncated}"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
