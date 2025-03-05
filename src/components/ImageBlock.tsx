
import React from 'react';

interface ImageBlockProps {
  prompt: string;
  alt: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ prompt, alt }) => {
  console.log('Rendering ImageBlock with prompt:', prompt);
  
  // In a real implementation, this would render an AI-generated image
  // For now, we'll just show a placeholder with the prompt
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-wonder-purple/10 shadow-sm">
      <img 
        src="/placeholder.svg" 
        alt={alt || `Generated image for ${prompt}`} 
        className="w-full h-48 object-cover" 
        onError={(e) => {
          console.error('Error loading image:', e);
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      <div className="p-2 text-xs text-muted-foreground bg-white/80">
        Generated image for: {prompt}
      </div>
    </div>
  );
}

export default ImageBlock;
