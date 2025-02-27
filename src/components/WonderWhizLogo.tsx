
import React from "react";

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
      <span className="text-wonder-purple">Wonder</span>
      <span className="text-wonder-teal">Whiz</span>
      <div className="ml-2 relative">
        <div className="w-6 h-6 bg-gradient-wonder rounded-full animate-pulse-soft"></div>
        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default WonderWhizLogo;
