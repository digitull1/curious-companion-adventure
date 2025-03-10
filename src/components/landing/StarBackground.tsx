
import React, { useEffect, useRef } from "react";
import { createStarryBackground } from "@/utils/confetti";

const StarBackground = () => {
  const starBackgroundRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (starBackgroundRef.current) {
      createStarryBackground(starBackgroundRef.current);
    }
  }, []);
  
  return (
    <div 
      ref={starBackgroundRef}
      className="fixed inset-0 bg-gradient-to-b from-[#0B0B1A] via-[#1A1A3A] to-[#0B0B1A] overflow-hidden z-0"
    >
      {/* This div will be filled with stars via JS */}
    </div>
  );
};

export default StarBackground;
