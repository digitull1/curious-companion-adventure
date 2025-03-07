
import React, { useState, useEffect } from 'react';

interface ImageBlockProps {
  prompt: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ prompt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll use a placeholder image
    console.log(`[ImageBlock] Generating image for prompt: ${prompt.substring(0, 50)}...`);
    
    // Simulate image loading
    setIsLoading(true);
    
    // This would normally be an API call to generate an image
    setTimeout(() => {
      setIsLoading(false);
      // Use a placeholder image service
      setImageUrl(`https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/500`);
    }, 2000);
    
    return () => {
      // Cleanup
    };
  }, [prompt]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <p className="font-medium">Sorry! I couldn't generate an image.</p>
        <p className="text-sm mt-1">{error}</p>
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
