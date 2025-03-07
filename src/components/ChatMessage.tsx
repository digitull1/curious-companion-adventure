
import React, { useRef, useEffect, useState } from "react";
import { animate } from "@motionone/dom";
import { Sparkles, Star, Heart, Lightbulb, Info, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import confetti from "canvas-confetti";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  children?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, children }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Function to clean text content by removing asterisks
  const cleanMessageText = (text: string) => {
    // Remove all asterisks from text
    return text.replace(/\*\*/g, "");
  };
  
  // Clean the message text
  const cleanedMessage = cleanMessageText(message);

  // Function to trigger micro-confetti
  const triggerMicroConfetti = () => {
    if (messageRef.current && !isUser && !hasInteracted) {
      const rect = messageRef.current.getBoundingClientRect();
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { 
          x: (rect.left + 30) / window.innerWidth, 
          y: (rect.top + 30) / window.innerHeight 
        },
        gravity: 0.5,
        colors: ['#7c3aed', '#9d74f8', '#F59E0B', '#14B8A6'],
        scalar: 0.6,
        disableForReducedMotion: true
      });
      setHasInteracted(true);
    }
  };
  
  useEffect(() => {
    if (messageRef.current) {
      // Create a staggered animation for text appearing
      animate(
        messageRef.current,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, easing: [0.25, 1, 0.5, 1] }
      );
      
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
    }
  }, [isUser]);

  // Random helper icon selection for AI messages
  const getRandomIconForAI = () => {
    const icons = [<Sparkles key="sparkles" />, <Lightbulb key="lightbulb" />, <Star key="star" />];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <div 
      ref={messageRef}
      className={`mb-6 ${isUser ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[85%]'}`}
      style={{ opacity: 0 }} // Start with opacity 0 before animation
      onClick={() => !isUser && triggerMicroConfetti()}
    >
      <div 
        className={isUser 
          ? 'chat-bubble-user transform transition-transform active:scale-98 relative hover:shadow-magical-hover focus-visible:ring-2 focus-visible:ring-wonder-purple/50 focus-visible:outline-none' 
          : 'chat-bubble-ai transform transition-transform hover:scale-102 relative hover:shadow-wonder-lg focus-visible:ring-2 focus-visible:ring-wonder-purple/30 focus-visible:outline-none'
        }
        tabIndex={!isUser ? 0 : undefined}
        role={!isUser ? "button" : undefined}
        aria-label={!isUser ? "Chat message with interactive elements" : undefined}
      >
        {/* Enhanced visual effects for AI responses */}
        {!isUser && (
          <>
            <span className="absolute -top-1 -left-1 h-4 w-4 text-wonder-yellow/70 animate-sparkle">
              {getRandomIconForAI()}
            </span>
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-wonder-purple/5 to-transparent rounded-xl rounded-tl-sm blur-sm z-[-1] opacity-80"></div>
          </>
        )}
        
        {/* Enhanced visual for user messages */}
        {isUser && (
          <>
            <Heart 
              className="absolute -top-1 -right-1 h-4 w-4 text-white/70 animate-pulse-soft" 
              fill="currentColor"
            />
            <div className="absolute -inset-0.5 bg-gradient-to-br from-wonder-purple-light/30 to-transparent rounded-xl rounded-tr-sm blur-sm z-[-1] opacity-70"></div>
          </>
        )}
        
        <div className="relative z-10">
          <p className="whitespace-pre-line leading-relaxed text-base font-rounded mb-2">
            {cleanedMessage}
          </p>
          {children}
        </div>
        
        {/* Enhanced tooltip for user to know they can tap on non-user messages for more info */}
        {!isUser && !message.includes("I'd love to teach you about") && (
          <div className="mt-2 text-xs text-wonder-purple/70 flex items-center opacity-70 group transition-all duration-300 hover:opacity-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <Info className="h-3 w-3 mr-1.5 group-hover:text-wonder-purple transition-colors" /> 
                    <span className="group-hover:text-wonder-purple transition-colors">Tap to interact</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-white/95 backdrop-blur-sm border border-wonder-purple/20 shadow-magical">
                  <p className="text-xs">Tap on content to explore more!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
