
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
      <div className="relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-wonder-purple to-wonder-purple-dark font-rounded">Wonder</span>
        <Sparkles className="absolute -top-3 -right-2 h-3 w-3 text-wonder-yellow animate-sparkle" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-wonder-teal to-wonder-teal-dark font-rounded">Whiz</span>
      <div className="ml-2 relative orb-container">
        <div className="w-7 h-7 rounded-full shadow-magical animate-pulse-glow relative overflow-visible bg-gradient-to-r from-wonder-purple via-wonder-purple-light to-wonder-purple z-10">
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/80 rounded-full"></div>
          <div className="absolute top-2 left-3 w-1 h-1 bg-white/50 rounded-full"></div>
        </div>
        <div className="absolute -inset-2 bg-gradient-radial from-wonder-purple/20 to-transparent rounded-full animate-pulse opacity-70"></div>
      </div>
    </div>
  );
};

export default WonderWhizLogo;
