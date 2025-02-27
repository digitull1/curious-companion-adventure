
import React from "react";
import "./TypingIndicator.css";

const TypingIndicator: React.FC = () => {
  return (
    <div className="chat-bubble-ai mb-4 mr-auto max-w-[85%] flex items-center">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
