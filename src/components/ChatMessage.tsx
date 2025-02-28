
import React, { useRef, useEffect } from "react";
import { animate } from "@motionone/dom";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  children?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, children }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messageRef.current) {
      // Apply animation when the component mounts
      animate(
        messageRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, easing: [0.25, 1, 0.5, 1] }
      );
    }
  }, []);

  return (
    <div 
      ref={messageRef}
      className={`mb-6 ${isUser ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}
      style={{ opacity: 0 }} // Start with opacity 0 before animation
    >
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
        <p className="whitespace-pre-line leading-relaxed">{message}</p>
        {children}
      </div>
    </div>
  );
};

export default ChatMessage;
