importtypescript
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

  // Load image with retry logic
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");
      
      try {
        console.log(`Generating image (attempt ${retryCount + 1}) with prompt:`, prompt);
        
        // Simplify prompt to reduce errors
        const simplifiedPrompt = prompt.length > 250 
          ? prompt.substring(0, 250) + "..." 
          : prompt;
          
        const response = await generateImage(simplifiedPrompt);
        console.log("Image generation response:", {
          urlLength: response?.length,
          urlStart: response?.substring(0, 50) + "...",
          isBase64: response?.startsWith("data:image"),
          isHttps: response?.startsWith("https:")
        });
        
        if (!response || response.trim() === "") {
          console.error("Empty image URL received");
          throw new Error("Failed to generate image");
        }
        
        // Preload the image to check if it's valid
        await preloadImage(response);
        console.log("Image preloaded successfully");
        
        setImageUrl(response);
        setHasError(false);
      } catch (error) {
        console.error("Error loading image:", error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        
        // Fallback to a placeholder image based on the prompt
        const fallbackUrl = getFallbackImageUrl(prompt);
        console.log("Using fallback image:", fallbackUrl);
        setImageUrl(fallbackUrl);
        
        // Show toast notification for error
        toast.error("Couldn't generate an image right now. Using a sample image instead.");
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [prompt, generateImage, retryCount]);
  
  // Helper function to preload image
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
      
      // Add timeout to prevent hanging on slow loads
      setTimeout(() => reject(new Error("Image load timeout")), 15000);
    });
  };
  
  // Improved fallback image function with more options
  const getFallbackImageUrl = (prompt: string) => {
    // Extract keywords from prompt to find relevant image
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("dinosaur") || lowerPrompt.includes("prehistoric")) {
      return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79?w=800&q=80";
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
  };

  const handleRetry = () => {
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
