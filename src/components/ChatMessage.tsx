
import React, { useRef, useEffect } from "react";
import { animate } from "@motionone/dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  children?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, children }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messageRef.current) {
      // Create a staggered animation for text appearing
      const textElement = messageRef.current.querySelector("p");
      if (textElement) {
        animate(
          messageRef.current,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
        );
      }
      
      // Add ripple effect to user messages
      if (isUser && messageRef.current) {
        const ripple = document.createElement("div");
        ripple.className = "absolute inset-0 rounded-2xl bg-wonder-purple/20 z-[-1]";
        messageRef.current.style.position = "relative";
        messageRef.current.appendChild(ripple);
        
        animate(
          ripple,
          { opacity: [0.6, 0], scale: [0.85, 1.05] },
          { duration: 1, easing: "ease-out" }
        );
        
        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 1000);
      }
      
      // Add enhanced text formatting for AI messages
      if (!isUser && textElement) {
        // Create highlights for important parts of the text
        enhanceTextFormatting(textElement);
      }
    }
  }, [isUser, message]);
  
  // Function to enhance text formatting with highlights for important information
  const enhanceTextFormatting = (textElement: Element) => {
    // Identify questions and enhance them
    const text = textElement.innerHTML;
    
    // Highlight questions with question marks
    const enhancedText = text
      // Make question sentences stand out
      .replace(/([^.!?]+\?)/g, '<span class="text-wonder-purple font-medium">$1</span>')
      // Enhance "Did you know" facts
      .replace(/(Did you know[^.!?]+[.!?])/gi, '<span class="bg-wonder-yellow/10 px-1 py-0.5 rounded">$1</span>')
      // Highlight mind-blowing facts
      .replace(/(Fun fact|Mind-blowing fact|Amazingly|Interestingly|Surprisingly|Incredibly)[^.!?]+[.!?]/gi, 
               '<span class="bg-wonder-blue/10 px-1 py-0.5 rounded">$1</span>');
    
    textElement.innerHTML = enhancedText;
  };

  return (
    <div 
      ref={messageRef}
      className={`mb-6 ${isUser ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}
      style={{ opacity: 0 }} // Start with opacity 0 before animation
    >
      <div className={isUser 
        ? 'chat-bubble-user transform transition-transform active:scale-98' 
        : 'chat-bubble-ai transform transition-transform hover:scale-102'
      }>
        <p className="whitespace-pre-line leading-relaxed text-base font-rounded">{message}</p>
        {children}
      </div>
    </div>
  );
};

export default ChatMessage;
