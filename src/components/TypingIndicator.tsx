
import React, { useEffect, useState } from "react";
import "./TypingIndicator.css";

const TypingIndicator: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Add an automatic reset mechanism in case the typing indicator gets stuck
  useEffect(() => {
    // Randomly pause the animation to make it more natural
    const pauseInterval = setInterval(() => {
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 300);
    }, 3000);
    
    // Log mount/unmount for debugging
    console.log("[TypingIndicator] Mounted - AI is typing");
    
    return () => {
      clearInterval(pauseInterval);
      console.log("[TypingIndicator] Unmounted - AI finished typing");
    };
  }, []);
  
  return (
    <div className="chat-bubble-ai mb-6 mr-auto max-w-[85%] flex items-center">
      <div className={`typing-indicator ${isPaused ? 'paused' : ''}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
