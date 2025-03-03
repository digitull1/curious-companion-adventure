
import React, { useState, useEffect } from "react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { Image as ImageIcon } from "lucide-react";

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
        const url = await generateImage(prompt);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
        setHasError(true);
        
        // Fallback to a placeholder image based on the prompt
        const fallbackUrl = getFallbackImageUrl(prompt);
        setImageUrl(fallbackUrl);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [prompt, generateImage]);
  
  // Fallback image function
  const getFallbackImageUrl = (prompt: string) => {
    // Extract keywords from prompt to find relevant image
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("dinosaur") || lowerPrompt.includes("prehistoric")) {
      return "https://images.unsplash.com/photo-1519880856348-763a8b40aa79";
    } else if (lowerPrompt.includes("planet") || lowerPrompt.includes("space") || lowerPrompt.includes("solar system")) {
      return "https://images.unsplash.com/photo-1614732414444-096e5f1122d5";
    } else if (lowerPrompt.includes("robot") || lowerPrompt.includes("technology")) {
      return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e";
    } else if (lowerPrompt.includes("animal") || lowerPrompt.includes("wildlife")) {
      return "https://images.unsplash.com/photo-1474511320723-9a56873867b5";
    } else if (lowerPrompt.includes("ocean") || lowerPrompt.includes("sea")) {
      return "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883";
    } else {
      // Default image for other topics
      return "https://images.unsplash.com/photo-1501854140801-50d01698950b";
    }
  };

  return (
    <div className="mt-4 overflow-hidden rounded-lg">
      {isLoading ? (
        <div className="h-60 w-full bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Creating your image...</div>
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
                target.src = getFallbackImageUrl(prompt);
                target.onerror = null; // Prevent infinite fallback loops
              }
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm rounded-b-lg">
            {hasError ? (
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                <span>Image generated for: "{prompt}"</span>
              </div>
            ) : (
              <div>AI-generated image based on: "{prompt}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
