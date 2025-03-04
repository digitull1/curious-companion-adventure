
import React, { useState, useEffect } from "react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Image as ImageIcon, ImageOff } from "lucide-react";

interface ImageBlockProps {
  prompt: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ prompt }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const { generateImage } = useOpenAI();

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        console.log("Generating image with prompt:", prompt);
        const url = await generateImage(prompt);
        console.log("Image URL received:", url);
        
        if (!url || url.trim() === "") {
          console.error("Empty image URL received");
          throw new Error("Failed to generate image");
        }
        
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
        setHasError(true);
        
        // Fallback to a placeholder image based on the prompt
        const fallbackUrl = getFallbackImageUrl(prompt);
        console.log("Using fallback image:", fallbackUrl);
        setImageUrl(fallbackUrl);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [prompt, generateImage]);
  
  // Improved fallback image function
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
    } else {
      // Default image for other topics
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80";
    }
  };

  return (
    <div className="mt-4 overflow-hidden rounded-lg">
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
            alt={prompt}
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
            <div className="flex items-center">
              <ImageOff className="h-4 w-4 mr-2 text-red-300" />
              <span>Using placeholder image for: "{prompt}"</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full h-auto rounded-lg shadow-wonder animate-fade-in"
            style={{ maxHeight: "400px", objectFit: "cover" }}
            onError={(e) => {
              // If the image fails to load, replace with a fallback
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('unsplash')) {
                console.log("Image failed to load, using fallback");
                target.src = getFallbackImageUrl(prompt);
                setHasError(true);
                target.onerror = null; // Prevent infinite fallback loops
              }
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm rounded-b-lg">
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span>AI-generated image based on: "{prompt}"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
