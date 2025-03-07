
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

interface ImageBlockProps {
  prompt: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ prompt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const generateImage = async () => {
      console.log(`[ImageBlock] Generating image for prompt: ${prompt.substring(0, 50)}...`);
      
      // Reset states when prompt changes
      setIsLoading(true);
      setError(null);
      
      try {
        // This would be an API call to generate an image via Hugging Face
        // For now using a placeholder image service
        
        // Simulate API response time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use a placeholder image service for this demo
        // In production, this would be replaced with a real API call
        const placeholderUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/500`;
        console.log(`[ImageBlock] Generated image URL: ${placeholderUrl}`);
        
        setImageUrl(placeholderUrl);
        setIsLoading(false);
      } catch (err) {
        console.error(`[ImageBlock] Error generating image:`, err);
        
        // Check if we should retry
        if (retryCount < 2) {
          console.log(`[ImageBlock] Retrying image generation (attempt ${retryCount + 1})...`);
          setRetryCount(prev => prev + 1);
          // Retry after a short delay
          setTimeout(() => {
            generateImage();
          }, 1000);
        } else {
          // After max retries, show error and fallback
          const errorMessage = err instanceof Error ? err.message : "Failed to generate image";
          setError(`Generation failed: ${errorMessage}`);
          setIsLoading(false);
          toast.error("Couldn't generate image. Using a placeholder instead.");
          
          // Use a static placeholder as fallback
          setImageUrl(`https://picsum.photos/seed/fallback${Date.now()}/800/500`);
        }
      }
    };

    generateImage();
    
    return () => {
      // Cleanup
      console.log(`[ImageBlock] Cleaning up`);
    };
  }, [prompt, retryCount]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <p className="font-medium">Sorry! I couldn't generate an image.</p>
        <p className="text-sm mt-1">{error}</p>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Fallback illustration" 
            className="w-full h-full object-cover mt-3 rounded-lg"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-wonder-purple/30 border-t-wonder-purple animate-spin"></div>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt="AI generated illustration" 
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        Image generated based on: "{prompt.substring(0, 100)}{prompt.length > 100 ? '...' : ''}"
      </p>
    </div>
  );
};

export default ImageBlock;
