
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
    <div className="sticky bottom-0 left-0 right-0 py-8 px-4 md:px-6 z-20">
      {/* Magical gradient background with Pixar/Disney feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-wonder-background to-white/30 backdrop-blur-lg border-t border-wonder-purple/10"></div>
      
      {/* Suggested topics overlay */}
      {showSuggestedPrompts && (
        <SuggestedTopics
          topics={suggestedPrompts}
          onTopicClick={onSuggestedPromptClick}
          onClose={() => setShowSuggestedPrompts(false)}
        />
      )}
      
      {/* Chat Input Container */}
      <div className="relative max-w-4xl mx-auto z-10">
        {/* Decorative elements inspired by Pixar/Disney magical feel */}
        <div className="absolute -left-8 -top-14 w-20 h-20 bg-wonder-yellow/15 rounded-full blur-xl"></div>
        <div className="absolute -right-10 -bottom-8 w-24 h-24 bg-wonder-purple/15 rounded-full blur-xl"></div>
        <div className="absolute right-1/4 -top-10 w-12 h-12 bg-wonder-coral/15 rounded-full blur-lg"></div>
        
        {/* Main input container with pixar-inspired styling */}
        <div className={`relative transition-all duration-300 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-[3px] ${
          isFocused 
            ? 'border-wonder-purple/60 shadow-[0_10px_40px_rgba(139,92,246,0.2)]' 
            : 'border-wonder-purple/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
        }`}>
          {/* Input wrapper with improved spacing */}
          <div className="relative flex items-center pl-5 pr-32 py-5">
            {/* Left icon with Disney-inspired glow */}
            <div className={`mr-3 transition-all duration-300 ${isFocused ? 'text-wonder-purple scale-110' : 'text-wonder-purple/70'}`}>
              {inputValue ? (
                <Search className="h-5 w-5" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
              {isFocused && <div className="absolute inset-0 bg-wonder-purple/10 rounded-full blur-md -z-10"></div>}
            </div>
            
            {/* Input field with Apple-inspired smooth styling */}
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
              className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 
                text-foreground font-comic text-lg placeholder:text-slate-400/80"
            />
          </div>
          
          {/* Action buttons container with proper spacing - Apple-inspired clean layout */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {/* Ideas button - inspired by Chupa Chups colorful design */}
            <button
              onClick={() => setShowSuggestedPrompts(true)}
              className="h-10 w-10 mr-3 rounded-full flex items-center justify-center 
                bg-wonder-yellow text-white hover:bg-wonder-yellow-dark 
                shadow-[0_4px_10px_rgba(250,204,21,0.3)] hover:shadow-[0_4px_15px_rgba(250,204,21,0.4)]
                transition-all duration-300 hover:scale-105 active:scale-95 group"
              aria-label="Need ideas?"
            >
              <Lightbulb className="h-5 w-5" />
              <span className="absolute -top-12 bg-wonder-yellow text-white text-xs py-2 px-3 rounded-xl 
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap
                shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                Need ideas?
              </span>
            </button>
            
            {/* Voice Input Button - inspired by Apple's clean design */}
            <button
              onClick={toggleListening}
              className={`h-10 w-10 mr-3 flex items-center justify-center rounded-full transition-all duration-300 
                ${isListening 
                  ? "bg-wonder-coral text-white shadow-[0_4px_10px_rgba(248,113,158,0.4)]" 
                  : "bg-white border-2 border-gray-200 text-gray-400 hover:border-wonder-purple/30 hover:text-wonder-purple"}`}
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
            
            {/* Send Button - inspired by Pixar's dimensional style */}
            <button
              onClick={() => {
                if (inputValue.trim() && !isProcessing) {
                  triggerRipple();
                  onSendMessage();
                }
              }}
              disabled={!inputValue.trim() || isProcessing}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                inputValue.trim() && !isProcessing
                  ? "bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_10px_25px_rgba(124,58,237,0.4)] transform hover:-translate-y-0.5 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } relative overflow-hidden`}
              aria-label="Send message"
            >
              {isProcessing ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
              
              {/* Ripple effect on send */}
              {isRippling && (
                <span className="absolute inset-0 bg-white/30 animate-ripple rounded-full"></span>
              )}
              
              {/* 3D effect for the button - Pixar style */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
            </button>
          </div>
        </div>

        {/* Playful decorative elements - inspired by Disney's magical worlds */}
        <div className="absolute -left-4 -top-4 w-8 h-8 bg-wonder-yellow/30 rounded-full blur-sm hidden md:block"></div>
        <div className="absolute -right-6 -bottom-6 w-10 h-10 bg-wonder-purple/30 rounded-full blur-sm hidden md:block"></div>
        <div className="absolute left-1/3 -bottom-3 w-6 h-6 bg-wonder-teal/30 rounded-full blur-sm hidden md:block"></div>
      </div>
    </div>
  );
};

export default ChatInput;
