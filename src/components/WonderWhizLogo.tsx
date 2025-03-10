
import React, { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

interface WonderWhizLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const WonderWhizLogo: React.FC<WonderWhizLogoProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const logoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logoRef.current) {
      const sparkleElements = Array.from({ length: 5 }).map(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'absolute w-1.5 h-1.5 bg-white rounded-full animate-pulse-glow';
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        return sparkle;
      });
      
      const orbEl = logoRef.current.querySelector('.orb-container');
      sparkleElements.forEach(sparkle => orbEl?.appendChild(sparkle));
      
      return () => {
        sparkleElements.forEach(sparkle => sparkle.remove());
      };
    }
  }, []);
  
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <div 
      ref={logoRef}
      className={`font-bold flex items-center ${sizeClasses[size]} ${className}`}
    >
      {/* Enhanced logo with Pixar/Disney style depth and dimensionality */}
      <div className="relative overflow-visible">
        {/* Shadow layer for depth */}
        <span className="absolute -left-1 -bottom-1 opacity-10 blur-sm bg-clip-text text-black font-rounded">Wonder</span>
        
        {/* Main text with enhanced gradient */}
        <span className="relative bg-clip-text text-transparent bg-gradient-to-br from-wonder-purple via-pixar-blue to-wonder-purple-dark font-rounded">Wonder</span>
        
        {/* Disney-inspired sparkle effect */}
        <Sparkles className="absolute -top-3 -right-2 h-4 w-4 text-wonder-yellow animate-sparkle" />
        <div className="absolute -top-1 -right-1 h-2 w-2 bg-wonder-yellow/30 rounded-full blur-sm"></div>
      </div>
      
      {/* Second word with contrasting gradient */}
      <span className="relative bg-clip-text text-transparent bg-gradient-to-br from-wonder-teal via-pixar-sky to-wonder-teal-dark font-rounded">Whiz</span>
      
      {/* Enhanced magical orb with Pixar-inspired lighting and dimension */}
      <div className="ml-2 relative orb-container">
        {/* Main orb with enhanced gradient and dimension */}
        <div className="w-8 h-8 rounded-full relative overflow-visible z-10">
          {/* Orb background with depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-wonder-purple via-pixar-blue to-wonder-purple-dark shadow-[0_5px_15px_rgba(139,92,246,0.4)]"></div>
          
          {/* Light reflections for 3D effect */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-white/80 rounded-full blur-[1px]"></div>
          <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          
          {/* Additional Pixar-style highlight */}
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-white/20 rounded-full blur-[2px]"></div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute -inset-3 bg-gradient-radial from-wonder-purple/30 to-transparent rounded-full animate-pulse opacity-70 blur-md"></div>
        
        {/* Additional sparkles */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-wonder-yellow/40 rounded-full blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-wonder-teal/40 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default WonderWhizLogo;
