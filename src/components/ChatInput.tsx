
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Lightbulb, Search, Mic, MicOff } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import SuggestedTopics from "@/components/SuggestedTopics";

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
  }, []);

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

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/90 to-white/70 backdrop-blur-lg pt-10 pb-8 px-4 md:px-8 z-20">
      {/* Suggested topics overlay */}
      {showSuggestedPrompts && (
        <SuggestedTopics
          topics={suggestedPrompts}
          onTopicClick={onSuggestedPromptClick}
          onClose={() => setShowSuggestedPrompts(false)}
        />
      )}
      
      {/* Chat Input */}
      <div className="relative max-w-4xl mx-auto">
        <div className={`relative flex transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
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
            className={`w-full pl-12 pr-36 py-7 rounded-2xl border-2 focus:outline-none focus:ring-2 shadow-magical bg-white/95 backdrop-blur-sm 
              placeholder:text-slate-400 text-foreground font-comic text-lg transition-all duration-300 
              ${isFocused 
                ? 'border-wonder-purple/60 focus:ring-wonder-purple/40 shadow-magical-hover' 
                : 'border-wonder-purple/30 focus:ring-wonder-purple/30 shadow-wonder'}`}
          />
          
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-wonder-purple scale-110' : 'text-wonder-purple/70'}`}>
            {inputValue ? (
              <Search className="h-5 w-5" />
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
          </div>
          
          {/* Action buttons container with proper spacing */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
            {/* Lightbulb for ideas */}
            <button
              onClick={() => setShowSuggestedPrompts(true)}
              className="h-10 w-10 rounded-full flex items-center justify-center 
                transition-all duration-300 bg-wonder-yellow/20 text-wonder-yellow hover:bg-wonder-yellow/30 
                hover:scale-110 group"
              aria-label="Need ideas?"
            >
              <Lightbulb className="h-6 w-6 animate-pulse-soft" />
              <span className="absolute -top-10 bg-wonder-yellow/90 text-white text-xs py-1 px-2 rounded-lg 
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                Need ideas?
              </span>
            </button>
            
            {/* Voice Input Button */}
            <button
              onClick={toggleListening}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 
                ${isListening 
                  ? "bg-wonder-coral text-white animate-pulse shadow-magical" 
                  : "bg-white border-2 border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-wonder-purple"}`}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5" />
                  {/* Ripple animation for active recording */}
                  <span className="absolute inset-0 rounded-full animate-ripple bg-wonder-coral/30"></span>
                </>
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
            
            {/* Send Button */}
            <button
              onClick={() => {
                if (inputValue.trim() && !isProcessing) {
                  triggerRipple();
                  onSendMessage();
                }
              }}
              disabled={!inputValue.trim() || isProcessing}
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 ${
                inputValue.trim() && !isProcessing
                  ? "bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-white shadow-magical hover:shadow-magical-hover transform hover:-translate-y-0.5 hover:scale-105"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } relative overflow-hidden`}
              aria-label="Send message"
            >
              {isProcessing ? (
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-6 w-6" />
              )}
              
              {/* Ripple effect on send */}
              {isRippling && (
                <span className="absolute inset-0 bg-white/30 animate-ripple rounded-full"></span>
              )}
            </button>
          </div>
        </div>
        
        {/* Fun decorative elements to make it more attractive for kids */}
        <div className="absolute -left-6 -top-6 w-12 h-12 bg-wonder-yellow/10 rounded-full animate-pulse-soft hidden md:block"></div>
        <div className="absolute -right-4 -bottom-4 w-8 h-8 bg-wonder-purple/10 rounded-full animate-pulse-glow hidden md:block"></div>
      </div>
    </div>
  );
};

export default ChatInput;
