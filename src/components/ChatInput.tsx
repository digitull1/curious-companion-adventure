
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Lightbulb, Search, Mic, MicOff } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import SuggestedTopics from "@/components/SuggestedTopics";
import { animate, spring } from "@motionone/dom";

interface ChatInputProps {
  inputValue: string;
  isProcessing: boolean;
  selectedTopic: string | null;
  suggestedPrompts: string[];
  isListening: boolean;
  showSuggestedPrompts: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onVoiceInput: (transcript: string) => void;
  toggleListening: () => void;
  onSuggestedPromptClick: (prompt: string) => void;
  setShowSuggestedPrompts: (show: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isProcessing,
  selectedTopic,
  suggestedPrompts,
  isListening,
  showSuggestedPrompts,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onVoiceInput,
  toggleListening,
  onSuggestedPromptClick,
  setShowSuggestedPrompts
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isRippling, setIsRippling] = useState(false);
  
  const placeholders = [
    "Ask me anything...",
    "What are you curious about today?",
    "Let's learn something cool!",
    "What would you like to explore?",
    "I'm here to help you discover!",
    "Ask me about animals, space, or science!",
    "Wonder about something? Ask me!",
    "What's on your mind today?",
  ];
  
  // Rotate placeholders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFocused && !inputValue) {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isFocused, inputValue, placeholders.length]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Animate the input container on mount
    if (inputContainerRef.current) {
      animate(
        inputContainerRef.current,
        { y: [20, 0], opacity: [0, 1] },
        { duration: 0.5, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }, []);

  // Handle focus animations
  useEffect(() => {
    if (inputContainerRef.current) {
      if (isFocused) {
        animate(
          inputContainerRef.current,
          { scale: [1, 1.01], y: [0, -2] },
          { duration: 0.3, easing: "ease-out" }
        );
      } else {
        animate(
          inputContainerRef.current,
          { scale: [1.01, 1], y: [-2, 0] },
          { duration: 0.3, easing: "ease-out" }
        );
      }
    }
  }, [isFocused]);

  // Handle send button ripple effect
  const triggerRipple = () => {
    if (!isRippling && inputValue.trim() && !isProcessing) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 500);
    }
  };

  const getPlaceholder = () => {
    if (selectedTopic) {
      return `Ask me about ${selectedTopic} or explore a section...`;
    }
    return placeholders[placeholderIndex];
  };

  const handleSendClick = () => {
    if (inputValue.trim() && !isProcessing) {
      // Create ripple effect on send
      if (inputContainerRef.current) {
        const sendButton = inputContainerRef.current.querySelector('button:last-child');
        if (sendButton) {
          animate(
            sendButton,
            { scale: [1, 0.94, 1] },
            { duration: 0.3, easing: spring({ stiffness: 500, damping: 15 }) }
          );
        }
      }
      
      triggerRipple();
      onSendMessage();
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 py-6 px-4 md:px-6 z-20">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-wonder-background/95 to-transparent backdrop-blur-xl"></div>
      
      {/* Suggested topics overlay */}
      {showSuggestedPrompts && (
        <SuggestedTopics
          topics={suggestedPrompts}
          onTopicClick={onSuggestedPromptClick}
          onClose={() => setShowSuggestedPrompts(false)}
        />
      )}
      
      {/* Main input container */}
      <div className="relative max-w-4xl mx-auto z-10" ref={inputContainerRef}>
        <div 
          className={`relative transition-all duration-300 bg-white/95 backdrop-blur-lg rounded-2xl shadow-magical ${
            isFocused 
              ? 'border-2 border-wonder-purple shadow-[0_8px_25px_rgba(139,92,246,0.25)]' 
              : 'border border-wonder-purple/20'
          }`}
        >
          {/* Animated glow effect when focused */}
          {isFocused && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-wonder-purple/30 to-wonder-yellow/30 rounded-[22px] blur-sm animate-pulse-slow z-[-1]"></div>
          )}
          
          {/* Input wrapper */}
          <div className="relative flex items-center gap-3 px-5 py-4">
            <div className={`transition-all duration-300 ${isFocused ? 'text-wonder-purple scale-110' : 'text-wonder-purple/70'}`}>
              {inputValue ? <Search className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={getPlaceholder()}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-slate-400/80
                font-comic text-lg focus:ring-0 disabled:opacity-70"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSuggestedPrompts(true)}
                className="h-10 w-10 rounded-xl flex items-center justify-center 
                  bg-wonder-yellow/10 text-wonder-yellow hover:bg-wonder-yellow/20
                  transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Need ideas?"
              >
                <Lightbulb className="h-5 w-5" />
              </button>
              
              <button
                onClick={toggleListening}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 
                  ${isListening 
                    ? "bg-wonder-coral/10 text-wonder-coral hover:bg-wonder-coral/20" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    <span className="absolute inset-0 rounded-xl animate-pulse bg-wonder-coral/20"></span>
                  </>
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={handleSendClick}
                disabled={!inputValue.trim() || isProcessing}
                className={`px-4 h-10 flex items-center justify-center rounded-xl transition-all duration-300 
                  ${inputValue.trim() && !isProcessing
                    ? "bg-gradient-to-r from-wonder-purple to-wonder-purple-dark text-white shadow-magical hover:shadow-magical-hover transform hover:-translate-y-0.5"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                {isProcessing ? (
                  <div className="h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
