
import React, { useState, useEffect } from "react";
import { useOpenAI } from "@/hooks/useOpenAI";

interface ImageBlockProps {
  prompt: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ prompt }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { generateImage } = useOpenAI();

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await generateImage(prompt);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [prompt, generateImage]);

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
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm rounded-b-lg">
            AI-generated image based on: "{prompt}"
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
