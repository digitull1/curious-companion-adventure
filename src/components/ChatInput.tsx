
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Lightbulb, Search, Mic, MicOff, Image, Camera } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  generateFreshTopics?: () => void;
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
  onImageUpload,
  generateFreshTopics
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isRippling, setIsRippling] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
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
    if (!isRippling && (inputValue.trim() || selectedImage) && !isProcessing) {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // If there's an image upload handler, call it
      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleIdeasClick = () => {
    // If generateFreshTopics is provided, call it first to get fresh topics
    if (generateFreshTopics) {
      generateFreshTopics();
    }
    // Then show the suggested prompts
    setShowSuggestedPrompts(true);
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

            {/* Hidden file input for image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isProcessing}
            />
          </div>
          
          {/* Action buttons container with proper spacing - Apple-inspired clean layout */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {/* Image upload button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={triggerFileInput}
                    className="h-10 w-10 mr-3 rounded-full flex items-center justify-center 
                      bg-wonder-teal text-white hover:bg-wonder-teal-dark 
                      shadow-[0_4px_10px_rgba(45,212,191,0.3)] hover:shadow-[0_4px_15px_rgba(45,212,191,0.4)]
                      transition-all duration-300 hover:scale-105 active:scale-95 group"
                    aria-label="Upload an image"
                    disabled={isProcessing}
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-wonder-teal text-white font-comic text-sm py-2 px-3 rounded-xl">
                  <p>Upload a picture of your homework!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Ideas button - inspired by Chupa Chups colorful design */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleIdeasClick}
                    className="h-10 w-10 mr-3 rounded-full flex items-center justify-center 
                      bg-wonder-yellow text-white hover:bg-wonder-yellow-dark 
                      shadow-[0_4px_10px_rgba(250,204,21,0.3)] hover:shadow-[0_4px_15px_rgba(250,204,21,0.4)]
                      transition-all duration-300 hover:scale-105 active:scale-95 group"
                    aria-label="Need ideas?"
                  >
                    <Lightbulb className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-wonder-yellow text-white font-comic text-sm py-2 px-3 rounded-xl">
                  <p>Click for fun learning topics!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Voice Input Button - inspired by Apple's clean design */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-wonder-coral text-white font-comic text-sm py-2 px-3 rounded-xl">
                  <p>{isListening ? "Stop talking" : "Talk to me!"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Send Button - inspired by Pixar's dimensional style */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      if ((inputValue.trim() || selectedImage) && !isProcessing) {
                        triggerRipple();
                        onSendMessage();
                        setSelectedImage(null);
                      }
                    }}
                    disabled={(!inputValue.trim() && !selectedImage) || isProcessing}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                      (inputValue.trim() || selectedImage) && !isProcessing
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
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-wonder-purple text-white font-comic text-sm py-2 px-3 rounded-xl">
                  <p>Send your question!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Display selected image preview if any */}
          {selectedImage && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-white/90 rounded-lg shadow-md border border-wonder-purple/20 flex items-center space-x-2">
              <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Selected" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-700 font-medium">{selectedImage.name}</span>
              <button 
                onClick={() => setSelectedImage(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
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
