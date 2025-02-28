
import React from "react";
import { Sparkles } from "lucide-react";

interface WonderWhizLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const WonderWhizLogo: React.FC<WonderWhizLogoProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <div className={`font-bold flex items-center ${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-wonder-purple to-wonder-purple-dark">Wonder</span>
        <Sparkles className="absolute -top-3 -right-2 h-3 w-3 text-wonder-yellow animate-sparkle" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-wonder-teal to-wonder-teal">Whiz</span>
      <div className="ml-2 relative">
        <div className="w-6 h-6 bg-gradient-wonder rounded-full shadow-wonder animate-pulse-soft"></div>
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>
    </div>
  );
};

export default WonderWhizLogo;
