
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Lightbulb, Search, Image } from "lucide-react";
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
  onImageUpload?: (file: File) => void;
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
  setShowSuggestedPrompts,
  onImageUpload
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  const placeholders = [
    "Ask me anything...",
    "What are you curious about today?",
    "Let's learn something cool!",
    "What would you like to explore?",
    "I'm here to help you discover!",
    "Ask me about animals, space, or science!",
    "Wonder about something? Ask me!",
    "What's on your mind today?",
    "Need help with homework? Upload it!",
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

  const getPlaceholder = () => {
    if (selectedTopic) {
      return `Ask me about ${selectedTopic} or explore a section...`;
    }
    return placeholders[placeholderIndex];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[ChatInput] File input change event triggered");
    if (e.target.files && e.target.files[0] && onImageUpload) {
      const file = e.target.files[0];
      console.log(`[ChatInput] File selected: ${file.name}, ${file.type}, ${file.size} bytes`);
      onImageUpload(file);
      // Reset file input
      if (e.target.value) {
        console.log("[ChatInput] Resetting file input");
        e.target.value = '';
      }
    } else {
      console.log("[ChatInput] No file selected or onImageUpload not provided", {
        hasFiles: e.target.files && e.target.files.length > 0,
        hasHandler: !!onImageUpload
      });
    }
  };

  const triggerFileInput = () => {
    console.log("[ChatInput] Triggering file input click");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("[ChatInput] File input ref is null");
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/90 to-white/70 backdrop-blur-lg pt-6 pb-4 px-4 md:px-8 z-20">
      {/* Suggested topics overlay */}
      {showSuggestedPrompts && (
        <SuggestedTopics
          topics={suggestedPrompts}
          onTopicClick={onSuggestedPromptClick}
          onClose={() => setShowSuggestedPrompts(false)}
        />
      )}
      
      {/* Chat Input */}
      <div className="relative max-w-3xl mx-auto">
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
            className={`w-full pl-12 pr-16 py-4 rounded-full border focus:outline-none focus:ring-2 shadow-magical bg-white/90 backdrop-blur-sm placeholder:text-slate-400 text-foreground font-comic text-base transition-all duration-300 ${
              isFocused 
                ? 'border-wonder-purple/50 focus:ring-wonder-purple/30 shadow-magical-hover' 
                : 'border-wonder-purple/20 focus:ring-wonder-purple/30 shadow-wonder'
            }`}
          />
          
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-wonder-purple scale-110' : 'text-wonder-purple/70'}`}>
            {inputValue ? (
              <Search className="h-5 w-5" />
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={isProcessing}
            />
            
            {/* Image upload button */}
            <button
              onClick={triggerFileInput}
              disabled={isProcessing}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 bg-wonder-purple/10 text-wonder-purple hover:bg-wonder-purple/20 transform hover:-translate-y-0.5"
              title="Upload homework image"
              type="button"
            >
              <Image className="h-4 w-4" />
            </button>
            
            <VoiceInput 
              onTranscript={onVoiceInput}
              isListening={isListening}
              toggleListening={toggleListening}
            />
            
            <button
              onClick={onSendMessage}
              disabled={(!inputValue.trim() && !fileInputRef.current?.files?.length) || isProcessing}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                (inputValue.trim() || fileInputRef.current?.files?.length) && !isProcessing
                  ? "bg-gradient-to-br from-wonder-purple to-wonder-purple-dark text-white shadow-magical hover:shadow-magical-hover transform hover:-translate-y-0.5 hover:scale-105"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              type="button"
            >
              {isProcessing ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* Ideas button */}
        <button
          onClick={() => setShowSuggestedPrompts(true)}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-wonder-purple/10 text-wonder-purple hover:bg-wonder-purple/20 transition-colors"
          type="button"
        >
          <Lightbulb className="h-3 w-3" />
          <span>Need ideas?</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
